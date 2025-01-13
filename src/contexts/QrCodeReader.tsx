import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const hints = new Map();
const formats = [BarcodeFormat.AZTEC, BarcodeFormat.DATA_MATRIX, BarcodeFormat.MAXICODE, BarcodeFormat.QR_CODE];
hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

interface QrCodeReaderContextProps {
  result: string;
  reader?: BrowserMultiFormatReader;
  videoDeviceId: string;
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  decodeOnce: () => void;
}

const QrCodeReaderContext = createContext<QrCodeReaderContextProps | undefined>(undefined);

interface QrCodeReaderProviderProps {
  children?: React.ReactNode;
}

export const QrCodeReaderProvider: React.FC<QrCodeReaderProviderProps> = ({ children }) => {
  const [result, setResult] = useState<string>("");
  const [videoDeviceId, setVideoDeviceId] = useState<string>("");

  const readerCallback = useCallback(() => new BrowserMultiFormatReader(hints), []);

  const reader = useMemo(readerCallback, [readerCallback]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    (async () => {
      const result = await reader.listVideoInputDevices();
      setVideoDeviceId(result[0].deviceId);
    })();
  }, [reader, setVideoDeviceId]);

  function _decodeOnce(selectedDeviceId: string, videoElement: HTMLVideoElement) {
    if (videoElement.readyState === 0) {
      (async () => {
        const result = await reader.decodeOnceFromVideoDevice(selectedDeviceId, videoElement);
        setResult(result.getText());
      })();
    } else {
      console.debug("video already in state: " + videoElement.readyState);
    }
  }

  function decodeOnce() {
    (async () => {
      const result = await reader?.listVideoInputDevices();
      if (videoRef.current) {
        const videoElement = videoRef.current;
        if (result) _decodeOnce(result[0].deviceId, videoElement);
      }
    })();
  }

  return (
    <QrCodeReaderContext.Provider
      value={{
        result,
        reader,
        videoDeviceId,
        videoRef,
        decodeOnce,
      }}
    >
      {children}
    </QrCodeReaderContext.Provider>
  );
};

export const useQrCodeReader = () => {
  const context = useContext(QrCodeReaderContext);
  if (!context) {
    throw new Error("useQrCodeReader must be used within a QrCodeReaderContext");
  }
  return context;
};
