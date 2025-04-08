'use client'

import React, { useState, memo, useMemo } from 'react'
import Navbar from './Navbar'
import { getPerson } from '../apiHooks/ProfileHooks'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

const MemoizedNavbar = memo(Navbar)
const MemoizedSearch = memo(Search)

export default function Component() {
  const navigate = useNavigate()
  const { data } = useQuery({
    queryKey: ['getPerson'],
    queryFn: getPerson,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [loadedImages, setLoadedImages] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const book = (id) => {
    navigate(`/personDetail/${id}`)
  }

  const filteredDoctors = useMemo(() => {
    return data?.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []
  }, [data, searchTerm])

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)

  const currentDoctors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredDoctors.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredDoctors, currentPage])

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }))
  }

  return (
    <>
      <MemoizedNavbar />
      <div className="bg-sky-200 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-6xl w-full mt-[1px]">
          <main className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Our Persons</h2>
            <div className="mb-8 relative">
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <MemoizedSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xl text-gray-600 font-semibold">No persons found</p>
                <p className="text-gray-500 mt-2">Please try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {currentDoctors?.map((doctor, index) => (
                  <div key={index} className="bg-gray-100 rounded-xl overflow-hidden shadow-md transition-transform hover:scale-105 flex flex-col">
                    <div className="relative pt-[100%] bg-white">
                      <img
                        src={`https://apppintbackend-production.up.railway.app/${doctor.image}`}
                        alt={doctor.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loadedImages[doctor._id] ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => handleImageLoad(doctor._id)}
                      />
                      {!loadedImages[doctor._id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-semibold text-lg mb-2">{doctor.name}</h3>
                      <button
                        onClick={() => book(doctor._id)}
                        className="bg-sky-500 text-white py-2 px-4 rounded-full hover:bg-sky-600 transition-colors w-full mt-auto"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full bg-sky-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex space-x-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-8 h-8 rounded-full ${
                        currentPage === index + 1
                          ? 'bg-sky-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full bg-sky-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
