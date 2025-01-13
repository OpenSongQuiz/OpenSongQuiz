import { useEffect } from "react";
import { useQrCodeReader } from "../contexts/QrCodeReader";

const QrCodeReader: React.FC = () => {
  const reader = useQrCodeReader();

  useEffect(() => {
    reader.decodeOnce();
  }, [reader]);

  return (
    <div className="color-white">
      <video id="video" ref={reader.videoRef} className="bg-scroll h-dvh w-dvw" />
      <p>
        <span>Last result:</span>
        <span>{reader.result}</span>
      </p>
    </div>
  );
};

export default QrCodeReader;
