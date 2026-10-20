import React, { useContext, useLayoutEffect, useRef } from "react";
import BrandLoader from "@/components/BrandLoader";
import { PageLoadingContext } from "@/components/loading/PageLoadingContext";

export default function PageLoader({ size = 72, width = size, height = size, label = "Loading…", className = "", children }) {
  const register = useContext(PageLoadingContext);
  const content = useRef(children || <BrandLoader size={size} width={width} height={height} label={label} />);
  useLayoutEffect(() => register?.(content.current), [register]);
  // The provider owns the visible stars, so removing a page's loading branch
  // does not stop their animation. They continue tracing while the page reveals.
  if (!register) return content.current;
  return <div aria-hidden="true" className={className} style={{ width, height }} />;
}