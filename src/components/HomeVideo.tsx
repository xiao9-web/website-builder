'use client'

import { useState } from 'react'
import type { PublicVideo } from '@/endpoints/public-content'

export function HomeVideo({ video }: { video: PublicVideo }) {
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  return <section className="home-video wrap" aria-label="企业影像"><div className="home-video-copy"><p className="section-kicker">企业影像</p><h2>{video.title}</h2>{video.description && <p>{video.description}</p>}</div>
    <div className="home-video-frame">{playing ? <video src={video.url} controls autoPlay playsInline aria-label={video.title} onError={() => { setPlaying(false); setFailed(true) }} /> : <>
      {video.poster ? <img src={video.poster.url || ''} alt={video.poster.alt || video.title} loading="lazy" /> : <div className="home-video-placeholder" aria-hidden="true" />}
      <button type="button" aria-label={`${failed ? '重试播放' : '播放视频'}：${video.title}`} onClick={() => { setFailed(false); setPlaying(true) }}><span aria-hidden="true">▶</span> {failed ? '重试播放' : '点击播放'}</button>
      {failed && <p className="home-video-error" role="status">视频暂时无法播放，请稍后重试。</p>}
    </>}</div>
  </section>
}
