import {createContext} from 'react';

export const globalState = {
  darkMode: false,
  toggleTheme: () => {},
};

export default Context = createContext(globalState);
