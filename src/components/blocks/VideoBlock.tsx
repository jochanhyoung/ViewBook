import React from 'react';

interface VideoBlockProps {
  src: string;
  title?: string;
}

export function VideoBlock({ src, title }: VideoBlockProps) {
  return (
    <div className="my-6 flex flex-col gap-3">
      {title && (
        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          {title}
        </h3>
      )}
      <video
        src={src}
        controls
        className="w-full rounded-xl border shadow-md"
        style={{ borderColor: 'var(--color-border)' }}
      />
    </div>
  );
}
