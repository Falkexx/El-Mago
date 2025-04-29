'use client'
import { signOut } from "next-auth/react";

function LogOutBtn(){

  return(

    <button onClick={()=>signOut()} className="ctaBtn px-12 h-11 text-white text-base font-semibold leading-tight">
      Log Out
    </button>
  )
}

export default LogOutBtn;