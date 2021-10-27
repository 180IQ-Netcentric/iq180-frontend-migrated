import React from 'react'

const BouncingArrow = () => {
  return (
    <div>
      <svg className='arrow'>
        <path className='a1' d='M0 0 L30 22 L60 0'></path>
        <path className='a2' d='M0 20 L30 42 L60 20'></path>
        <path className='a3' d='M0 40 L30 62 L60 40'></path>
      </svg>
    </div>
  )
}

export default BouncingArrow
