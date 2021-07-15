import React, {useReducer} from 'react';

import Context, {globalState} from './store';
import {reducer} from './reducer';

const Provider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, globalState);
  return (
    <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
  );
};

export default Provider;
