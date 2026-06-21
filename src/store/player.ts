import { atom } from 'nanostores'

export interface PlayerState {
  mediaId: number | null
  season: number | null
  episode: number | null
  source: string | null
}

export const initialPlayerState: PlayerState = {
  mediaId: null,
  season: null,
  episode: null,
  source: null,
}

export const $playerState = atom<PlayerState>(initialPlayerState)

export function isPlayerContextValid(
  state: PlayerState,
  mediaId: number,
  season: number
) {
  return state.mediaId === mediaId && state.season === season
}

export function getPlayerEpisode(
  state: PlayerState,
  mediaId: number,
  season: number,
  initialEpisode: number
) {
  if (isPlayerContextValid(state, mediaId, season) && state.episode !== null) {
    return state.episode
  }
  return initialEpisode
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', () => {
    $playerState.set(initialPlayerState)
  })
}
