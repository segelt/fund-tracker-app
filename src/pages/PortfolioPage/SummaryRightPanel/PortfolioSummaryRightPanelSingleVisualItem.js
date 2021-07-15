import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import NavigationContext from '../../../context/NavigationContext/NavigationStore';
import {Context} from '../../../context/ThemeProvider';
import PortfolioFundGraph from './PortfolioFundGraph';

const PortfolioSummaryRightPanelSingleVisualItem = ({item}) => {
  const {theme} = useContext(Context);
  const {colors} = theme;

  const index = item.index;
  const data = item.item;
  const fundCode = data[0];
  const container = data[1];
  const current_price = container.currentPrice;
  const historical_data = container.historicalData;
  const navigation = useNavigation();

  const {setShouldFetchFundPage} = useContext(NavigationContext);

  const NavigateToFundPageOfThisItem = () => {
    setShouldFetchFundPage(true);
    navigation.navigate('Fund', {fundCode: fundCode});
  };

  return (
    <TouchableOpacity
      style={styles.uniqueListing}
      activeOpacity={0.4}
      onPress={NavigateToFundPageOfThisItem}>
      <View style={styles.ItemContainer}>
        {/* Fund code */}
        <Text style={{...styles.uniqueListingText, color: colors.text}}>
          {fundCode}
        </Text>

        {/* Graph itself */}
        <View style={styles.uniqueListingArea}>
          <PortfolioFundGraph data={historical_data} />
        </View>

        {/* Last price */}
        <Text style={{...styles.uniqueListingText, color: colors.text}}>
          {current_price.toFixed(2)}
        </Text>
      </View>
      <View style={{...styles.ListingRuler, borderColor: colors.text}} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  uniqueListing: {
    width: '100%',
    flexDirection: 'column',
  },
  uniqueListingText: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'Proxima-Nova-Alt-Regular',
    textAlign: 'center',
  },
  uniqueListingArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  ListingRuler: {
    width: '100%', //can be used for padding
    alignSelf: 'center',
    height: 1,
    borderBottomWidth: 0.6,
  },
  ItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
    alignItems: 'center',
    marginVertical: 6,
  },
});
export default PortfolioSummaryRightPanelSingleVisualItem;
