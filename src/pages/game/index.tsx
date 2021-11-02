import React, { useContext, useEffect, useState } from 'react'
import Scoreboard from '../../components/scoreboard/Scoreboard'
import GameContainer from '../../components/containers/GameContainer'
import { Button, Stack } from '@mui/material'
import OperationButton from '../../components/buttons/OperationButton'
import RigidButton from '../../components/buttons/RigidButton'
import { UserContext } from '../../contexts/userContext'
import PlayerScores from './components/PlayerScores'
import CountDownTimer from './components/GameCountdown'
import ErrorAlert from '../../components/alerts/ErrorAlert'
import { useHistory } from 'react-router'
import { RoundEnd } from './components/RoundEnd'
import { GameEnd } from './components/GameEnd'
import withUserGuard from '../../guards/user.guard'
import Solution from './components/Solution'
import useSound from 'use-sound'
import {
  GameInfo,
  PlayerGameInfo,
  Question,
  SocketContext,
} from '../../contexts/socketContext'
import { client } from '../../config/axiosConfig'
import WaitingScreen from './components/WaitingScreen'
import { Theme, ThemeContext } from '../../contexts/themeContext'
import { useTranslation } from 'react-i18next'
import ReadyCountdown from './components/ReadyCountdown'
// @ts-ignore
import timeEnd from '../../assets/audio/timeEnd.mp3'
// @ts-ignore
import timeEndWrong from '../../assets/audio/timeEndWrong.mp3'
import Chat from '../../components/chat'

type Views = 'READY' | 'GAME' | 'WAITING' | 'ROUND_END' | 'GAME_END'

