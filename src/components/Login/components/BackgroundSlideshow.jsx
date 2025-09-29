import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

export const BackgroundSlideshow = ({
  images = [],
  intervalMs = 8000,
  fadeMs = 1200,
}) => {
  const sanitized = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );
  const hasImages = sanitized.length > 0;

  // Double-layer crossfade approach
  const [imageA, setImageA] = useState(hasImages ? sanitized[0] : "");
  const [imageB, setImageB] = useState(
    hasImages ? sanitized[Math.min(1, sanitized.length - 1)] : ""
  );
  const [showA, setShowA] = useState(true);
  const indexRef = useRef(1);

  // Preload images
  useEffect(() => {
    sanitized.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [sanitized]);

  useEffect(() => {
    if (sanitized.length <= 1) return;
    const id = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % sanitized.length;
      const nextSrc = sanitized[indexRef.current];

      if (showA) {
        setImageB(nextSrc);
        setShowA(false);
      } else {
        setImageA(nextSrc);
        setShowA(true);
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [sanitized, intervalMs, showA]);

  if (!hasImages) return null;

  return (
    <div className="absolute inset-0">
      <div
        className={`absolute inset-0 bg-center bg-cover transition-opacity ease-out`}
        style={{
          backgroundImage: `url(${imageA})`,
          opacity: showA ? 1 : 0,
          transitionDuration: `${fadeMs}ms`,
          willChange: "opacity",
        }}
      />
      <div
        className={`absolute inset-0 bg-center bg-cover transition-opacity ease-out`}
        style={{
          backgroundImage: `url(${imageB})`,
          opacity: showA ? 0 : 1,
          transitionDuration: `${fadeMs}ms`,
          willChange: "opacity",
        }}
      />
    </div>
  );
};

export default BackgroundSlideshow;

BackgroundSlideshow.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  intervalMs: PropTypes.number,
  fadeMs: PropTypes.number,
};
