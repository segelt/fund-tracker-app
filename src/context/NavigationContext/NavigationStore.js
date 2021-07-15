import {createContext} from 'react';

export const initialState = {
  CurrentRoute: '',
  ShouldReloadData: true,
};

export default NavigationContext = createContext(initialState);
