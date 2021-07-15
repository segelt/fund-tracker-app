import 'react-native-gesture-handler';
import React, {useContext, useState, useEffect} from 'react';
import ThemeProvider, {Context} from './src/context/ThemeProvider';

import NavigationProvider from './src/context/NavigationContext/NavigationProvider';
import ApiContextProvider from './src/context/ApiContext/ApiContextProvider';

import Root from './Root';

const App = () => {
  return (
    <ThemeProvider>
      <ApiContextProvider>
        <NavigationProvider>
          <Root />
        </NavigationProvider>
      </ApiContextProvider>
    </ThemeProvider>
  );
};

export default App;
