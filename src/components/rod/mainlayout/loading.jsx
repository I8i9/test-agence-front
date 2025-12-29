import React from 'react'

const Loading = () => {
  return (
    <>
    <div className='w-full absolute top-0 h-2 bg-red-300'>
        <div className='w-full absolute top-0 h-2 bg-rod-accent animate-subtle-pulse'></div>
    </div>
    </>
  )
}

export default Loading