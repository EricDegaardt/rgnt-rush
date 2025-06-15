
import React, { useState, useEffect } from 'react';
import { loadImageFromUrl, removeBackground } from '../../lib/image';

const imageCache = new Map<string, string>();

interface TransparentImageProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
}

const TransparentImage = ({ src, alt, className, style }: TransparentImageProps) => {
    const [imageSrc, setImageSrc] = useState<string | null>(imageCache.get(src) || null);
    const [isLoading, setIsLoading] = useState(!imageSrc);

    useEffect(() => {
        if (imageCache.has(src)) {
            setImageSrc(imageCache.get(src)!);
            setIsLoading(false);
            return;
        }

        let isCancelled = false;
        setIsLoading(true);

        const processImage = async () => {
            try {
                const imageElement = await loadImageFromUrl(src);
                const blob = await removeBackground(imageElement);
                const objectURL = URL.createObjectURL(blob);
                if (!isCancelled) {
                    imageCache.set(src, objectURL);
                    setImageSrc(objectURL);
                }
            } catch (error) {
                console.error(`Failed to process image ${src}:`, error);
                if (!isCancelled) {
                    setImageSrc(src);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        processImage();

        return () => {
            isCancelled = true;
        };
    }, [src]);

    if (isLoading) {
      // While processing, show original image with some transparency
      return <img src={src} alt={alt} className={className} style={{...style, opacity: 0.5}} />;
    }

    return <img src={imageSrc || src} alt={alt} className={className} style={style} />;
};

export default TransparentImage;
