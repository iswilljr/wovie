import { atom } from 'nanostores'

export interface PlayerState {
  season: number | null
  episode: number | null
  source: string | null
}

export const $playerState = atom<PlayerState>({
  season: null,
  episode: null,
  source: null,
})
