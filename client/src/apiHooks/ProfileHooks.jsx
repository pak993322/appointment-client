import axios from 'axios';

export const addPerson = async (formData) => {
  const response = await axios.post('https://backend-six-puce-13.vercel.app/person/addPerson', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const addSlots = async (formData) => {
  console.log("formData",formData)
  const response = await axios.post('https://backend-six-puce-13.vercel.app/person/personSlots', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};


export const getPerson = async () => {
  const response = await axios.get('https://backend-six-puce-13.vercel.app/person/getPerson', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;  
};
export const getPersonById = async (id) => {
  const response = await axios.get(`https://backend-six-puce-13.vercel.app/person/getPersonById/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;  
};
export const getSlots = async (id,day) => {
  const response = await axios.get(`https://backend-six-puce-13.vercel.app/person/getSlots/${id}/${day}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;  
};


export const bookAppointment = async (formData) => {
  console.log("formData",formData)
  const response = await axios.post('https://backend-six-puce-13.vercel.app/booked/bookedApp', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getAppDateTime = async (id) => {
  try {
    const response = await axios.get(`https://backend-six-puce-13.vercel.app/booked/getAppointments/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 404) {
      throw new Error('Appointment not found');
    }

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { error: 'Appointment not found' };
    }
    
    return { error: 'An error occurred while fetching the appointment' };
  }
};
