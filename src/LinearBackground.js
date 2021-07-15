import React, {useContext} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Context} from '../src/context/ThemeProvider';

const LinearBackground = (props) => {
  const {theme} = useContext(Context);
  const {colors} = theme;
  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundbottom]}
      style={{flex: 1}}>
      {props.children}
    </LinearGradient>
  );
};

export default LinearBackground;
