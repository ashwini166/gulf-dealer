import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AlertCircle, Loader2, MapPin } from "lucide-react";

function extractCoordsFromUrl(url) {
  let match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  match = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  match = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  return null;
}

function extractPlaceName(url) {
  const match = url.match(/\/maps\/place\/([^/@]+)/);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1].replace(/\+/g, " "));
  } catch {
    return null;
  }
}

function parseGoogleMapsUrl(url) {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();
  if (/goo\.gl\/maps|maps\.app\.goo\.gl/i.test(trimmed)) {
    return { error: "short-link" };
  }

  const coords = extractCoordsFromUrl(trimmed);
  if (coords) return coords;

  const placeName = extractPlaceName(trimmed);
  if (placeName) return { needsGeocode: true, placeName };

  return { error: "unparseable" };
}

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

const MapLinkPreview = ({ value }) => {
  const debouncedUrl = useDebouncedValue(value, 500);
  const parsed = useMemo(() => parseGoogleMapsUrl(debouncedUrl), [debouncedUrl]);
  const directCoords = parsed && !parsed.error && !parsed.needsGeocode ? parsed : null;

  const [geocodedCoords, setGeocodedCoords] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!parsed?.needsGeocode) {
      const timer = window.setTimeout(() => {
        if (!cancelled) {
          setGeocodedCoords(null);
          setGeocodeError(false);
          setGeocoding(false);
        }
      }, 0);
      return () => {
        cancelled = true;
        window.clearTimeout(timer);
      };
    }

    const timer = window.setTimeout(() => {
      if (!cancelled) {
        setGeocoding(true);
        setGeocodeError(false);
      }
    }, 0);

    axios
      .get("https://nominatim.openstreetmap.org/search", {
        params: { format: "json", limit: 1, q: parsed.placeName },
      })
      .then((response) => {
        if (cancelled) return;
        const result = response.data?.[0];
        if (result) {
          setGeocodedCoords({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
        } else {
          setGeocodedCoords(null);
          setGeocodeError(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGeocodedCoords(null);
          setGeocodeError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setGeocoding(false);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [parsed?.needsGeocode, parsed?.placeName]);

  const coords = directCoords || geocodedCoords;
  const embedSrc = useMemo(() => {
    if (!coords) return "";
    const { lat, lng } = coords;
    const delta = 0.01;
    const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join("%2C");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  }, [coords]);

  if (!value) {
    return (
      <div className="relative mt-3 flex h-44 items-center justify-center overflow-hidden rounded-xl bg-emerald-50">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#b8d0bd_1px,transparent_1px),linear-gradient(90deg,#b8d0bd_1px,transparent_1px)] [background-size:80px_50px]" />
        <MapPin className="relative z-10 text-blue-600" size={32} />
        <span className="absolute bottom-3 rounded-lg bg-white px-3 py-1.5 text-xs text-slate-500 shadow">
          Enter Google Maps link to pin the listing location
        </span>
      </div>
    );
  }

  return (
    <div className="mt-3">
      {parsed?.error === "short-link" && (
        <p className="mb-2 flex items-center gap-1 text-xs text-amber-600">
          <AlertCircle size={13} />
          Shortened links cannot be read directly. Open the link and paste the full Google Maps URL.
        </p>
      )}
      {parsed?.error === "unparseable" && (
        <p className="mb-2 flex items-center gap-1 text-xs text-amber-600">
          <AlertCircle size={13} />
          Could not recognize this as a Google Maps link.
        </p>
      )}
      {geocoding && (
        <p className="mb-2 flex items-center gap-1 text-xs text-slate-400">
          <Loader2 size={13} className="animate-spin" />
          Looking up location...
        </p>
      )}
      {geocodeError && (
        <p className="mb-2 flex items-center gap-1 text-xs text-amber-600">
          <AlertCircle size={13} />
          Could not find that place. Try dropping a pin and copying the full link.
        </p>
      )}
      {coords && (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <iframe title="Listing location map" className="h-52 w-full" src={embedSrc} loading="lazy" />
        </div>
      )}
    </div>
  );
};

export default MapLinkPreview;
