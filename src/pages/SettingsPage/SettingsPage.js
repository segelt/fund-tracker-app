import {useHeaderHeight} from '@react-navigation/stack';
import React, {useContext, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import getDB from '../../context/Database';
import {Context} from '../../context/ThemeProvider';
import ThemeTogglerSwitch from '../../context/ThemeTogglerSwitch';
import LinearBackground from '../../LinearBackground';
import DBService from './DBService';
import SettingsButton from './SettingsButton';
import SettingsDataProviderModal from './SettingsDataProviderModal';
import SettingsToggle from './SettingsToggle';

const SettingsPage = ({navigation, route}) => {
  const headerHeight = useHeaderHeight();

  const {theme} = useContext(Context);
  const {colors} = theme; //theme.dark
  const [modalVisible, setModalVisible] = useState(false);

  const TemaText = (theme.dark ? 'Açık' : 'Koyu') + ' tema';

  const ResetAppDBState = async () => {
    try {
      await DBService.dropTable('portfolyo').then(async () => {
        await DBService.addFundTableIfNotExists('portfolyo');
      });
    } catch (err) {
      //log error at reseting application state
    }
  };

  const _OnModalShow = () => {
    setModalVisible(true);
  };

  const NewSettingsPage = () => {
    /*
     * Application Database
     * Theme
     * Info
     */
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={{...styles.AreaText, ...{color: colors.text}}}>
          UYGULAMA
        </Text>
        {/* Inner area */}
        <View
          style={{
            ...styles.AreaStyle,
            ...{backgroundColor: colors.notification},
          }}>
          <SettingsButton
            ButtonText="Veri sağlayıcısı metni"
            isLast={false}
            clickAction={_OnModalShow}
          />
          <SettingsButton
            ButtonText="Uygulamayı Sıfırla"
            clickAction={ResetAppDBState}
            isLast={true}
          />
        </View>

        {/* Tema */}
        <Text style={{...styles.AreaText, ...{color: colors.text}}}>TEMA</Text>
        <View
          style={{
            ...styles.AreaStyle,
            ...{backgroundColor: colors.notification},
          }}>
          <SettingsToggle ToggleText={TemaText} />
        </View>

        <SettingsDataProviderModal
          isVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </View>
    );
  };

  return (
    <LinearBackground>
      <ScrollView
        style={{
          ...styles.container,
          paddingTop: headerHeight,
        }}>
        <NewSettingsPage />
      </ScrollView>
    </LinearBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  ThemeSwitchContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'red',
    alignItems: 'center',
  },
  TemaTextStyle: {
    fontSize: 14,
    marginRight: 20,
  },
  AreaText: {
    fontFamily: 'Proxima-Nova-Alt-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  AreaStyle: {
    width: '100%',
    borderRadius: 6,
    marginTop: 10,
    borderBottomWidth: 0.5,
  },
});
export default SettingsPage;
