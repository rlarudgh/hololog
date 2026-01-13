'use client';

import React, { useState, lazy, Suspense } from 'react';

const ImageModal = lazy(() =>
  import('./image-modal').then((module) => ({ default: module.ImageModal })),
);

interface ClickableImageProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ClickableImage({
  src,
  alt = 'Image',
  className = '',
  width,
  height,
}: Readonly<ClickableImageProps>) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...imageProps} />
      <Suspense fallback={null}>
        {isModalOpen && (
          <ImageModal
            src={src}
            alt={alt}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </Suspense>
    </>
  );
}
