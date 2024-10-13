import React, { useRef, useState, useEffect, memo } from 'react' // Import memo
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar'
const MemoizedNavbar = memo(Navbar) // Memoized Navbar
import SlotBook from './SlotBook'
import { getPersonById } from '../apiHooks/ProfileHooks'

// Wrap SlotBook with React.memo
const MemoizedSlotBook = memo(SlotBook)

export default function PersonDetail() {
  const { id } = useParams()
  const slotBookRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const { data } = useQuery({
    queryKey: ['getPersonById', id],
    queryFn: () => getPersonById(id),
  })

  const handleOpenSlotBook = () => {
    if (slotBookRef.current) {
      slotBookRef.current.handleOpen("5xl")
    }
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <MemoizedNavbar /> {/* Use MemoizedNavbar */}
      <ToastContainer />
      <div className="bg-sky-200 min-h-screen z-0 flex items-center justify-center p-4">
        <MemoizedSlotBook ref={slotBookRef} id={id} /> {/* Use MemoizedSlotBook */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-6xl w-full mt-[1px] md:mt-[-100px]">
          <main className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <div className="relative w-full h-64 md:h-full">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse">
                    <div className="h-full w-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                )}
                <img
                  src={`http://localhost:4000/${data?.image}`}
                  alt="Person's image"
                  className={`w-full h-[330px] object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={handleImageLoad}
                />
              </div>
            </div>
            <div className="md:w-2/3 p-8 flex flex-col justify-between mt-[60px] md:mt-0">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{data?.name || 'Loading...'}</h1>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {data ? 'Time, once lost, can never be regained, making it essential to approach it with purpose and discipline. By valuing time, we empower ourselves to make the most of every opportunity and move closer to our objectives.' : 'Loading...'}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm font-medium">Expert</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Consultant</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Speaker</span>
                </div>
              </div>
              <button
                onClick={handleOpenSlotBook}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
              >
                Book Now
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}