"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function PlanQr({ publicId, size = 160 }: { publicId: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const url = `${window.location.origin}/plan/${publicId}`;
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 1,
        color: { dark: "#0b0e12", light: "#ffffff00" },
      });
    }
  }, [publicId, size]);
  return (
    <div className="mt-2 rounded-2xl bg-muted p-3 grid place-items-center">
      <canvas ref={canvasRef} />
    </div>
  );
}
