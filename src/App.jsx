import { useState, useEffect } from 'react'
import GameWrapper from './components/GameWrapper'

function App() {
  const [isMobile, setIsMobile] = useState(false)
  const [continueAnyway, setContinueAnyway] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900 || window.innerHeight < 500)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile && !continueAnyway) {
    return (
      <div className="mobile-warning">
        <h2>Best Experience on Desktop</h2>
        <p>This game is optimized for desktop browsers with a keyboard.</p>
        <button onClick={() => setContinueAnyway(true)}>
          Continue Anyway
        </button>
      </div>
    )
  }

  return (
    <div className="game-container">
      <GameWrapper />
    </div>
  )
}

export default App
