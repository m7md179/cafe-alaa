import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { gameConfig } from '../game/config'

function GameWrapper() {
  const gameRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      const config = {
        ...gameConfig,
        parent: containerRef.current
      }
      gameRef.current = new Phaser.Game(config)

      // Enable fullscreen on mobile when user taps
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      if (isMobile) {
        const enterFullscreen = () => {
          if (gameRef.current && gameRef.current.scale) {
            gameRef.current.scale.startFullscreen()
          }
        }

        // Try to enter fullscreen on first interaction
        containerRef.current.addEventListener('click', enterFullscreen, { once: true })
        containerRef.current.addEventListener('touchstart', enterFullscreen, { once: true })
      }
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return (
    <div
      id="game-container"
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
      }}
    />
  )
}

export default GameWrapper
