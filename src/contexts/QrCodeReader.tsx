import { BrowserMultiFormatReader } from "@zxing/library";
import { createContext, useContext } from "react";
import { QrCodeContent } from "../types/OpenSongQuiz";

interface QrCodeReaderContextProps {
  result?: QrCodeContent;
  reader?: BrowserMultiFormatReader;
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  decodeOnce: () => Promise<void>;
  resetResult: () => void;
}

export const QrCodeReaderContext = createContext<QrCodeReaderContextProps | undefined>(undefined);

export const useQrCodeReader = () => {
  const context = useContext(QrCodeReaderContext);
  if (!context) {
    throw new Error("useQrCodeReader must be used within a QrCodeReaderContext");
  }
  return context;
};
