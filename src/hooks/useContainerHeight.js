import { useState, useLayoutEffect } from "react";

export const useContainerHeight = (ref) => {
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const updateHeight = () => setHeight(ref.current.offsetHeight);
    const observer = new ResizeObserver(updateHeight);
    observer.observe(ref.current);
    updateHeight();

    return () => observer.disconnect();
  }, [ref]);

  return height;
};
