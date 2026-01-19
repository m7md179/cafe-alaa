import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { gameConfig } from '../game/config'

function GameWrapper() {
  const gameRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // Fix viewport height for mobile browsers to account for address bar
    const setVH = () => {
      // Use the largest available height
      const vh = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      ) * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    // Set initial height
    setVH()

    // Update on various events
    window.addEventListener('resize', setVH)
    window.addEventListener('orientationchange', () => {
      setTimeout(setVH, 100)
    })

    if (containerRef.current && !gameRef.current) {
      const config = {
        ...gameConfig,
        parent: containerRef.current
      }
      gameRef.current = new Phaser.Game(config)

      // Enable fullscreen on mobile when user taps
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      if (isMobile) {
        const enterFullscreen = async () => {
          try {
            // Try native fullscreen API first
            const elem = document.documentElement
            if (elem.requestFullscreen) {
              await elem.requestFullscreen()
            } else if (elem.webkitRequestFullscreen) {
              await elem.webkitRequestFullscreen()
            } else if (elem.mozRequestFullScreen) {
              await elem.mozRequestFullScreen()
            } else if (elem.msRequestFullscreen) {
              await elem.msRequestFullscreen()
            }
          } catch (err) {
            console.log('Fullscreen request failed:', err)
            // Fallback: just resize
            setVH()
          }

          // Also try Phaser's fullscreen
          if (gameRef.current && gameRef.current.scale) {
            try {
              gameRef.current.scale.startFullscreen()
            } catch (err) {
              console.log('Phaser fullscreen failed:', err)
            }
          }

          // Scroll to hide address bar
          window.scrollTo(0, 0)
          setTimeout(() => setVH(), 300)
        }

        // Show tap message on mobile
        const tapMessage = document.getElementById('tap-message')
        if (tapMessage) {
          tapMessage.classList.add('show')
        }

        // Try to enter fullscreen on first interaction
        const handleFirstTouch = () => {
          // Hide tap message
          if (tapMessage) {
            tapMessage.classList.remove('show')
          }

          enterFullscreen()

          // Remove listeners after first touch
          containerRef.current?.removeEventListener('click', handleFirstTouch)
          containerRef.current?.removeEventListener('touchstart', handleFirstTouch)
        }

        containerRef.current.addEventListener('click', handleFirstTouch)
        containerRef.current.addEventListener('touchstart', handleFirstTouch)
      }
    }

    return () => {
      window.removeEventListener('resize', setVH)
      window.removeEventListener('orientationchange', setVH)

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
