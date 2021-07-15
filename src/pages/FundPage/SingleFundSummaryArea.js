import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Context} from '../../context/ThemeProvider';
import {commaDelimitedNumber} from '../../Utils';

const SingleFundSummaryArea = ({data, index}) => {
  const {theme} = useContext(Context);
  const {colors} = theme;

  return (
    <View style={styles.container}>
      {index != 0 && <View style={styles.returnRuler} />}
      {/* Each horizontal row */}
      <View style={styles.info}>
        <Text style={{...styles.InfoText, color: colors.invertForeColor}}>
          Fon Alış Tarihi
        </Text>
        <Text style={{...styles.InfoText, color: colors.invertForeColor}}>
          {data.dateAcquired}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={{...styles.InfoText, color: colors.invertForeColor}}>
          Alınan adet
        </Text>
        <Text style={{...styles.InfoText, color: colors.invertForeColor}}>
          {commaDelimitedNumber(data.totalSharesOwned)}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={{...styles.InfoText, color: colors.invertForeColor}}>
          Fon Pay değeri
        </Text>
        <Text style={{...styles.InfoText, color: colors.invertForeColor}}>
          {data.fundValue}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={{...styles.InfoText, color: colors.invertForeColor}}>
          Getiri
        </Text>
        <Text
          style={{
            ...styles.InfoText,
            color: data.gainRatio >= 0 ? colors.positive : colors.negative,
          }}>
          {data.gainRatio >= 0 ? '+' : '-'}%{data.gainRatio.toFixed(2)}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={{...styles.InfoText, color: colors.invertForeColor}}>
          Kar/Zarar
        </Text>
        <Text
          style={{
            ...styles.InfoText,
            color: data.amountGained >= 0 ? colors.positive : colors.negative,
          }}>
          {' '}
          {data.amountGained >= 0 ? '+' : ''}
          {commaDelimitedNumber(data.amountGained.toFixed(2))}₺
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  returnRuler: {
    borderBottomWidth: 1.2,
    borderBottomColor: '#7a7977',
    width: '100%',
    marginBottom: 6,
  },
  InfoText: {
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
});
export default SingleFundSummaryArea;
