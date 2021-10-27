import React from 'react'
import { PlayerGameInfo } from '../../../contexts/socketContext'

type Props = {
  player1: PlayerGameInfo
  player2: PlayerGameInfo
}

const PlayerScores = (props: Props) => {
  const { player1, player2 } = props
  // if (!player1 || !player2) return
  return (
    <div className='playerScore'>
      <div className='player-score-container'>
        <div className='player-1-name'>
          <div className='player-1-logo'>{player1.username.charAt(0)}</div>
          <p className='player-score-name'>{player1.username}</p>
          <div className='player-1-score'>{player1.score}</div>
        </div>
        <div className='player-2-name'>
          <p className='player-score-name'>{player2.username}</p>
          <div className='player-2-logo'>{player2.username.charAt(0)}</div>
          <div className='player-2-score'>{player2.score}</div>
        </div>
      </div>
    </div>
  )
}

export default PlayerScores
