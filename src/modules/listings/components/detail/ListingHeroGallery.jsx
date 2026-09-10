import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, PlayCircle, X, ZoomIn } from "lucide-react";

const MediaLightbox = ({
  activeIndex,
  items,
  onClose,
  onNext,
  onPrevious,
  onSelect,
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNext, onPrevious]);

  if (!items.length) return null;

  const activeMedia = items[activeIndex] || items[0];

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-slate-950 text-white">
      <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Vehicle media</p>
          <p className="text-xs font-medium text-white/60">
            {activeIndex + 1} / {items.length}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          aria-label="Close fullscreen media viewer"
        >
          <X size={20} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-4 sm:px-16">
        {items.length > 1 ? (
          <>
            <button
              type="button"
              onClick={onPrevious}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 sm:left-5"
              aria-label="Previous media"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 sm:right-5"
              aria-label="Next media"
            >
              <ChevronRight size={24} />
            </button>
          </>
        ) : null}

        {activeMedia.type === "video" ? (
          <video
            src={activeMedia.url}
            controls
            autoPlay
            className="max-h-full max-w-full rounded-lg bg-black"
          />
        ) : (
          <img
            src={activeMedia.url}
            alt="Vehicle"
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        )}
      </div>

      <div className="flex h-24 items-center gap-2 overflow-x-auto border-t border-white/10 px-4">
        {items.map((item, index) => (
          <button
            key={`${item.url}-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={`h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition ${
              activeIndex === index ? "border-white" : "border-white/20 hover:border-white/50"
            }`}
            aria-label={`Show media ${index + 1}`}
          >
            {item.type === "video" ? (
              <span className="flex h-full w-full items-center justify-center bg-slate-900">
                <PlayCircle size={20} />
              </span>
            ) : (
              <img src={item.url} alt="" className="h-full w-full object-cover" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const ListingHeroGallery = ({ media }) => {
  const images = media?.images || [];
  const video = media?.video;
  const featuredImage = media?.featuredImage;

  const allThumbs = [
    ...(featuredImage ? [{ type: "image", url: featuredImage.url }] : []),
    ...images.map((image) => ({ type: "image", url: image.url })),
    ...(video ? [{ type: "video", url: video.url }] : []),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const activeMedia = allThumbs[activeIndex];
  const showPrevious = () =>
    setActiveIndex((current) => (current === 0 ? allThumbs.length - 1 : current - 1));
  const showNext = () =>
    setActiveIndex((current) => (current + 1) % allThumbs.length);

  if (allThumbs.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
        No media uploaded for this listing
      </div>
    );
  }

  return (
    <div className="relative h-64 overflow-hidden rounded-xl sm:h-80">
      {activeMedia?.type === "video" ? (
        <video src={activeMedia.url} controls className="h-full w-full object-cover" />
      ) : (
        <img src={activeMedia?.url} alt="Vehicle" className="h-full w-full object-cover" />
      )}
      {activeMedia?.type === "image" ? (
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute inset-0 cursor-zoom-in"
          aria-label="Open fullscreen media viewer"
        />
      ) : null}
      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white">
        <ZoomIn size={13} />
        {activeIndex + 1}/{allThumbs.length}
      </span>

      <div className="absolute bottom-3 right-3 flex gap-1.5">
        {allThumbs.slice(0, 6).map((thumb, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-10 w-14 overflow-hidden rounded-lg border-2 transition-all duration-150 ${
              index === activeIndex ? "border-white" : "border-white/40"
            }`}
          >
            {thumb.type === "video" ? (
              <div className="flex h-full w-full items-center justify-center bg-slate-900">
                <PlayCircle size={16} className="text-white" />
              </div>
            ) : (
              <img src={thumb.url} alt="" className="h-full w-full object-cover" />
            )}
          </button>
        ))}
        {allThumbs.length > 6 && (
          <button
            type="button"
            onClick={() => {
              setActiveIndex(6);
              setIsLightboxOpen(true);
            }}
            className="flex h-10 w-14 items-center justify-center rounded-lg border-2 border-white/40 bg-slate-950/70 text-xs font-semibold text-white transition hover:bg-slate-950/85"
            aria-label={`Open ${allThumbs.length - 6} more media items`}
          >
            +{allThumbs.length - 6}
          </button>
        )}
      </div>

      {isLightboxOpen ? (
        <MediaLightbox
          activeIndex={activeIndex}
          items={allThumbs}
          onClose={() => setIsLightboxOpen(false)}
          onNext={showNext}
          onPrevious={showPrevious}
          onSelect={setActiveIndex}
        />
      ) : null}
    </div>
  );
};

export default ListingHeroGallery;
