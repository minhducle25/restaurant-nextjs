"use client";
import { getTableLink } from "@/lib/utils";
import * as QRCode from "qrcode";
import { useEffect, useRef } from "react";
export default function ExportQRCodeTable({
  token,
  tableNumber,
  width = 250,
}: {
  token: string;
  tableNumber: number;
  width?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!
    canvas.height = width + 70;
    canvas.width = width;
    const canvasContext = canvas.getContext("2d")!;
    canvasContext.fillStyle = "#fff"
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.font = '20px Arial';
    canvasContext.fillStyle = "#000"
    canvasContext.textAlign = "center";
    canvasContext.fillText(`Table ${tableNumber}`, width / 2, canvas.width + 20);
    canvasContext.fillText(`Scan to order`, width / 2, canvas.width + 50);
    const virtualCanvas = document.createElement("canvas");
    QRCode.toCanvas(
      virtualCanvas,
      getTableLink({ token, tableNumber }),
      function (error) {
        if (error) console.error(error);
        canvasContext.drawImage(virtualCanvas, 0, 0, width, width);
      }
    );
  }, [token, width, tableNumber]);

  return <canvas ref={canvasRef}></canvas>;
}
