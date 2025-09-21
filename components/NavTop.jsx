import React from 'react'

const NavTop = () => {
  return (
    <div className='w-full flex justify-between items-center bg-red-200 px-4'>
      <h1>The Computer Club</h1>
      <div>
        Click here
      </div>
      <div className='flex gap-4'>
        <h1>Call Us: 1234567</h1>
        <h1>Store Location</h1>
      </div>
    </div>
  )
}

export default NavTop
