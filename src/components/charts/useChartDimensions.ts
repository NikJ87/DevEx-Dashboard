import { useEffect, useState, useRef } from 'react';

export const useChartDimensions = (
  settings: {
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
  } = {},
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const marginTop = settings.marginTop || 20;
  const marginRight = settings.marginRight || 20;
  const marginBottom = settings.marginBottom || 30;
  const marginLeft = settings.marginLeft || 40;

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0) return;
      const entry = entries[0];
      setWidth(entry.contentRect.width);
      setHeight(entry.contentRect.height);
    });

    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, []);

  const boundedWidth = Math.max(width - marginLeft - marginRight, 0);
  const boundedHeight = Math.max(height - marginTop - marginBottom, 0);

  return {
    ref,
    width,
    height,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    boundedWidth,
    boundedHeight,
  };
};
