import { useEffect, useState } from "react";
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from "@zxing/library";

const hints = new Map();
const formats = [BarcodeFormat.AZTEC, BarcodeFormat.DATA_MATRIX, BarcodeFormat.MAXICODE, BarcodeFormat.QR_CODE];
hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

const QrCodeReader: React.FC = () => {
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    const r = new BrowserMultiFormatReader(hints);
    (async () => {
      const result = await r.listVideoInputDevices();
      decodeOnce(r, result[0].deviceId);
    })();
  }, []);

  function decodeOnce(reader: BrowserMultiFormatReader, selectedDeviceId: string) {
    if (!document.getElementById("video")) {
      return false;
    }

    (async () => {
      const result = await reader.decodeOnceFromVideoDevice(selectedDeviceId, "video");
      setResult(result.getText());
    })();
  }

  return (
    // Todo: set result
    <div className="color-white">
      <video id="video" className="bg-scroll h-dvh w-dvw" />
      <p>
        <span>Last result:</span>
        <span>{result}</span>
      </p>
    </div>
  );
};

export default QrCodeReader;
