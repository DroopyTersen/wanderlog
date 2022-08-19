import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Loader } from "../surfaces";

const DEFAULT = "/images/mountain-road.thumbnail.jpg";

export function Img({
  initial = "",
  src = DEFAULT,
  fallback = DEFAULT,
  opacity = 1,
  className = "",
}) {
  let [imgSrc, setImgSrc] = useState(initial);
  let fallbackRef = useRef(fallback);
  useEffect(() => {
    fallbackRef.current = fallback;
  });
  useEffect(() => {
    let isUnmounted;
    let image = new Image();
    image.onload = () => {
      if (!isUnmounted) {
        setTimeout(() => {
          setImgSrc(src);
        }, 10);
      }
    };
    image.onerror = () => {
      if (!isUnmounted) {
        setImgSrc(fallbackRef.current);
      }
    };
    image.src = src;
    return () => {
      isUnmounted = true;
    };
  }, [src]);
  return (
    <>
      {imgSrc && (
        <motion.img
          className={`animated ${className}`}
          style={{ position: "absolute" } as any}
          key={src}
          src={imgSrc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity }}
          transition={{ duration: imgSrc === src ? 0.5 : 0.15 }}
          loading="lazy"
        />
      )}
      {!imgSrc && <Loader />}
    </>
  );
}
