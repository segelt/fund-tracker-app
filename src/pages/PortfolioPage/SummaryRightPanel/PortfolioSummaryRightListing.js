import React, {useContext} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Context} from '../../../context/ThemeProvider';
import PortfolioSummaryRightPanelSingleVisualItem from './PortfolioSummaryRightPanelSingleVisualItem';

const PortfolioSummaryRightListing = (props) => {
  const {theme} = useContext(Context);
  const {colors} = theme;
  const BatchData = props.data;
  return (
    <View style={styles.Container}>
      {/* Header */}
      <View>
        <View style={styles.Header}>
          <Text style={{...styles.HeaderText, color: colors.text}}>
            Fon Kodu
          </Text>
          <Text style={{...styles.HeaderText, color: colors.text}}>
            Toplam Pay
          </Text>
          <Text style={{...styles.HeaderText, color: colors.text}}>
            Güncel Fiyat
          </Text>
        </View>
        <View style={{...styles.HeaderRuler, borderColor: colors.text}}></View>
      </View>

      {/* Actual data being displayed */}
      <View style={styles.Container}>
        <FlatList
          data={Object.entries(BatchData)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => {
            return <PortfolioSummaryRightPanelSingleVisualItem item={item} />;
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
  },
  HeaderText: {
    fontFamily: 'Proxima-Nova-Alt-Regular',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  HeaderRuler: {
    width: '100%',
    borderWidth: 0.8,
    alignSelf: 'center',
  },
  Container: {
    flex: 1,
  },
});

export default PortfolioSummaryRightListing;
