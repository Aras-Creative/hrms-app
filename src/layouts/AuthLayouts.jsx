import React from 'react'

const AuthLayouts = ({children}) => {
  return (
    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full">
        <div className="flex flex-col w-full items-start p-10">
            <div className="w-full">
                {children}
            </div>
        </div>
    </div>
  )
}

export default AuthLayouts