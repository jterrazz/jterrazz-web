"use client";

import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

type QRCodeProps = {
  url: string;
  size?: number;
  className?: string;
};

export const QRCode: React.FC<QRCodeProps> = ({ url, size = 140, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  // Render at 2x resolution for crisp display on retina screens
  const renderSize = size * 2;

  useEffect(() => {
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: renderSize,
        height: renderSize,
        data: url,
        type: "svg", // SVG for crisp rendering at any size
        dotsOptions: {
          color: "#18181b", // zinc-900
          type: "rounded",
        },
        cornersSquareOptions: {
          color: "#18181b",
          type: "extra-rounded",
        },
        cornersDotOptions: {
          color: "#18181b",
          type: "dot",
        },
        backgroundOptions: {
          color: "transparent",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 0,
        },
        qrOptions: {
          errorCorrectionLevel: "M",
        },
      });
    }

    if (ref.current && ref.current.children.length === 0) {
      qrCodeRef.current.append(ref.current);
    }
  }, [renderSize, url]);

  useEffect(() => {
    if (qrCodeRef.current) {
      qrCodeRef.current.update({ data: url });
    }
  }, [url]);

  return (
    <div
      className={`${className} [&>svg]:w-full [&>svg]:h-full`}
      ref={ref}
      style={{ width: size, height: size }}
    />
  );
};
