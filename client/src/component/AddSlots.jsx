import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import Select from "react-select"
import { getPerson, addSlots } from "../apiHooks/ProfileHooks"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from "./Navbar"

const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4)
  const minute = (i % 4) * 15
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    label: `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`
  }
})

const dayOptions = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
]

export default function AddSlots() {
  const [formData, setFormData] = useState({
    person_id: "",
    day: null,
    startTime: null,
    endTime: null,
    interval: "",
  })

  const { data } = useQuery({
    queryKey: ['getPerson'],
    queryFn: getPerson,
  })

  const mutation = useMutation({
    mutationFn: (formDataToSend) => addSlots(formDataToSend),
    onSuccess: () => {
      toast("🦄 Slot Added");
      setFormData({
        person_id: "",
        day: null,
        startTime: null,
        endTime: null,
        interval: "",
      });
    },
    onError: (error) => {
      // Check if it's a 400 error
      if (error.response?.status === 400) {
        // Handle the specific case for 400 errors with backend message
        toast.error(`${error.response?.data?.error || 'Bad request: Please provide day, startTime, endTime, and interval'}`);
      } else {
        // Handle other errors
        toast.error(`${error.response?.data?.message || 'An error occurred'}`);
      }
    },
  });
  

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({
      ...formData,
      day: formData.day?.value,
      startTime: formData.startTime?.value,
      endTime: formData.endTime?.value,
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "interval" ? parseInt(value) : value,
    })
  }

  const handleSelectChange = (selectedOption, actionMeta) => {
    setFormData({
      ...formData,
      [actionMeta.name]: selectedOption,
    })
  }

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: '#D1D5DB',
      '&:hover': {
        borderColor: '#9CA3AF',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 10,
    }),
  }

  return (
    <>
    <Navbar/>
    <ToastContainer/>
    <div className="bg-sky-200 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-6xl w-full mt-[-100px]">
        <main className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="period-type" className="block text-sm font-medium text-gray-700 mb-1">
                Period Type
              </label>
              <select
                id="period-type"
                name="person_id"
                value={formData.person_id}
                onChange={handleChange}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Select Name</option>
                {data?.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">
                Select Day
              </label>
              <Select
                id="day"
                name="day"
                value={formData.day}
                onChange={handleSelectChange}
                options={dayOptions}
                styles={selectStyles}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select day"
              />
            </div>
            <div>
              <label htmlFor="interval" className="block text-sm font-medium text-gray-700 mb-1">
                Select Interval
              </label>
              <select
                id="interval"
                name="interval"
                value={formData.interval}
                onChange={handleChange}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Select Interval</option>
                <option value={30}>30</option>
              </select>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="relative">
                <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <Select
                  id="start-time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleSelectChange}
                  options={timeOptions}
                  styles={selectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select start time"
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </div>
              <div className="relative">
                <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <Select
                  id="end-time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleSelectChange}
                  options={timeOptions}
                  styles={selectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select end time"
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Save Period Information
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
    </>
  )
}