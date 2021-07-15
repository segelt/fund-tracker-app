import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Context} from '../../context/ThemeProvider';
import ThemeTogglerSwitch from '../../context/ThemeTogglerSwitch';

const SettingsToggle = (props) => {
  const {theme} = useContext(Context);
  const {colors} = theme;

  return (
    <TouchableOpacity onPress={props.clickAction} activeOpacity={1}>
      <View style={Styles.ButtonStyle}>
        <Icon
          name="folder-remove"
          size={24}
          color={colors.inactiveCard}
          style={Styles.IconStyle}
        />
        <Text style={{...Styles.TextStyle, color: colors.text}}>
          {props.ToggleText}
        </Text>
        <ThemeTogglerSwitch />
      </View>
    </TouchableOpacity>
  );
};

export default SettingsToggle;

const Styles = StyleSheet.create({
  ButtonStyle: {
    borderRadius: 6,
    paddingVertical: 10,
    flexDirection: 'row',
    marginBottom: 1,
    paddingRight: 10,
  },
  IconStyle: {
    marginHorizontal: 10,
  },
  TextStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontFamily: 'Proxima-Nova-Alt-Regular',
    fontSize: 16,
    flex: 1,
  },
});
