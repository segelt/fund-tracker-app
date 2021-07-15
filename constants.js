import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

export const CustomDefaultTheme = {
  dark: false,
  colors: {
    primary: '#3291c9',
    background: 'rgb(242, 242, 242)',
    card: '#ced4da',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: '#dce1e3',
    activeTintColor: '#035B95',
    inactiveTintColor: '#1E1E1E',
    inactiveCard: '#3a404d',
    invertForeColor: '#ffffff',
    positive: '#1eba0d',
    negative: '#de2612',
    confirmButton: '#ced4da',
    transparent: 'rgba(0,0,0,0)',
    backgroundbottom: '#dbd9d9',
  },
};

export const CustomDarkTheme = {
  dark: true,
  colors: {
    primary: '#39a0e3',
    background: '#171f24',
    card: '#1c2a35',
    text: '#eefbfb',
    border: '#4da8da',
    notification: '#3a404d',
    activeTintColor: '#ffffff',
    inactiveTintColor: '#63c1ff',
    inactiveCard: '#ffffff', //014361
    invertForeColor: '#000000',
    positive: '#44fc30',
    negative: '#de2612',
    confirmButton: '#354f63',
    transparent: 'rgba(0,0,0,0)',
    backgroundbottom: '#0e334a',
  },
};
