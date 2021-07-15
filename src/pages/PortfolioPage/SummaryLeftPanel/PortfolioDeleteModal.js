import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationContext from '../../../context/NavigationContext/NavigationStore';
import DBService from '../../SettingsPage/DBService';

const PortfolioDeleteModal = ({
  fonKodu,
  isVisible,
  setModalVisible,
  deleteItem,
  fundToDelete,
  refreshCallback,
}) => {
  const {setShouldFetchPortfolioData} = useContext(NavigationContext);

  const deleteFundAction = async () => {
    await DBService.deleteFund(fundToDelete)
      .then((resultSet) => {
        if (resultSet == 1) {
          setShouldFetchPortfolioData(true);
          setModalVisible(false);
          refreshCallback();
        } else {
          setModalVisible(false);
        }
      })
      .catch((err) => {
        //error occured
        setModalVisible(false);
      });
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => setModalVisible(false)}
      animationInTiming={100}
      animationOutTiming={100}>
      <View style={styles.ModalContainerStyle}>
        {/* Inner container */}
        <View style={styles.InnerContainerStyle}>
          <View style={styles.TopStyle}>
            <Icon name="warning" size={50} color="rgba(161, 71, 91,255)" />
            <View style={styles.TopTextContainerStyle}>
              <Text style={styles.DeleteTextStyle}>
                Fon Silme İşlemi: {fundToDelete}
              </Text>
              <Text style={styles.WarningTextStyle}>
                Bu işlem geri alınamaz.
              </Text>
            </View>
          </View>
          <View style={styles.BottomAreaStyle}>
            <TouchableOpacity
              style={styles.buttonsStyle}
              onPress={() => {
                setModalVisible(false);
              }}>
              <Text style={styles.CancelTextStyle}>VAZGEÇ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.buttonsStyle,
                ...{backgroundColor: 'rgba(161, 71, 91,255)'},
              }}
              onPress={deleteFundAction}>
              <Text style={styles.DeleteConfirmTextStyle}>SİL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PortfolioDeleteModal;

const styles = StyleSheet.create({
  buttonsStyle: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 25,
    elevation: 2,
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ModalContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  InnerContainerStyle: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: '90%',
    borderRadius: 10,
  },
  TopStyle: {
    flexDirection: 'row',
    //backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 0.4,
  },
  TopTextContainerStyle: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 10,
  },
  DeleteTextStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Proxima-Nova-Alt-Regular',
    color: '#262626',
  },
  WarningTextStyle: {fontSize: 18, fontFamily: 'Proxima-Nova-Alt-Regular'},
  BottomAreaStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  CancelTextStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  DeleteConfirmTextStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
});
