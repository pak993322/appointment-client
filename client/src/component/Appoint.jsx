import React, { useState } from 'react';

function Appoint({ startTime, endTime, interval = 30 }) {
  const [selectedDay, setSelectedDay] = useState('');
  const [inputStartTime, setInputStartTime] = useState(startTime);
  const [inputEndTime, setInputEndTime] = useState(endTime);
  const [schedule, setSchedule] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [showSlots, setShowSlots] = useState();
  const [notfound,setNotFound] = useState("");

  const convertTo24HourFormat = (time) => {
    let [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    return { hours, minutes };
  };

  const generateTimeSlots = () => {
    const slots = [];
    let { hours: startHour, minutes: startMinute } = convertTo24HourFormat(inputStartTime);
    const { hours: endHour, minutes: endMinute } = convertTo24HourFormat(inputEndTime);

    while (startHour < endHour || (startHour === endHour && startMinute < endMinute)) {
      const period = startHour < 12 ? 'AM' : 'PM';
      const formattedHour = startHour % 12 === 0 ? 12 : startHour % 12;
      const formattedMinute = startMinute === 0 ? '00' : startMinute;
      slots.push(`${formattedHour}:${formattedMinute} ${period}`);

      startMinute += interval;
      if (startMinute >= 60) {
        startHour += 1;
        startMinute -= 60;
      }
    }

    return slots;
  };

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setInputStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setInputEndTime(e.target.value);
  };

  const handleAddSlots = () => {
    if (selectedDay && inputStartTime && inputEndTime) {
      const newTimeSlots = generateTimeSlots();
      setSchedule((prevSchedule) => ({
        ...prevSchedule,
        [selectedDay]: newTimeSlots,
      }));
    }
  };
console.log(schedule)
  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedDate(e.target.value);

    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    if (schedule[dayOfWeek]) {
      setShowSlots(schedule[dayOfWeek].join(', '))
    } else {
      setNotFound(`No schedule available for ${dayOfWeek}`)
      setShowSlots()
    }
  };

  return (
    <div>
      <h3>Schedule Time Slots</h3>
      <form>
        <label>
          Select Day:
          <select value={selectedDay} onChange={handleDayChange}>
            <option value="">--Select Day--</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </select>
        </label>
        <br />
        <label>
          Start Time:
          <input type="text" value={inputStartTime} onChange={handleStartTimeChange} placeholder="e.g. 11:00 AM" />
        </label>
        <br />
        <label>
          End Time:
          <input type="text" value={inputEndTime} onChange={handleEndTimeChange} placeholder="e.g. 3:30 PM" />
        </label>
        <br />
        <button type="button" onClick={handleAddSlots}>
          Add Slots
        </button>
      </form>
      <br />
      <h3>Check Schedule by Date</h3>
      <label>
        Select Date:
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </label>

      {showSlots ? (
        <p>
        {showSlots}
        </p>
      ):(
        <p>{notfound}</p>
      )}
    </div>
  );
}

export default Appoint;
