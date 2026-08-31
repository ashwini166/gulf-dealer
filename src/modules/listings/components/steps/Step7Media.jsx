import { useRef, useState } from "react";
import { FileText, ImagePlus, Trash2, Upload, Video, X } from "lucide-react";

import { useBulkVehicleWizard } from "../../context/BulkVehicleWizardContext";
import WizardFooterNav from "../WizardFooterNav";

import { carFormConfig } from "../../config/categoryForms/carForm.config";
import { commercialFormConfig } from "../../config/categoryForms/commercialForm.config";
import { heavyEquipmentFormConfig } from "../../config/categoryForms/heavyEquipmentForm.config";
import { motorbikeFormConfig } from "../../config/categoryForms/motorbikeForm.config";
import { buggyFormConfig } from "../../config/categoryForms/buggyForm.config";
import { caravanFormConfig } from "../../config/categoryForms/caravanForm.config";
import { specialNumberFormConfig } from "../../config/categoryForms/specialNumberForm.config";
import { scrollElementIntoWizardView } from "../../utils/wizardScroll";

const configByFormType = {
  CAR: carFormConfig,
  COMMERCIAL: commercialFormConfig,
  HEAVY_EQUIPMENT: heavyEquipmentFormConfig,
  MOTORBIKE: motorbikeFormConfig,
  BUGGY: buggyFormConfig,
  CARAVAN: caravanFormConfig,
  SPECIAL_NUMBER: specialNumberFormConfig,
};

