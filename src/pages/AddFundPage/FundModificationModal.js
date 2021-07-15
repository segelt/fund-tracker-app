import React, {useState, useContext} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/AntDesign';
import NavigationContext from '../../context/NavigationContext/NavigationStore';

const FundModificationModal = ({
  ActionState,
  Message,
  setModalVisible,
  isVisible,
}) => {
  const BackDropAction = () => {
    setModalVisible(false);
  };
  const ModalColor =
    ActionState == true ? 'rgba(77, 196, 117, 1)' : 'rgba(196, 95, 77, 1)';

  const ModalIcon = () => {
    if (ActionState == true) {
      return (
        <Icon name="checkcircleo" size={50} color="rgba(255, 255, 255, 1)" />
      );
    } else {
      return (
        <Icon name="closecircleo" size={50} color="rgba(255, 255, 255, 1)" />
      );
    }
  };

  const CloseButtonAction = () => {
    setModalVisible(false);
  };
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={BackDropAction}
      animationInTiming={100}
      animationOutTiming={100}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* Inner checkmark container */}
        <View
          style={{
            ...styles.IconMarkStyle,
            backgroundColor: ModalColor,
          }}>
          <ModalIcon />
        </View>
        {/* Message container */}
        <View
          style={{
            ...styles.MessageContainer,
          }}>
          <Text style={styles.MessageStyle}>{Message}</Text>

          <TouchableOpacity
            style={{...styles.buttonsStyle, backgroundColor: ModalColor}}
            onPress={CloseButtonAction}>
            <Text style={styles.CloseButtonStyle}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FundModificationModal;

const styles = StyleSheet.create({
  IconMarkStyle: {
    alignSelf: 'center',
    width: '90%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    alignItems: 'center',
    paddingVertical: 20,
  },
  MessageContainer: {
    backgroundColor: 'rgb(255, 255, 255)',
    width: '90%',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
  },
  MessageStyle: {
    fontSize: 18,
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  CloseButtonStyle: {
    fontSize: 18,
    fontFamily: 'Proxima-Nova-Alt-Regular',
    color: 'white',
    fontWeight: 'bold',
  },
  buttonsStyle: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    elevation: 2,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
