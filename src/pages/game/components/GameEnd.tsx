import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlayerGameInfo, SocketContext } from '../../../contexts/socketContext'

export const GameEnd = () => {
  const { t } = useTranslation()
  const { gameInfo } = useContext(SocketContext)

  // if (!gameInfo) return null
  const { player1, player2 } = gameInfo ?? {
    player1: undefined,
    player2: undefined,
  }
  const [winner, setWinner] = useState<string | null>('')

  const winnerName = (player1: PlayerGameInfo, player2: PlayerGameInfo) => {
    if (player1.score === player2.score) setWinner(null)
    else if (player1.score > player2.score) setWinner(player1.username)
    else setWinner(player2.username)
  }

  useEffect(() => {
    if (player1 && player2) {
      winnerName(player1, player2)
    }
  }, [player1, player2])

  if (!player1 || !player2) return null
  return (
    <div className='round-end'>
      <span style={{ fontSize: '24px' }}>{t('69')}</span>
      <div className='game-result'>
        <div className='player-name'>{player1.username}</div>
        <div className='score-value'>{player1.score}</div>
      </div>
      <div className='game-result'>
        <div className='player-name'>{player2.username}</div>
        <div className='score-value'>{player2.score}</div>
      </div>
      <hr />
      <div className='show-winner'>
        <div>
          {winner === null && <div style={{ fontSize: '36px' }}>{t('70')}</div>}
          {winner !== null && (
            <div>
              <div style={{ fontSize: '24px' }}>{t('71')}</div>
              <div style={{ fontSize: '36px' }}>{winner}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
