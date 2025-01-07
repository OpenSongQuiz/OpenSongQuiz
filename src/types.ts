import { SpotifyApi } from "@spotify/web-api-ts-sdk";


export interface SpotifyConfig {
    clientId: string,
    redirectTarget: string,
    scopes: string[],
}

export interface SpotifyComponent {
    spotify: SpotifyApi | null
}