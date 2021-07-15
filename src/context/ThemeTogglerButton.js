import React, {useContext} from 'react';
import {Button} from 'react-native';
import ThemeProvider, {Context} from './ThemeProvider';
import {CustomDefaultTheme, CustomDarkTheme} from '../../constants';

function ThemeTogglerButton() {
  // The Theme Toggler Button receives not only the theme  // but also a toggleTheme function from the context
  return (
    <Context.Consumer>
      {({theme, updateTheme}) => (
        <Button
          onPress={() => {
            updateTheme(!theme.dark ? CustomDarkTheme : CustomDefaultTheme);
          }}
        />
      )}
    </Context.Consumer>
  );
}

export default ThemeTogglerButton;