const Game = () => {
  // Context and utilities
  const { t } = useTranslation()
  const {
    socket,
    gameInfo,
    setGameInfo,
    nextTurn,
    nextRound,
    startGame,
    settings,
    endRound,
    winnerUsername,
    setWinnerUsername,
    setPlayerInfos,
  } = useContext(SocketContext)
  const { user } = useContext(UserContext)
  const { theme: appTheme } = useContext(ThemeContext)
  const history = useHistory()
  const defaultPlayer = { username: '', score: 0, timeUsed: 0 }

  // Game States
  const OPERATION_SIGNS = ['+', '-', '×', '÷']
  const [numberOptions, setNumberOptions] = useState<number[]>([])
  const [questions, setQuestions] = useState<Question[]>()
  const [selectedNumberKey, setSelectedNumberKey] = useState<number | null>(
    null
  )
  const [selectedOperator, setSelectedOperator] = useState<string>('')
  const [selectedOperands, setSelectedOperands] = useState<(number | null)[]>([
    null,
    null,
  ])
  const [currentResult, setCurrentResult] = useState<number | null>(null)
  const [showLeaveGameAlert, setShowleaveGameAlert] = useState(false)
  const [targetNumber, setTargetNumber] = useState(15)
  const [showCorrectStatus, setShowCorrectStatus] = useState(false)
  const [isRoundWinner, setRoundWinner] = useState(true)
  const [shouldShowSolution, setShouldShowSolution] = useState(false)
  const [player1] = useState<PlayerGameInfo>(defaultPlayer)
  const [player2] = useState<PlayerGameInfo>(defaultPlayer)
  const [roundTime, setRoundTime] = useState<number[]>([0, 0])
  const [view, setView] = useState<Views>('WAITING')
  const [disableOperandButtons, setDisableOperandButtons] = useState(false)
  const [isShowScoreboard, setIsShowScoreboard] = useState(true)
  const isCorrectSolution = () => targetNumber === currentResult
  const [playWinSfx] = useSound(timeEnd)
  const [playLoseSfx] = useSound(timeEndWrong)

  const calculateResult = (num1: number, num2: number, operator: string) => {
    switch (operator) {
      case '+':
        return num1 + num2
      case '-':
        return num1 - num2
      case '×':
        return num1 * num2
      case '÷':
        return num1 / num2
    }
    return 0
  }

  const clearInputs = () => {
    setDisableOperandButtons(false)
    setSelectedOperator('')
    setSelectedOperands([null, null])
    setCurrentResult(null)
    setSelectedNumberKey(null)
  }

  const updateButtons = () => {
    const copyNumOptions = [...numberOptions]
    selectedOperands.forEach((operand) => {
      for (let i = 0; i < copyNumOptions.length; i++) {
        if (copyNumOptions[i] === operand) {
          copyNumOptions.splice(i, 1)
          break
        }
      }
    })
    if (currentResult !== null)
      setNumberOptions([currentResult, ...copyNumOptions])
  }

  const resetButtons = () => {
    clearInputs()
    if (gameInfo && questions)
      setNumberOptions(questions[gameInfo.currentRound - 1].numberShuffle)
  }

  const startNextRound = () => {
    setDisableOperandButtons(false)
    nextRound()
  }

  const endPlayerRound = () => {
    if (gameInfo?.setting.isClassicMode) {
      setTimeout(() => {
        setRoundWinner(isCorrectSolution())
        if (isCorrectSolution()) playWinSfx()
        else playLoseSfx()
        clearInputs()
        if (user && gameInfo && user.username === gameInfo.firstPlayer) {
          nextTurn({
            username: user?.username,
            timeUsed: settings?.timeLimit ?? 999,
          })
          setView('WAITING')
        } else if (user && gameInfo && user.username !== gameInfo.firstPlayer) {
          endRound({
            username: user?.username,
            timeUsed: settings?.timeLimit ?? 999,
          })
          setView('ROUND_END')
        }
      }, 1000)
    } else {
      if (user && gameInfo && user.username === gameInfo.firstPlayer) {
        endRound({
          username: user.username,
          timeUsed: gameInfo.setting.timeLimit,
        })
        setView('ROUND_END')
      }
    }
  }

  const playAgain = () => {
    setGameInfo(undefined)
    setPlayerInfos([])
    history.push('/')
    setPlayerInfos([])
    history.push('/lobby')
  }

  const leaveGame = () => {
    // socket leave game event
    // redirect user to home
    setShowleaveGameAlert(false)
    history.push('/')
  }

  // socket implementation
  useEffect(() => {
    if (!socket) return
    startGame()

    socket.on('startRound', (gameInfo: GameInfo) => {
      setQuestions(gameInfo.questions)
      setGameInfo(gameInfo)
      resetButtons()
      setView('READY')
      setTimeout(() => {
        const now = new Date()
        setRoundTime([now.getTime(), roundTime[1]])

        // If your username is firstPlayer then u start playing game
        // If not then wait
        if (gameInfo.setting.isClassicMode) {
          if (user?.username === gameInfo?.firstPlayer) setView('GAME')
          else setView('WAITING')
        } else {
          setView('GAME')
        }
      }, 3000)
    })

    socket.on('startNextTurn', (info: GameInfo) => {
      setTimeout(() => {
        resetButtons()
        if (user?.username !== info?.firstPlayer) setView('READY')
        if (user?.username !== info?.firstPlayer) {
          setTimeout(() => {
            const now = new Date()
            setRoundTime([now.getTime(), roundTime[1]])
            setView('GAME')
          }, 3000)
        } else setView('WAITING')
      }, 1000)
    })

    socket.on('announceWinner', ({ gameInfo, winnerUsername }) => {
      setGameInfo(gameInfo)
      setWinnerUsername(winnerUsername)
      const thisPlayer =
        gameInfo.player1.username === user?.username
          ? gameInfo.player1
          : gameInfo.player2

      const cannotAnswer = thisPlayer.timeUsed === null
      if (settings?.isClassicMode) {
        setShouldShowSolution(user?.username !== winnerUsername && cannotAnswer)
      } else {
        setShouldShowSolution(user?.username !== winnerUsername && cannotAnswer)
      }

      setTimeout(() => {
        setView('ROUND_END')
      }, 1000)
    })

    socket.on('endGame', (info: GameInfo) => {
      setGameInfo(info)
      setView('GAME_END')

      // update score win if you win
      // update score lose if you lose
      const thisPlayer =
        info.player1.username === user?.username ? info.player1 : info.player2
      const opponent =
        info.player1.username === user?.username ? info.player2 : info.player1
      if (thisPlayer.score > opponent.score) {
        client.put('/win')
      } else if (thisPlayer.score < opponent.score) {
        client.put('/lose')
      }
      const isLoser = thisPlayer.score < opponent.score
      if (!gameInfo?.setting.isClassicMode && isLoser) {
        setShouldShowSolution(true)
      } else if (!gameInfo?.setting.isClassicMode && !isLoser) {
        setShouldShowSolution(false)
      }
      if (gameInfo?.setting.isClassicMode && isLoser) {
        const cannotAnswer = thisPlayer.timeUsed === null
        setShouldShowSolution(cannotAnswer)
      }
    })
  }, []) // @ts-ignore

  useEffect(() => {
    if (gameInfo) {
      const currentQuestion = gameInfo.questions[gameInfo.currentRound - 1]
      setNumberOptions(currentQuestion.numberShuffle)
      setTargetNumber(gameInfo.questions[gameInfo.currentRound - 1].result)
    }
  }, [view])

  useEffect(() => {
    // auto calculates when the numbers and operators are input
    if (
      selectedOperator &&
      selectedOperands[0] !== null &&
      selectedOperands[1] !== null
    ) {
      const result = calculateResult(
        selectedOperands[0],
        selectedOperands[1],
        selectedOperator
      )
      setCurrentResult(result)
      setRoundWinner(isCorrectSolution())
      if (numberOptions.length <= 2) {
        // displays the answer correctness
        setShowCorrectStatus(true)

        // case correct answer
        if (result === targetNumber) {
          playWinSfx()
          setDisableOperandButtons(true)
          const now = new Date()
          setRoundTime([roundTime[0], now.getTime()])
          const timeDiff = Math.floor((roundTime[1] - roundTime[0]) / 1000)

          if (gameInfo?.setting.isClassicMode) {
            if (
              user &&
              currentResult !== null &&
              user?.username === gameInfo?.firstPlayer
            ) {
              nextTurn({ username: user.username, timeUsed: timeDiff })
            } else if (
              user &&
              currentResult &&
              user?.username !== gameInfo?.firstPlayer
            ) {
              endRound({ username: user.username, timeUsed: timeDiff })
            }
            setTimeout(() => {
              if (gameInfo?.currentRound !== settings?.round) setView('WAITING')
            }, 1000)
          } else {
            if (user && timeDiff > 0) {
              endRound({ username: user.username, timeUsed: timeDiff })
            }

            setTimeout(() => {
              if (gameInfo?.currentRound !== gameInfo?.setting.round)
                setView('ROUND_END')
            }, 1000)
          }
        }

        // case wrong answer
        else {
          playLoseSfx()
          setTimeout(() => {
            clearInputs()
          }, 1000)
        }
      }
      setTimeout(() => {
        if (currentResult !== null) {
          updateButtons()
          clearInputs()
          setShowCorrectStatus(false)
        }
      }, 1000)
    }
  }, [selectedOperands, selectedOperator, currentResult])

  return (
    <>
      <ErrorAlert
        open={showLeaveGameAlert}
        setOpen={setShowleaveGameAlert}
        title={t('73')}
        description={t('53')}
        primaryAction={leaveGame}
        secondaryAction={() => setShowleaveGameAlert(false)}
      />
      <GameContainer>
        <div className='game-padding'>
          <PlayerScores
            player1={gameInfo?.player1 ?? player1}
            player2={gameInfo?.player2 ?? player2}
          />
          <div className='game-page-container'>
            <div className='home-options-container'>
              <div className='scoreboard'>
                <Scoreboard
                  className={`${!isShowScoreboard || 'hidden'}`}
                  small={true}
                  toggleView={() => setIsShowScoreboard(true)}
                />
                <Chat
                  toggleView={() => setIsShowScoreboard(false)}
                  className={`${isShowScoreboard || 'hidden'}`}
                />
              </div>
            </div>
            <div
              className={`play-area play-area${
                appTheme === Theme.DARK ? '-dark' : ''
              }`}
            >
              <div
                className={`game-display${
                  appTheme === Theme.DARK ? '-dark' : ''
                }`}
              >
                {view === 'READY' && <ReadyCountdown duration={3} />}
                {view === 'GAME' && (
                  <div>
                    <div className='question-container'>
                      <CountDownTimer
                        onComplete={endPlayerRound}
                        duration={settings?.timeLimit ?? 60}
                      />
                      <h3>{`Target Number: ${targetNumber}`}</h3>
                    </div>
                    <div className='working-container'>
                      <div className='number-slot'>{selectedOperands[0]}</div>
                      <div className='operator-slot'>{selectedOperator}</div>
                      <div className='number-slot'>{selectedOperands[1]}</div>=
                      <div className='number-slot'>{currentResult}</div>
                    </div>
                    {showCorrectStatus && (
                      <div>
                        <h2
                          className={`${
                            targetNumber === currentResult ? 'correct' : 'wrong'
                          }-status`}
                        >
                          {targetNumber === currentResult ? 'CORRECT' : 'WRONG'}
                        </h2>
                      </div>
                    )}
                  </div>
                )}
                {view === 'WAITING' && <WaitingScreen />}
                {view === 'ROUND_END' && gameInfo && (
                  <RoundEnd
                    player1={gameInfo.player1}
                    player2={gameInfo.player2}
                    winnerUsername={winnerUsername}
                  />
                )}
                {view === 'GAME_END' && gameInfo && <GameEnd />}
              </div>
              <div className='option-display'>
                {view === 'GAME' && (
                  <div className='game-buttons-container'>
                    <div className='operations-container'>
                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        spacing={1}
                        className='button-row'
                      >
                        {numberOptions.map((num, index) => (
                          <RigidButton
                            disabled={
                              disableOperandButtons ||
                              (!selectedOperator &&
                                !(selectedOperands[0] === null)) ||
                              index === selectedNumberKey
                            }
                            key={index}
                            onClick={() => {
                              if (selectedOperands[0] === null) {
                                setSelectedNumberKey(index)
                                setSelectedOperands([num, null])
                              } else {
                                setSelectedOperands([selectedOperands[0], num])
                              }
                            }}
                          >
                            {num}
                          </RigidButton>
                        ))}
                      </Stack>
                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        spacing={1}
                        className='button-row-space-between'
                      >
                        {OPERATION_SIGNS.map((operation, index) => (
                          <OperationButton
                            key={index}
                            onClick={() => setSelectedOperator(operation)}
                          >
                            {operation}
                          </OperationButton>
                        ))}
                      </Stack>
                    </div>
                    <div className='controls-container'>
                      <Button
                        variant='contained'
                        sx={{
                          backgroundColor: 'primary',
                          height: '48px',
                          width: '100%',
                          marginBottom: '12px',
                        }}
                        onClick={resetButtons}
                      >
                        {t('38')}
                      </Button>
                      <Button
                        variant='contained'
                        sx={{
                          backgroundColor: '#D14835',
                          height: '48px',
                          width: '100%',
                        }}
                        onClick={() => setShowleaveGameAlert(true)}
                      >
                        {t('39')}
                      </Button>
                    </div>
                  </div>
                )}
                {view === 'ROUND_END' && (
                  <div className='round-end-options-container'>
                    {shouldShowSolution && <Solution />}
                    {isRoundWinner && (
                      <Button
                        variant='contained'
                        sx={{
                          backgroundColor: 'primary',
                          height: '48px',
                          width: '100%',
                        }}
                        className='button-row'
                        onClick={startNextRound}
                      >
                        {t('60')}
                      </Button>
                    )}
                    {!isRoundWinner && !shouldShowSolution && (
                      <Solution startNextRound={startNextRound} />
                    )}
                  </div>
                )}
                {view === 'GAME_END' && (
                  <div className='controls-container'>
                    {shouldShowSolution && <Solution />}
                    <Button
                      variant='contained'
                      sx={{
                        backgroundColor: 'primary',
                        height: '48px',
                        width: '100%',
                      }}
                      className='button-row'
                      onClick={playAgain}
                    >
                      {t('49')}
                    </Button>
                    <Button
                      variant='contained'
                      sx={{
                        backgroundColor: '#D14835',
                        height: '48px',
                        width: '100%',
                      }}
                      onClick={() => setShowleaveGameAlert(true)}
                    >
                      {t('48')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </GameContainer>
    </>
  )
}

export default withUserGuard(Game)
