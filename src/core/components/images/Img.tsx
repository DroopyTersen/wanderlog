import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, MotionStyle } from "framer-motion";
import { BLURRED_PHOTOS } from "global/components";
import { Loader } from "../surfaces";

const DEFAULT = "/images/mountain-road.thumbnail.jpg";

export function Img({ initial = "", src = DEFAULT, fallback = DEFAULT, opacity = 1 }) {
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
    <AnimatePresence>
      {imgSrc && (
        <motion.img
          className="animated"
          style={{ position: "absolute" } as any}
          key={imgSrc}
          src={imgSrc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          // exit={{ opacity: 1 }}
          transition={{ duration: imgSrc === src ? 0.5 : 0.15 }}
          loading="lazy"
        />
      )}
      {!imgSrc && <Loader />}
    </AnimatePresence>
  );
}
