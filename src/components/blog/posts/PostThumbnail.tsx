import Image from 'next/image';
import { FileImage } from 'lucide-react';

interface PostThumbnailProps {
  src: string | null;
  alt: string;
  className?: string;
}

export default function PostThumbnail({
  src,
  alt,
  className = '',
}: PostThumbnailProps) {
  if (!src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <FileImage className="w-12 h-12 text-gray-400" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={256}
      height={192}
      className={className}
      loading="lazy"
    />
  );
}
