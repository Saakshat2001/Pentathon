import axios from 'axios';

export const postData = async (payload) => {
  try {
    const response = await axios.post('https://x4s7hmcja2.execute-api.us-west-2.amazonaws.com/sandbox/uploadEvents', {
        user_id: "user",
        eventType: "calendar",
        calendar_events: payload
      
    });

    console.log('Response:', response.data); // Handle the response data here
  } catch (error) {
    console.error('Error:', error.message); // Handle errors here
  }
};

