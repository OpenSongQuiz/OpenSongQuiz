import React from "react";
import { GameModeEnum, useGameState } from "../contexts/GameState";
import SpotifyAuth from "./SpotifyAuth";
import SpotifyPlaylist from "./SpotifyPlaylist";
import QrCodeReader from "./QrCodeReader.";
import { QrCodeReaderProvider } from "../contexts/QrCodeReader";

const GameModeComponent: React.FC = () => {
    const gameState = useGameState();
    if (gameState.gameMode == GameModeEnum.online ) {
        return <SpotifyPlaylist />
    }
    else if (gameState.gameMode == GameModeEnum.qrCode) {
        return (<>
        <QrCodeReaderProvider>
            <QrCodeReader />
        </QrCodeReaderProvider>
        </>)
    }
    return (<GameModeSelection />)
}

const GameModeSelection: React.FC = () => {
    const gameState = useGameState()

    return (<>
    <div className="grid">
        <h1 className="text-2xl my-2">Welcome to OpenSongQuiz</h1>
        <button onClick={gameState.setOnlineMode}>Play online</button>
        <button onClick={gameState.setQrCodeMode}>Play with Qr Codes</button>
        </div>
    </>)
}

const OpenSongQuiz: React.FC = () => {
    

    return (<>
    <div className="flex flex-wrap text-white place-content-center h-full">
        <SpotifyAuth />
        <GameModeComponent />
    </div>
    </>)
};

export default OpenSongQuiz;