import React, {useContext, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Context} from '../../../context/ThemeProvider';
import PortfolioDeleteModal from './PortfolioDeleteModal';
import PortfolioSummarySingleBatchItem from './PortfolioSummarySingleBatchItem';
const PortfolioSummaryListing = (props) => {
  const {theme} = useContext(Context);
  const {colors} = theme;
  const BatchData = props.data;
  const refreshCallback = props.refreshCallback;
  const [modalVisible, setModalVisible] = useState(false);
  const [fundToDelete, setFundToDelete] = useState('');
  const triggerDeleteForItem = (str) => {
    setFundToDelete(str);
    setModalVisible(true);
  };
  return (
    <View style={{flex: 1}}>
      {/* Modal */}
      <PortfolioDeleteModal
        isVisible={modalVisible}
        setModalVisible={setModalVisible}
        fundToDelete={fundToDelete}
        refreshCallback={refreshCallback}
      />
      {/* Header */}
      <View>
        <View style={styles.Header}>
          <Text
            style={{
              ...styles.HeaderTextFonKodu,
              color: colors.text,
            }}>
            Fon Kodu
          </Text>
          <Text style={{...styles.HeaderText, color: colors.text}}>
            Güncel Toplam Değer
          </Text>
          <Text style={{...styles.HeaderText, color: colors.text}}>Getiri</Text>
        </View>
        <View style={{...styles.HeaderRuler, borderColor: colors.text}}></View>
      </View>
      {/* Actual data being displayed */}
      <View
        style={{
          ...styles.ListContainer,
        }}>
        <FlatList
          data={Object.entries(BatchData)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => {
            return (
              <PortfolioSummarySingleBatchItem
                item={item}
                triggerDeleteForItem={triggerDeleteForItem}
              />
            );
          }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5,
  },
  HeaderTextFonKodu: {
    fontFamily: 'Proxima-Nova-Alt-Regular',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  HeaderText: {
    fontFamily: 'Proxima-Nova-Alt-Regular',
    fontSize: 16,
    flex: 2,
    textAlign: 'center',
  },
  HeaderRuler: {width: '100%', borderWidth: 0.8, alignSelf: 'center'},
  ListContainer: {
    flex: 1,
  },
  uniqueListing: {
    width: '100%',
    flexDirection: 'column',
  },
  unqiueListArea: {},
  uniqueListingText: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  box: {
    backgroundColor: 'red',
    width: '100%',
  },
  ListingRuler: {
    width: '90%',
    borderBottomWidth: 1.4,
    alignSelf: 'center',
    height: 10,
  },
  ListingFont: {
    fontSize: 16,
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  ListingResultFont: {
    fontSize: 16,
  },
});
export default PortfolioSummaryListing;
