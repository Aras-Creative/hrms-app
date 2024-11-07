import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({label = "Default Label"}) => {
  return (
    <div>
        <Link href="/dashboard" className="bg-primary rounded-xl w-full justify-center items-center flex text-white hover:bg-opacity-85 py-3 font-semibold text-lg transition-colors duration-300 ease-in-out">
    {label}
    </Link>
    </div>
  )
}

export default Button