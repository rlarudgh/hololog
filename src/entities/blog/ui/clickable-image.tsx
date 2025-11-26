'use client';

import React, { useState } from 'react';
import { ImageModal } from './image-modal';

interface ClickableImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ClickableImage({
  src,
  alt,
  className = '',
  width,
  height,
}: ClickableImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const imageProps: React.ImgHTMLAttributes<HTMLImageElement> = {
    src,
    alt,
    className: `cursor-pointer transition-all duration-200 hover:brightness-95 ${className}`,
    onClick: handleImageClick,
  };

  // Only add width and height if they're provided
  if (width !== undefined) {
    imageProps.width = width;
  }
  if (height !== undefined) {
    imageProps.height = height;
  }

  return (
    <>
      <img {...imageProps} />
      <ImageModal
        src={src}
        alt={alt}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
