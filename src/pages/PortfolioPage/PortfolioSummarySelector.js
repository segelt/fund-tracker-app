import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Context} from '../../context/ThemeProvider';

const PortfolioSummarySelector = ({text, isSelected, onPress}) => {
  const {theme} = useContext(Context);
  const {colors} = theme;

  return (
    //isSelected ? styles.SelectedRuler : styles.DeSelectedRuler,
    <TouchableOpacity style={styles.OuterContainer} onPress={onPress}>
      <Text
        style={[
          isSelected
            ? {...styles.SelectedText, color: colors.primary}
            : {...styles.DeSelectedText, color: colors.text},
        ]}>
        {text}
      </Text>
      <View
        style={[
          isSelected
            ? {...styles.SelectedRuler, borderBottomColor: colors.primary}
            : {...styles.DeSelectedRuler, borderBottomColor: colors.text},
        ]}></View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  OuterContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SelectedText: {
    marginHorizontal: 10,
  },
  DeSelectedText: {
    marginHorizontal: 10,
  },
  SelectedRuler: {
    height: 4,
    width: '100%',
    borderBottomWidth: 3,
  },
  DeSelectedRuler: {
    height: 3,
    width: '100%',
    borderBottomWidth: 1,
  },
});

export default PortfolioSummarySelector;
