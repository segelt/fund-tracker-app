import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Context} from '../../context/ThemeProvider';

const itemSize = 40;

const IntervalSelectorButton = ({text, onPress, currentIndex, value}) => {
  const {theme} = useContext(Context);
  const {colors} = theme;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={
        currentIndex == value
          ? {
              ...styles.selectedContainer,
              backgroundColor: colors.inactiveCard,
            }
          : {...styles.deselectedContainer, color: colors.text}
      }
      onPress={onPress}>
      <Text
        style={
          currentIndex == value
            ? {...styles.selectedText, color: colors.invertForeColor}
            : {...styles.deselectedText, color: colors.text}
        }>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deselectedContainer: {
    width: itemSize,
    height: itemSize,
    borderRadius: itemSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedContainer: {
    width: itemSize,
    height: itemSize,
    borderRadius: itemSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: 'white',
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  deselectedText: {
    color: 'black',
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
});

export default IntervalSelectorButton;
