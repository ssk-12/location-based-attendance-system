import { atom, selector } from 'recoil';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const emailState = atom({
  key: 'emailState',
  default: '',
});

export const passwordState = atom({
  key: 'passwordState',
  default: '',
});

export const usernameState = atom({
  key: 'usernameState',
  default: '',
});

export const messageState = atom({
  key: 'messageState',
  default: '',
});

export const userState = selector({
  key: 'userState', // Unique ID (with respect to other atoms/selectors)
  get: async ({ get }) => {
    try {
      const response = await axios.get("http://localhost:8787/api/v1/allevents/events");
      return response.data;
    } catch (error) {
      // Handle any errors
      console.error('Failed to fetch user details:', error);
      return null;
    }
  },
});