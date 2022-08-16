import React, { useEffect, useRef } from "react";
import useAutoPaging from "~/hooks/useAutoPaging";
import "./carousel.scss";

interface Props {
  children: React.ReactNode;
  /** Milliseconds to delay the autopaging. Defaults to off */
  autoPageDelay?: number;
  startingIndex?: number | null;
  onChange?: (selectedIndex: number) => void;
  [key: string]: any;
}
const ATTRIBUTE = "data-carousel-index";
export let debounce = function (func, wait) {
  let timeout: number | null = null;
  return function () {
    var args = arguments;
    var later = () => {
      timeout = null;
      func.apply(this, args);
    };
    if (timeout != null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait) as any;
  };
};

export function CarouselSlider({
  children,
  autoPageDelay = 0,
  startingIndex = 0,
  className = "",
  onChange,
  ...rest
}: Props) {
  let clones: React.ReactNode[] = React.Children.map(
    children,
    (child: any, index) => {
      return React.cloneElement(child, { [ATTRIBUTE]: index });
    }
  );
  let activeItem = useActiveItem(clones, startingIndex || 0, onChange);
  let autoPaging = useAutoPaging(activeItem.next, autoPageDelay);

  if (!clones?.length) return null;

  return (
    <div
      className={"carousel " + className}
      {...autoPaging.pauseEvents}
      {...rest}
    >
      <div className="carousel-items">{clones}</div>
      {clones?.length > 1 && (
        <>
          <button
            onClick={() => activeItem.prev()}
            className="carousel-button carousel-prev"
            type="button"
          >
            ‹
          </button>
          <button
            onClick={() => activeItem.next()}
            className="carousel-button carousel-next"
            type="button"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

const selectItem = (index: string | number) =>
  document.querySelector(`[${ATTRIBUTE}='${index}']`);

function useActiveItem(
  children: React.ReactNode[],
  startingIndex = 0,
  onChange?: (index: number) => void
) {
  let activeKeyRef = useRef(0);

  // Manually scroll to the target index
  const scrollToIndex = (index) => {
    if (index > children?.length - 1) index = 0;
    if (index < 0) index = children?.length - 1;
    let elem = selectItem(index);

    if (elem && (elem as any)?.scrollIntoViewIfNeeded) {
      (elem as any).scrollIntoViewIfNeeded();
      activeKeyRef.current = index;
    } else if (elem && elem?.scrollIntoView) {
      elem.scrollIntoView();
      activeKeyRef.current = index;
    }
    if (onChange) onChange(activeKeyRef.current);
  };

  // Use intersection observer to track when the user
  // scrolls to the next or previous item. Store it on a ref since we
  // don't need to re-render.
  useEffect(() => {
    let options = {
      root: document.querySelector(".carousel"),
      rootMargin: "0px",
      threshold: 1.0,
    };

    let callback: IntersectionObserverCallback = (entries) => {
      // The callback fires on mount with all the observed children, ignore that.
      if (entries.length === 1 && entries?.[0]?.isIntersecting) {
        let target: Element = entries[0]?.target;
        // Pull the active index off a data attribute
        let key = parseInt(target.getAttribute(ATTRIBUTE) || "-1", 10);
        if (key !== activeKeyRef.current) {
          activeKeyRef.current = key;
          if (onChange) onChange(activeKeyRef.current);
        }
      }
    };

    // Add an intersection observer watcher to each child
    let observer = new IntersectionObserver(callback, options);
    children?.forEach((_, index) => {
      let elem = selectItem(index);
      if (elem) observer.observe(elem);
    });

    return () => {
      // Remove the intersection observer watcher from each child
      children?.forEach((_, index) => {
        let elem = selectItem(index);
        if (elem) observer.unobserve(elem);
      });
    };
  }, [children]);

  useEffect(() => {
    if (startingIndex) {
      let container = document.querySelector(
        ".carousel-items"
      ) as HTMLDivElement;
      if (container) container.style.scrollBehavior = "auto";
      scrollToIndex(startingIndex);
      if (container) container.style.scrollBehavior = "smooth";
    }
  }, []);

  return {
    next: () => scrollToIndex(activeKeyRef.current + 1),
    prev: () => scrollToIndex(activeKeyRef.current - 1),
  };
}
