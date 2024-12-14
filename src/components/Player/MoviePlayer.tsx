import { getMovieUrl } from '@/utils/sources'
import { getMovieUrl as getGlobalMovieUrl } from '@/utils/url'
import { SelectSource } from './SelectSource'
import { useEffect, useRef, useState } from 'react'

export function MoviePlayer({
  title,
  initialSource,
  id,
}: {
  title: string
  initialSource: string
  id: number
}) {
  const isFirstMount = useRef(true)
  const [sourceId, setSourceId] = useState(initialSource)
  const iframeUrl = getMovieUrl(sourceId, id)

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    window.history.replaceState({}, '', getGlobalMovieUrl(id, title, sourceId))
  }, [id, title, sourceId])

  return (
    <div className='mt-4 aspect-video w-full flex-grow rounded-2xl bg-white/10 shadow-2xl'>
      <iframe
        title={title}
        className='aspect-video w-full rounded-2xl bg-transparent'
        allowFullScreen
        src={iframeUrl}
      />
      <SelectSource source={sourceId} setSource={setSourceId} />
    </div>
  )
}
