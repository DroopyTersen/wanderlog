import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BLURRED_PHOTOS } from "global/components";
import { Loader } from "../surfaces";

const DEFAULT = "/images/mountain-road.thumbnail.jpg";

export function Img({ initial = "", src = DEFAULT, fallback = DEFAULT, opacity = 1 }) {
  // console.log("🚀 | Img | src", src, initial);
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
        }, 50);
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
          style={{ position: "absolute" }}
          className="animated"
          key={imgSrc}
          src={imgSrc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        />
      )}
      {!imgSrc && <Loader />}
    </AnimatePresence>
  );
}
