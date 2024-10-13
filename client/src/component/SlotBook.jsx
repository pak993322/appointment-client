import React, { useEffect, useImperativeHandle, forwardRef, useState, useMemo, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { bookAppointment, getAppDateTime, getSlots } from '../apiHooks/ProfileHooks';
import { today, getLocalTimeZone } from "@internationalized/date";
import { Calendar } from "@nextui-org/react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { X, ChevronRight, Calendar as CalendarIcon, Clock, User, MapPin, Phone } from 'lucide-react';

const SlotBook = forwardRef(({ id }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [properdate, setProperDate] = useState(null);
    const [otherSlots, setOtherSlots] = useState({ slots: [] });
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
    const [loading, setLoading] = useState(false); // New loading state

    const bookMutation = useMutation({
        mutationFn: bookAppointment,
        onSuccess: () => {
            toast.success("🎉 Appointment Booked Successfully!");
            handleClose();
        },
        onError: (error) => {
            toast.error(`${error.response?.data?.message || 'An error occurred'}`);
        },
    });

    const { data: dateAndTime, refetch } = useQuery({
        queryKey: ['getAppDateTime', id],
        queryFn: () => getAppDateTime(id),
    });

    const { data: slotData, isFetching } = useQuery({
        queryKey: ['getSlots', id, selectedDay],
        queryFn: () => getSlots(id, selectedDay ? selectedDay : today(getLocalTimeZone()).toDate().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()),
        enabled: !!isOpen,
        onSuccess: () => setLoading(false), // Stop loading when data is fetched successfully
        onError: () => setLoading(false),   // Stop loading even if there's an error
    });

    const fetchDateAntTime = () => {
        if (dateAndTime?.appointments) {
            const todayDate = today(getLocalTimeZone());
            const formattedDate = `${todayDate.year}-${String(todayDate.month).padStart(2, '0')}-${String(todayDate.day).padStart(2, '0')}`;
            const matchingAppointments = dateAndTime.appointments.filter(appointment => appointment.date === formattedDate);
            const times = matchingAppointments.map(appointment => appointment.time);
            setOtherSlots({ slots: times });
        }
    }

    useEffect(() => {
        fetchDateAntTime();
    }, [dateAndTime]);

    const handleOpen = async () => {
        await refetch();
        fetchDateAntTime();
        const to = today();
        const formattedDate = `${to.year}-${String(to.month).padStart(2, '0')}-${String(to.day).padStart(2, '0')}`;
        setProperDate(formattedDate);
        setIsOpen(true);
    };

    useImperativeHandle(ref, () => ({
        handleOpen,
    }));

    const defaultValue = useMemo(() => today(getLocalTimeZone()), []);
    const minValue = useMemo(() => today(getLocalTimeZone()), []);

    const handleDateChange = useCallback((date) => {
        setSelectedSlot(null);
        setShowForm(false);
        setLoading(true); // Start loading before fetching slots

        const formattedDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
        setProperDate(formattedDate);

        const matchingAppointments = dateAndTime?.appointments?.filter(appointment => appointment.date === formattedDate);
        const times = matchingAppointments?.map(appointment => appointment.time) || [];
        setOtherSlots({ slots: times });

        const selectedDate = new Date(date.year, date.month - 1, date.day);
        const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        setSelectedDay(dayOfWeek);
    }, [dateAndTime]);

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setShowForm(false);
    };

    const handleNext = () => {
        setShowForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleBookAppointment = () => {
        if (selectedSlot && properdate && formData.name && formData.address && formData.phone) {
            bookMutation.mutate({
                person: id,
                date: properdate,
                time: selectedSlot,
                ...formData
            });
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setOtherSlots({ slots: [] });
        setSelectedDay(null);
        setSelectedSlot(null);
        setShowForm(false);
        setFormData({ name: '', address: '', phone: '' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
                <div className="sticky top-0 z-10 flex justify-between items-center p-6 bg-gradient-to-r from-sky-500 to-indigo-500">
                    <h2 className="text-2xl font-bold text-white">Book Your Appointment</h2>
                    <button onClick={handleClose} className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/2">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2 flex items-center">
                                    <CalendarIcon size={20} className="mr-2 text-sky-500" />
                                    Select Date
                                </h3>
                                <Calendar
                                    aria-label="Select a date"
                                    defaultValue={defaultValue}
                                    onChange={handleDateChange}
                                    minValue={minValue}
                                    className="w-full border border-gray-200 rounded-lg shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <h3 className="text-lg font-semibold mb-2 flex items-center">
                                <Clock size={20} className="mr-2 text-sky-500" />
                                Available Slots
                            </h3>
                            <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-sky-500 scrollbar-track-sky-100">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {isFetching ? (
          <div className="col-span-full flex justify-center items-center h-40">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 right-0 bottom-0 animate-spin">
                <div className="h-full w-full rounded-[50%] border-4 border-t-sky-500 border-r-sky-500 border-b-sky-200 border-l-sky-200"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-sky-500 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ) : slotData?.slots?.length > 0 ? (
          slotData.slots.map((slot, index) => {
            const isDisabled = otherSlots?.slots?.includes(slot);
            return (
              <button
                key={index}
                onClick={() => !isDisabled && handleSlotSelect(slot)}
                disabled={isDisabled}
                className={`p-2 text-sm rounded-md transition-all duration-200 ${
                  selectedSlot === slot
                    ? 'bg-sky-500 text-white shadow-md transform scale-105'
                    : isDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100 hover:shadow'
                }`}
              >
                {slot}
              </button>
            );
          })
        ) : (
          <p className="text-gray-500 col-span-full">No available slots</p>
        )}
      </div>
    </div>

                        </div>
                    </div>
                    {selectedSlot && !showForm && (
                        <div className="mt-6">
                            <button
                                onClick={handleNext}
                                className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-indigo-500 hover:to-sky-500 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
                            >
                                Next
                            </button>
                        </div>
                    )}
                    {showForm && (
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center">
                                <User size={20} className="mr-2 text-sky-500" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
                                />
                            </div>
                            <div className="flex items-center">
                                <MapPin size={20} className="mr-2 text-sky-500" />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Your Address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
                                />
                            </div>
                            <div className="flex items-center">
                                <Phone size={20} className="mr-2 text-sky-500" />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Your Phone Number"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
                                />
                            </div>
                            <div className="mt-6">
                                <button
                                    onClick={handleBookAppointment}
                                    disabled={!formData.name || !formData.address || !formData.phone}
                                    className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white py-2 px-4 rounded-md hover:from-sky-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default SlotBook;
