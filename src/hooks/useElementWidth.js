import { useState, useLayoutEffect } from "react";

export const useElementWidth = (ref) => {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const updateWidth = () => setWidth(ref.current.offsetWidth);
    const observer = new ResizeObserver(updateWidth);
    observer.observe(ref.current);
    updateWidth();

    return () => observer.disconnect();
  }, [ref]);

  return width;
};
