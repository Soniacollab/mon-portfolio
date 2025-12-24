// src/components/atoms/Image.tsx
import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  rounded?: boolean;
}

const Image: React.FC<ImageProps> = ({ src, alt, className = "", rounded = false }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`${rounded ? "rounded-full" : ""} ${className}`}
    />
  );
};

export default Image;