const Step7Media = () => {
  const { listing, isSaving, saveMedia, goPrevious, saveDraft } = useBulkVehicleWizard();

  const maxPhotos = listing?.planLimitsSnapshot?.maxPhotosSnapshot ?? null;
  const maxVideos = listing?.planLimitsSnapshot?.maxVideosSnapshot ?? 0;
  const videoAllowed = Boolean(maxVideos);

  const formType = listing?.category?.vehicleFormType || "CAR";
  const config = configByFormType[formType] || carFormConfig;
  const hasSecondaryGallery = Boolean(config.hasSecondaryGallery);
  const secondaryGalleryLabel = config.secondaryGalleryLabel || "Additional Images";

  const [existingSecondaryImages, setExistingSecondaryImages] = useState(
    listing?.media?.secondaryImages || []
  );
  const [newSecondaryImageFiles, setNewSecondaryImageFiles] = useState([]);
  const [newSecondaryImagePreviews, setNewSecondaryImagePreviews] = useState([]);
  const [isDraggingSecondaryImages, setIsDraggingSecondaryImages] = useState(false);

  const [existingImages, setExistingImages] = useState(listing?.media?.images || []);
  const [existingFeaturedImage, setExistingFeaturedImage] = useState(listing?.media?.featuredImage || null);
  const [existingVideo, setExistingVideo] = useState(listing?.media?.video || null);
  const [existingBrochure, setExistingBrochure] = useState(listing?.media?.brochure || null);

  const [featuredFile, setFeaturedFile] = useState(null);
  const [featuredPreview, setFeaturedPreview] = useState(listing?.media?.featuredImage?.url || "");

  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [removedImageKeys, setRemovedImageKeys] = useState([]);

  const [videoFile, setVideoFile] = useState(null);
  const [videoName, setVideoName] = useState(existingVideo ? "Uploaded video" : "");

  const [brochureFile, setBrochureFile] = useState(null);
  const [brochureName, setBrochureName] = useState(existingBrochure ? "Uploaded brochure" : "");

  const [errorMessage, setErrorMessage] = useState("");
  const [isDraggingImages, setIsDraggingImages] = useState(false);

  const featuredInputRef = useRef(null);
  const featuredFieldRef = useRef(null);
  const imagesInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const brochureInputRef = useRef(null);
  const secondaryImagesInputRef = useRef(null);

  const totalCurrentPhotos = existingImages.length + newImagePreviews.length;

  const handleFeaturedSelect = (file) => {
    if (!file) return;
    setFeaturedFile(file);
    setFeaturedPreview(URL.createObjectURL(file));
    setExistingFeaturedImage(null);
    setErrorMessage("");
  };

  const addImageFiles = (files) => {
    const fileArray = Array.from(files);
    const remainingSlots = maxPhotos !== null ? maxPhotos - totalCurrentPhotos : fileArray.length;

    if (remainingSlots <= 0) {
      setErrorMessage(`Your plan allows a maximum of ${maxPhotos} photos. Remove some to add more.`);
      return;
    }

    const filesToAdd = fileArray.slice(0, remainingSlots);

    if (fileArray.length > filesToAdd.length) {
      setErrorMessage(`Only ${filesToAdd.length} photo(s) added — your plan's limit of ${maxPhotos} photos was reached.`);
    } else {
      setErrorMessage("");
    }

    setNewImageFiles((previous) => [...previous, ...filesToAdd]);
    setNewImagePreviews((previous) => [...previous, ...filesToAdd.map((file) => URL.createObjectURL(file))]);
  };

  const handleImagesDrop = (event) => {
    event.preventDefault();
    setIsDraggingImages(false);
    addImageFiles(event.dataTransfer.files);
  };

  const removeExistingImage = (key) => {
    setExistingImages((previous) => previous.filter((image) => image.key !== key));
    setRemovedImageKeys((previous) => [...previous, key]);
  };

  const removeNewImage = (index) => {
    setNewImageFiles((previous) => previous.filter((_, i) => i !== index));
    setNewImagePreviews((previous) => previous.filter((_, i) => i !== index));
  };

  const addSecondaryImageFiles = (files) => {
    const fileArray = Array.from(files);
    setNewSecondaryImageFiles((previous) => [...previous, ...fileArray]);
    setNewSecondaryImagePreviews((previous) => [
      ...previous,
      ...fileArray.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleSecondaryImagesDrop = (event) => {
    event.preventDefault();
    setIsDraggingSecondaryImages(false);
    addSecondaryImageFiles(event.dataTransfer.files);
  };

  const removeNewSecondaryImage = (index) => {
    setNewSecondaryImageFiles((previous) => previous.filter((_, i) => i !== index));
    setNewSecondaryImagePreviews((previous) => previous.filter((_, i) => i !== index));
  };

  const handleVideoSelect = (file) => {
    if (!file) return;

    if (!videoAllowed) {
      setErrorMessage("Your current plan does not include video uploads.");
      return;
    }

    setVideoFile(file);
    setVideoName(file.name);
    setExistingVideo(null);
    setErrorMessage("");
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoName("");
    setExistingVideo(null);
  };

  const handleBrochureSelect = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrorMessage("Brochure must be a PDF file.");
      return;
    }

    setBrochureFile(file);
    setBrochureName(file.name);
    setExistingBrochure(null);
    setErrorMessage("");
  };

  const removeBrochure = () => {
    setBrochureFile(null);
    setBrochureName("");
    setExistingBrochure(null);
  };

  const handleNext = async () => {
    if (!featuredFile && !existingFeaturedImage) {
      setErrorMessage("Featured image is required");
      scrollElementIntoWizardView(featuredFieldRef.current);
      return;
    }

    const formData = new FormData();

    if (featuredFile) formData.append("featuredImage", featuredFile);
    newImageFiles.forEach((file) => formData.append("images", file));
    newSecondaryImageFiles.forEach((file) => formData.append("secondaryImages", file));
    if (videoFile) formData.append("video", videoFile);
    if (brochureFile) formData.append("brochure", brochureFile);
    formData.append("removedImageKeys", JSON.stringify(removedImageKeys));

    try {
      await saveMedia(formData);
    } catch {
      // Error toast already shown by context.
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-950">Media Upload</h2>
      <p className="mt-1 text-sm text-slate-500">
        Upload high-quality photos to attract more buyers. Minimum 6 photos required.
      </p>

      {errorMessage && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div ref={featuredFieldRef} className="mt-5">
        <p className="mb-2 text-sm font-medium text-slate-700">
          Featured Image <span className="text-red-500">*</span>
        </p>

        <input
          ref={featuredInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFeaturedSelect(e.target.files?.[0])}
        />

        {featuredPreview ? (
          <div className="relative h-40 w-full overflow-hidden rounded-xl border border-slate-200 sm:w-64">
            <img src={featuredPreview} alt="Featured" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => featuredInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-slate-950/0 text-transparent transition-all duration-200 hover:bg-slate-950/40 hover:text-white"
            >
              Click to change
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => featuredInputRef.current?.click()}
            className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition-colors duration-200 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-500 sm:w-64"
          >
            <ImagePlus size={26} />
            <span className="text-sm font-medium">Click to upload featured image</span>
            <span className="text-xs">JPG, PNG up to 5MB</span>
          </button>
        )}
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Vehicle Images (max {maxPhotos ?? "∞"})</p>
          <span className="text-xs font-medium text-slate-500">{totalCurrentPhotos}/{maxPhotos ?? "∞"} uploaded</span>
        </div>

        <input
          ref={imagesInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => addImageFiles(e.target.files)}
        />

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDraggingImages(true); }}
          onDragLeave={() => setIsDraggingImages(false)}
          onDrop={handleImagesDrop}
          onClick={() => imagesInputRef.current?.click()}
          className={`flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed transition-all duration-200 ${
            isDraggingImages ? "border-blue-500 bg-blue-50" : "border-slate-300 text-slate-400 hover:border-blue-400 hover:bg-blue-50/50"
          }`}
        >
          <Upload size={20} />
          <span className="text-sm font-medium">Drag & drop images here</span>
          <span className="text-xs">or click to browse — JPG, PNG, WEBP each</span>
        </div>

        {(existingImages.length > 0 || newImagePreviews.length > 0) && (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {existingImages.map((image) => (
              <div key={image.key} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                <img src={image.url} alt="Vehicle" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(image.key)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/70 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                >
                  <X size={13} />
                </button>
              </div>
            ))}

            {newImagePreviews.map((preview, index) => (
              <div key={preview} className="group relative aspect-square overflow-hidden rounded-lg border border-blue-200">
                <img src={preview} alt="New upload" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/70 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {hasSecondaryGallery && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">{secondaryGalleryLabel}</p>
            <span className="text-xs font-medium text-slate-500">
              {existingSecondaryImages.length + newSecondaryImagePreviews.length} uploaded
            </span>
          </div>

          <input
            ref={secondaryImagesInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => addSecondaryImageFiles(e.target.files)}
          />

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingSecondaryImages(true); }}
            onDragLeave={() => setIsDraggingSecondaryImages(false)}
            onDrop={handleSecondaryImagesDrop}
            onClick={() => secondaryImagesInputRef.current?.click()}
            className={`flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed transition-all duration-200 ${
              isDraggingSecondaryImages ? "border-blue-500 bg-blue-50" : "border-slate-300 text-slate-400 hover:border-blue-400 hover:bg-blue-50/50"
            }`}
          >
            <Upload size={18} />
            <span className="text-sm font-medium">Drag &amp; drop {secondaryGalleryLabel.toLowerCase()} here</span>
            <span className="text-xs">or click to browse</span>
          </div>

          {(existingSecondaryImages.length > 0 || newSecondaryImagePreviews.length > 0) && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {existingSecondaryImages.map((image) => (
                <div key={image.key} className="aspect-square overflow-hidden rounded-lg border border-slate-200">
                  <img src={image.url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}

              {newSecondaryImagePreviews.map((preview, index) => (
                <div key={preview} className="group relative aspect-square overflow-hidden rounded-lg border border-blue-200">
                  <img src={preview} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewSecondaryImage(index)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/70 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-slate-700">
          Vehicle Video {!videoAllowed && <span className="text-xs font-normal text-slate-400">(not included in your current plan)</span>}
        </p>

        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          className="hidden"
          onChange={(e) => handleVideoSelect(e.target.files?.[0])}
        />

        {videoName ? (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Video size={17} className="text-blue-600" />
              {videoName}
            </div>
            <button type="button" onClick={removeVideo} className="text-slate-400 transition-colors hover:text-red-600">
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => videoAllowed && videoInputRef.current?.click()}
            disabled={!videoAllowed}
            className="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-blue-600 transition-colors duration-200 hover:border-blue-400 hover:bg-blue-50/50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:border-slate-300 disabled:hover:bg-transparent"
          >
            <Video size={17} />
            Upload a vehicle walkthrough video
            <span className="ml-auto text-xs font-normal text-slate-400">MP4, MOV up to 100MB, 1 video max</span>
          </button>
        )}
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-slate-700">
          Vehicle Brochure <span className="text-xs font-normal text-slate-400">(optional, PDF only)</span>
        </p>

        <input
          ref={brochureInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleBrochureSelect(e.target.files?.[0])}
        />

        {brochureName ? (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <FileText size={17} className="text-blue-600" />
              {brochureName}
            </div>
            <button type="button" onClick={removeBrochure} className="text-slate-400 transition-colors hover:text-red-600">
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => brochureInputRef.current?.click()}
            className="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-blue-600 transition-colors duration-200 hover:border-blue-400 hover:bg-blue-50/50"
          >
            <FileText size={17} />
            Upload a vehicle brochure
            <span className="ml-auto text-xs font-normal text-slate-400">PDF up to 10MB</span>
          </button>
        )}
      </div>

      <WizardFooterNav
        onPrevious={goPrevious}
        onSaveDraft={saveDraft}
        onNext={handleNext}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Step7Media;
