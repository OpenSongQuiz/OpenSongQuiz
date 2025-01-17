import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { QrCodeContent } from "../types/OpenSongQuiz";
import playlists from "../data/playlists.json";

const hints = new Map();
const formats = [BarcodeFormat.AZTEC, BarcodeFormat.DATA_MATRIX, BarcodeFormat.MAXICODE, BarcodeFormat.QR_CODE];
hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

interface QrCodeReaderContextProps {
  result?: QrCodeContent;
  reader?: BrowserMultiFormatReader;
  videoDeviceId: string;
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  decodeOnce: () => Promise<void>;
  resetResult: () => void;
}

const QrCodeReaderContext = createContext<QrCodeReaderContextProps | undefined>(undefined);

interface QrCodeReaderProviderProps {
  children?: React.ReactNode;
}

export const QrCodeReaderProvider: React.FC<QrCodeReaderProviderProps> = ({ children }) => {
  const [result, setResult] = useState<QrCodeContent | undefined>(undefined);
  const [videoDeviceId, setVideoDeviceId] = useState<string>("");

  const readerCallback = useCallback(() => new BrowserMultiFormatReader(hints), []);

  const reader = useMemo(readerCallback, [readerCallback]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    (async () => {
      const result = await reader.listVideoInputDevices();
      if (result.length > 0) setVideoDeviceId(result[0].deviceId);
    })();
  }, [reader, setVideoDeviceId]);

  const _getPropretiaryContent = (fullUrl: string) => {
    const splitResult = fullUrl.split("/");

    const countryCode = splitResult[1];
    const propretiaryId = splitResult.length > 3 ? splitResult[2] : "de01";
    const playlistPosition = parseInt(splitResult.length > 3 ? splitResult[3] : splitResult[2]);

    const filteredPlaylists = playlists.playlists.filter(
      (playlist) => playlist.propretiaryId === propretiaryId && playlist.countryCode === countryCode,
    );

    const content = {
      fullUrl: fullUrl,
      type: splitResult[0],
      playlistId: filteredPlaylists.length > 0 ? filteredPlaylists[0].spotifyId : "",
      playlistPosition: playlistPosition,
    } as QrCodeContent;

    return content;
  };

  const _decodeOnce = async (selectedDeviceId: string, videoElement: HTMLVideoElement) => {
    if (videoElement.readyState === 0) {
      const qrCode = await reader.decodeOnceFromVideoDevice(selectedDeviceId, videoElement);

      const fullUrl = qrCode.getText();
      const splitResult = fullUrl.split("/");
      const content = splitResult[0] === "www.hitstergame.com" ? _getPropretiaryContent(fullUrl) : undefined;
      if (content) setResult(content);
    } else {
      console.debug("video already in state: " + videoElement.readyState);
    }
  };

  const decodeOnce = async () => {
    const result = await reader?.listVideoInputDevices();
    if (videoRef.current && result.length > 0) {
      const videoElement = videoRef.current;
      if (result) _decodeOnce(result[0].deviceId, videoElement);
    }
  };

  const resetResult = () => {
    setResult(undefined);
  };

  return (
    <QrCodeReaderContext.Provider
      value={{
        result,
        reader,
        videoDeviceId,
        videoRef,
        decodeOnce,
        resetResult,
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
