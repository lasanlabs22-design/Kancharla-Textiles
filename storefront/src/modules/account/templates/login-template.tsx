"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full flex justify-center px-0 xsmall:px-4 py-2 xsmall:py-12">
      <div className="w-full max-w-md bg-white border border-teak-line">
        <div className="zari-band" />
        <div className="flex flex-col items-center px-6 py-10 small:px-10">
          <span className="font-display text-3xl leading-none tracking-[0.2em] pl-[0.2em] text-kumkum">KANCHARLA</span>
          <span className="mt-2 mb-6 text-[9px] tracking-[0.45em] pl-[0.45em] text-teak-muted">TEXTILES</span>
          {currentView === "sign-in" ? (
            <Login setCurrentView={setCurrentView} />
          ) : (
            <Register setCurrentView={setCurrentView} />
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginTemplate
