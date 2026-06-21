import { useStore } from '@nanostores/react'
import {
  $playerState,
  getPlayerEpisode,
  isPlayerContextValid,
} from '@/store/player'

export function usePlayerEpisode(
  mediaId: number,
  season: number,
  initialEpisode: number
) {
  const playerState = useStore($playerState)
  const episode = getPlayerEpisode(
    playerState,
    mediaId,
    season,
    initialEpisode
  )

  return {
    episode,
    playerState,
    isContextValid: isPlayerContextValid(playerState, mediaId, season),
  }
}
