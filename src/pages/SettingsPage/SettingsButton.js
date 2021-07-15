import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Context} from '../../context/ThemeProvider';

const SettingsButton = (props) => {
  const isLast = props.isLast;
  const {theme} = useContext(Context);
  const {colors} = theme;
  return (
    <TouchableOpacity
      style={{
        ...{borderBottomWidth: !isLast ? 0.5 : 0},
      }}
      onPress={props.clickAction}>
      <View style={Styles.ButtonStyle}>
        <Icon
          name="folder-remove"
          size={24}
          color={colors.inactiveCard}
          style={Styles.IconStyle}
        />
        <Text style={{...Styles.TextStyle, color: colors.text}}>
          {props.ButtonText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SettingsButton;

const Styles = StyleSheet.create({
  ButtonStyle: {
    borderRadius: 6,
    paddingVertical: 10,
    flexDirection: 'row',
    marginBottom: 1,
  },
  IconStyle: {
    marginHorizontal: 10,
  },
  TextStyle: {
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    fontFamily: 'Proxima-Nova-Alt-Regular',
    fontSize: 16,
  },
});
