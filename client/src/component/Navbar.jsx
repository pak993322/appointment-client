'use client'

import React, { useState } from 'react'
import { useAuth0 } from "@auth0/auth0-react"
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const { logout } = useAuth0()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <div className="bg-sky-200 p-4">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-6xl w-full mx-auto">
                <div className="bg-yellow-100 py-1 px-4 text-center text-sm text-yellow-800">
                    It's not a real application, it's a module
                </div>
                <header className="flex justify-between items-center p-6">
                    <div className="flex items-center">
                        <svg className="w-8 h-8 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        <Link to="/"><span className="ml-2 text-xl font-semibold text-gray-800">Period</span></Link>
                    </div>
                    <div className="hidden md:flex space-x-2">
                        <Link to="/" className="block text-sky-400 hover:text-sky-500 transition duration-300 py-2">Home</Link>
                        <Link to="/addPerson" className="block text-sky-400 hover:text-sky-500 transition duration-300 py-2">MakeProfile</Link>
                        <Link to="/addSlots" className="block text-sky-400 hover:text-sky-500 transition duration-300 py-2">GenerateSlots</Link>
                    </div>
                    <div className="hidden md:flex items-center">
                        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="bg-sky-400 text-white px-4 py-2 rounded-full hover:bg-sky-500 transition duration-300">
                            Sign Out
                        </button>
                    </div>
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-sky-400 hover:text-sky-500 transition duration-300">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </header>
                {isMenuOpen && (
                    <div className="md:hidden bg-white px-6 pb-6">
                        <Link to="/" className="block text-sky-400 hover:text-sky-500 transition duration-300 py-2">Home</Link>
                        <Link to="/addPerson" className="block text-sky-400 hover:text-sky-500 transition duration-300 py-2">PersonProfile</Link>
                        <Link to="/addSlots" className="block text-sky-400 hover:text-sky-500 transition duration-300 py-2">MakeProfile</Link>
                        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="w-full bg-sky-400 text-white px-4 py-2 rounded-full hover:bg-sky-500 transition duration-300 mt-4">
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}