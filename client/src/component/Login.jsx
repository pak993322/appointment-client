import { useAuth0 } from "@auth0/auth0-react";
import React,{ useState, useEffect } from 'react'
import man from "../assets/man.png"

export default function Component() {
  const [text, setText] = useState('')
  const [showExclamation, setShowExclamation] = useState(true)
  const { loginWithRedirect } = useAuth0();
  const fullText = 'Ease your appointment'

  useEffect(() => {
    let i = 0
    const intervalId = setInterval(() => {
      setText(fullText.slice(0, i))
      i++
      if (i > fullText.length) {
        clearInterval(intervalId)
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowExclamation(prev => !prev)
    }, 500)

    return () => clearInterval(blinkInterval)
  }, [])

  return (
    <div className="bg-sky-200 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-6xl w-full">
        <header className="flex justify-between items-center p-6">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span className="ml-2 text-xl font-semibold text-gray-800">Period</span>
          </div>
          <div className="flex items-center">
            <button onClick={() => loginWithRedirect()} className="bg-sky-400 text-white px-4 py-2 rounded-full hover:bg-sky-500 transition duration-300">
              Sign Up
            </button>
          </div>
        </header>
        <div className='flex justify-center'>
          <div>
            <span className="mr-4 sm:text-sm sm:font-light md:text-lg md:font-medium text-sky-600">
              {text}{showExclamation ? '!' : ''}
            </span>
          </div>
        </div>
        <main className="flex flex-col md:flex-row items-center p-6 md:p-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Future Is Here,<br />Start Exploring Now.
            </h1>
            <p className="text-gray-600 mb-6 max-w-md">
              I am writing to schedule an appointment with you at a convenient time. Could you please let me know your availability in the upcoming week?
            </p>
            <button onClick={() => loginWithRedirect()} className="bg-sky-400 text-white px-6 py-3 rounded-full hover:bg-sky-500 transition duration-300">
              Get Started bro
            </button>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-sky-100 rounded-3xl transform rotate-3"></div>
            <img
              src={man}
              alt="Person using smartphone"
              width={500}
              height={500}
              className="relative z-10 rounded-3xl"
            />
          </div>
        </main>
        <div className="absolute bottom-4 left-4">
          <button className="bg-gray-800 text-white p-2 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
