import React, {useState, useMemo} from 'react';
import {CustomDefaultTheme, CustomDarkTheme} from '../../constants';

export const Context = React.createContext();

const ThemeProvider = (props) => {
  const [theme, updateTheme] = useState(false);
  const value = useMemo(() => [theme, updateTheme], [theme]);

  return (
    <Context.Provider
      value={{
        theme: value[0] == false ? CustomDefaultTheme : CustomDarkTheme,
        updateTheme: value[1],
      }}
      theme={theme}>
      {props.children}
    </Context.Provider>
  );
};

export default ThemeProvider;
