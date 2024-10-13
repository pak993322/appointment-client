// useSlotBooking.js
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { bookAppointment, getAppDateTime, getSlots } from '../apiHooks/ProfileHooks';
import { today } from "@internationalized/date";
import { toast } from 'react-toastify';

const useSlotBooking = (id, isOpen) => {
    const [size, setSize] = useState('5xl');
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [properdate, setProperDate] = useState(null);
    const [otherSlots, setOtherSlots] = useState({ slots: [] });

    const bookMutation = useMutation({
        mutationFn: bookAppointment,
        onSuccess: () => {
            toast("🦄 Appointment Booked");
        },
        onError: (error) => {
            toast.error(`${error.response?.data?.message || 'An error occurred'}`);
        },
    });

    const { data: dateAndTime } = useQuery({
        queryKey: ['getAppDateTime', id],
        queryFn: () => getAppDateTime(id),
    });

    const to = today();

    useEffect(() => {
        const proper = new Date(to.year, to.month - 1, to.day);
        const formattedDate = `${proper.getFullYear()}-${String(proper.getMonth() + 1).padStart(2, '0')}-${String(proper.getDate()).padStart(2, '0')}`;
        const matchingAppointments = dateAndTime?.appointments?.filter(appointment => appointment.date === formattedDate);
        const times = matchingAppointments?.map(appointment => appointment.time);
        setOtherSlots({ slots: times });
    }, [dateAndTime]);

    const selectedDate = new Date(to);
    const options = { weekday: 'long' };
    const dayOfWeek = new Intl.DateTimeFormat('en-US', options).format(selectedDate);

    const { data: slotData } = useQuery({
        queryKey: ['getSlots', id, selectedDay],
        queryFn: () => getSlots(id, selectedDay ? selectedDay : dayOfWeek.toLowerCase()),
        enabled: !!isOpen,
    });

    const handleOpen = () => {
        console.log('opening modal');
        const tod = today();
        const proper = new Date(tod.year, tod.month - 1, tod.day);
        const formattedDate = `${proper.getFullYear()}-${String(proper.getMonth() + 1).padStart(2, '0')}-${String(proper.getDate()).padStart(2, '0')}`;
        const matchingAppointments = dateAndTime?.appointments?.filter(appointment => appointment.date === formattedDate);
        const times = matchingAppointments?.map(appointment => appointment.time);
        setOtherSlots({ slots: times });
        setProperDate(formattedDate);
        setSize(size);
    };

    const handleDateChange = (date) => {
        setSelectedSlot(null);
        const proper = new Date(date.year, date.month - 1, date.day);
        const formattedDate = `${proper.getFullYear()}-${String(proper.getMonth() + 1).padStart(2, '0')}-${String(proper.getDate()).padStart(2, '0')}`;
        
        const matchingAppointments = dateAndTime?.appointments?.filter(appointment => appointment.date === formattedDate);
        const times = matchingAppointments?.map(appointment => appointment.time);
        setOtherSlots({ slots: times });

        const selectedDate = new Date(date.year, date.month - 1, date.day);
        const options = { weekday: 'long' };
        const dayOfWeek = new Intl.DateTimeFormat('en-US', options).format(selectedDate);
        setSelectedDay(dayOfWeek.toLowerCase());
        setProperDate(formattedDate);
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    const handleBookAppointment = () => {
        if (selectedSlot && properdate) {
            bookMutation.mutate({
                person: id,
                date: properdate,
                time: selectedSlot,
            });
        } else {
            toast.error("Please select a date and time");
        }
    };

    const resetState = () => {
        setOtherSlots({ slots: [] });
        setSelectedDay(null);
        setSelectedSlot(null);
    };

    return {
        size,
        selectedDay,
        selectedSlot,
        properdate,
        otherSlots,
        slotData,
        handleOpen,
        handleDateChange,
        handleSlotSelect,
        handleBookAppointment,
        resetState,
    };
};

export default useSlotBooking;
