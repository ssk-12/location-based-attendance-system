import { atom } from 'recoil';

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
