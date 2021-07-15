import React, {useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {Context} from '../../context/ThemeProvider';

const SettingsDataProviderModal = ({isVisible, setModalVisible}) => {
  const {theme} = useContext(Context);
  const {colors} = theme;

  const _OnModalCancel = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => setModalVisible(false)}
      animationInTiming={100}
      animationOutTiming={100}>
      <View
        style={{
          ...Styles.DataProviderContainer,
          backgroundColor: colors.background,
        }}>
        <ScrollView>
          <View
            style={{...Styles.InnerContainer, borderBottomColor: colors.text}}>
            <Text style={{...Styles.TitleText, color: colors.text}}>
              Veri Sağlayıcısı ve Sorumluluk Reddi
            </Text>
          </View>
          <View>
            <Text style={{...Styles.MainTextStyle, ...{color: colors.text}}}>
              Fon verileri spk.gov.tr adresinden sağlanmaktadır. Tüm veriler ve
              bilgiler, yalnızca bilgilendirme amacıyla "olduğu gibi" sağlanmış
              olup alım satım amaçlı veya finansal, yatırım, vergi, yasal,
              muhasebe ya da diğer konularda tavsiye niteliğinde değildir.
              Lütfen her türlü alım satım işleminden önce fiyatları doğrulamak
              için aracı kurumunuza veya mali temsilcinize danışın. Fon
              uygulaması; yatırım danışmanı, mali danışman ya da hisse senedi
              aracısı değildir. Veri ve bilgilerin hiçbiri, bir menkul kıymetin
              ya da finansal ürünün satın alınmasına, satılmasına veya
              tutulmasına yönelik Fon Uygulaması tarafından yapılan bir yatırım
              tavsiyesi, teklif, öneri ya da talep değildir. Fon Uygulaması,
              herhangi bir yatırımın tavsiye edilebilirliği veya uygunluğu
              konusunda hiçbir taahhütte bulunmaz.
            </Text>
            <Text style={{...Styles.MainTextStyle, ...{color: colors.text}}}>
              Veriler, finans borsaları ve diğer içerik sağlayıcıları tarafından
              sağlanmakta olup finans borsalarının veya diğer veri
              sağlayıcılarının belirttiği şekilde gecikmeli olabilir. Fon
              Uygulaması hiçbir veriyi doğrulamaz ve bunu yapma yükümlülüğünü
              reddeder.
            </Text>
          </View>
          <TouchableOpacity
            onPress={_OnModalCancel}
            style={{
              ...Styles.ConfirmButton,
              backgroundColor: colors.confirmButton,
            }}>
            <Text style={{...Styles.ConfirmTextStyle, ...{color: colors.text}}}>
              TAMAM
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default SettingsDataProviderModal;

const Styles = StyleSheet.create({
  MainTextStyle: {
    fontFamily: 'Proxima-Nova-Alt-Regular',
    fontSize: 16,
    marginBottom: 20,
  },

  ConfirmTextStyle: {
    fontFamily: 'Proxima-Nova-Alt-Regular',
    fontSize: 16,
  },
  DataProviderContainer: {
    height: '80%',
    borderRadius: 15,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  InnerContainer: {
    width: '100%',
    borderBottomWidth: 2,
    marginBottom: 10,
  },
  TitleText: {
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'Proxima-Nova-Alt-Regular',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ConfirmButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
