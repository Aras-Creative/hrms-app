import React from 'react'
import {Icon} from "@iconify/react"

const InputForm = (props) => {
    const {id, label, icon} = props
  return (
    <div>
    <label id={id} className="text-sm text-zinc-800 font-semibold px-1">
        {label}
    </label>
    <div className="w-full rounded-lg border border-dark-alt px-3 py-1 mt-1 flex items-center gap-1 text-zinc-800 group hover:border-zinc-800 focus-within:border-zinc-800 transition-all duration-300 ease-in-out">
        <Icon icon={icon} width="1.5rem" height="1.5rem" className="flex-shrink-0 pt-1" />
        <input
                className="border-node outline-none flex-1 px-2 py-1"
                placeholder="Enter your email"
                {...props}
        />
    </div>

</div>
  )
}

export default InputForm