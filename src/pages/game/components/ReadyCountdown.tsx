import React from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

type Props = {
  duration: number
}

const ReadyCountdown = (props: Props) => {
  const { duration } = props

  return (
    <div className='ready-timer'>
      <div>
        <CountdownCircleTimer
          isPlaying
          duration={duration}
          size={80}
          colors={[
            ['#004777', 0.33],
            ['#F7B801', 0.33],
            ['#A30000', 0.33],
          ]}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
      </div>
      <h3>Ready...</h3>
    </div>
  )
}

export default ReadyCountdown
