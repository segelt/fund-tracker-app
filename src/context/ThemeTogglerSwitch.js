import React, {useContext} from 'react';
import {Switch} from 'react-native';
import ThemeProvider, {Context} from './ThemeProvider';
import {CustomDefaultTheme, CustomDarkTheme} from '../../constants';
import NavigationContext from '../context/NavigationContext/NavigationStore';

function ThemeTogglerSwitch() {
  const {
    thisRoute,
    shouldFetchPortfolioData,
    setShouldFetchPortfolioData,
    setShouldFetchFundPage,
  } = useContext(NavigationContext);

  return (
    <Context.Consumer>
      {({theme, updateTheme}) => (
        <Switch
          trackColor={{
            false: theme.colors.primary,
            true: theme.colors.text,
          }}
          thumbColor={'#ffffff'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            updateTheme(!theme.dark ? true : false);
          }}
          value={!theme.dark}
          style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
        />
      )}
    </Context.Consumer>
  );
}

export default ThemeTogglerSwitch;
