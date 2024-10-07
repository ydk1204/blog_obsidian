/// <reference types="youtube" />

let globalPlayer: YT.Player | null = null;
let isPlayerReady = false;

export function setGlobalPlayer(player: YT.Player) {
  globalPlayer = player;
}

export function getGlobalPlayer(): YT.Player | null {
  return globalPlayer;
}

export function setPlayerReady(ready: boolean) {
  isPlayerReady = ready;
}

export function isGlobalPlayerReady(): boolean {
  return isPlayerReady;
}