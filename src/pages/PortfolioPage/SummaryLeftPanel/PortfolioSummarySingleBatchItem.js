import React, {useContext} from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Context} from '../../../context/ThemeProvider';
import {commaDelimitedNumber} from '../../../Utils';

const renderUniqueTimes = (
  item,
  colors,
  shouldDisplayDeleteButton,
  deleteItem,
) => {
  var index = item.index;
  var item = item.item;
  return (
    <View>
      <View
        style={{
          backgroundColor: index % 2 == 0 ? colors.card : colors.notification,
          ...styles.unqiueListAreaContainer,
        }}>
        {/* Alış tarihi */}
        <View style={styles.uniqueListArea}>
          <Text style={{...styles.ListingFont, color: colors.text}}>
            Alış Tarihi
          </Text>
          <Text style={{...styles.ListingResultFont, color: colors.text}}>
            {item.dateAcquired}
          </Text>
        </View>
        {/* Güncel adet */}
        <View style={styles.uniqueListArea}>
          <Text style={{...styles.ListingFont, color: colors.text}}>
            Güncel Adet
          </Text>
          <Text style={{...styles.ListingResultFont, color: colors.text}}>
            {commaDelimitedNumber(item.totalSharesOwned.toFixed(2))}
          </Text>
        </View>
        {/* Güncel Tutar */}
        <View style={styles.uniqueListArea}>
          <Text style={{...styles.ListingFont, color: colors.text}}>
            Güncel Tutar
          </Text>
          <Text style={{...styles.ListingResultFont, color: colors.text}}>
            {commaDelimitedNumber(item.currentTotalPrice.toFixed(3))}₺
          </Text>
        </View>
        {/* Alış fiyatı */}
        <View style={styles.uniqueListArea}>
          <Text style={{...styles.ListingFont, color: colors.text}}>
            Alış fiyatı
          </Text>
          <Text style={{...styles.ListingResultFont, color: colors.text}}>
            {item.fundValue.toFixed(4)}₺
          </Text>
        </View>
        {/* Alış fiyatı */}
        <View style={styles.uniqueListArea}>
          <Text style={{...styles.ListingFont, color: colors.text}}>
            Güncel fiyat
          </Text>
          <Text style={{...styles.ListingResultFont, color: colors.text}}>
            {item.latestFundPrice.toFixed(4)}₺
          </Text>
        </View>
        {/* Getiri */}
        <View style={styles.uniqueListArea}>
          <Text style={{...styles.ListingFont, color: colors.text}}>
            Getiri
          </Text>
          <Text
            style={{
              ...styles.ListingResultFont,
              color: item.gainRatio >= 0 ? colors.positive : colors.negative,
            }}>
            {item.gainRatio >= 0 ? '+' : ''}%{item.gainRatio.toFixed(2)}
          </Text>
        </View>
        {/* Kar/zarar */}
        <View style={styles.uniqueListArea}>
          <Text style={{...styles.ListingFont, color: colors.text}}>
            Kar/Zarar
          </Text>
          <Text
            style={{
              ...styles.ListingResultFont,
              color: item.amountGained >= 0 ? colors.positive : colors.negative,
            }}>
            {item.amountGained >= 0 ? '+' : '-'}
            {commaDelimitedNumber(item.amountGained.toFixed(2))}₺
          </Text>
        </View>
      </View>
      {shouldDisplayDeleteButton && (
        <View
          style={{
            ...styles.shouldDisplayContainer,
            backgroundColor: index % 2 == 0 ? colors.card : colors.notification,
          }}>
          <TouchableOpacity
            activeOpacity={1}
            zIndex={1}
            elevation={1}
            onPress={() => {
              deleteItem();
            }}
            style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Sil</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const PortfolioSummarySingleBatchItem = ({item, triggerDeleteForItem}) => {
  const {theme} = useContext(Context);
  const {colors} = theme;

  //const index = item.index;
  const data = item.item[1];
  const fundCode = item.item[0];
  const _OverallData = data.overall[0];
  const _DistinctData = data.distinct;

  const itemCount = _DistinctData.length;
  const ITEM_HEIGHT = 130.28572; //static
  const totalLength = ITEM_HEIGHT * itemCount;

  const animatedInfoContainerMult = useSharedValue(0);
  const derivedInfoContainerValue = useDerivedValue(() => {
    return animatedInfoContainerMult.value == 0
      ? 0
      : animatedInfoContainerMult.value * totalLength + 50;
  });

  const animationStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(derivedInfoContainerValue.value, {
        duration: 200,
      }),
    };
  });

  const ToggleAnimatedValue = () => {
    animatedInfoContainerMult.value =
      animatedInfoContainerMult.value == 0 ? 1 : 0;
  };

  const {width: ScreenWidth} = Dimensions.get('window');

  return (
    <View nestedScrollEnabled={false}>
      <View style={[styles.mainContainerStyle]}>
        {/* Actual list item */}
        <View style={[styles.uniqueListing, {width: ScreenWidth}]}>
          <TouchableOpacity
            style={styles.uniqueListing}
            activeOpacity={1}
            onPress={ToggleAnimatedValue}>
            <View style={styles.ListAreaSingleItemStyle}>
              <Text
                style={{
                  ...styles.uniqueListingTextFonKodu,
                  color: colors.text,
                }}>
                {fundCode}
              </Text>
              <Text style={{...styles.uniqueListingText, color: colors.text}}>
                {commaDelimitedNumber(
                  _OverallData.currentTotalPrice.toFixed(2),
                )}
                ₺
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  ...styles.uniqueListingText,
                  color:
                    _OverallData.gainRatio > 0
                      ? colors.positive
                      : colors.negative,
                }}>
                {_OverallData.gainRatio > 0 ? '+' : ''}
                {commaDelimitedNumber(_OverallData.amountGained.toFixed(2))}₺ (
                {_OverallData.gainRatio > 0 ? '+' : ''}
                {_OverallData.gainRatio.toFixed(2)}%)
              </Text>
            </View>
            <View style={{...styles.ListingRuler, borderColor: colors.text}} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Nestled list displaying time etc */}
      <Animated.View
        nestedScrollEnabled={false}
        style={[styles.box, animationStyle]}>
        {/* Display the flatlist */}
        <ScrollView nestedScrollEnabled={true}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={_DistinctData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item) => {
              var shouldDisplayDeleteButton =
                item.index >= _DistinctData.length - 1;

              const deleteItem = () => {
                triggerDeleteForItem(fundCode);
              };

              return renderUniqueTimes(
                item,
                colors,
                shouldDisplayDeleteButton,
                deleteItem,
              );
            }}
          />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  uniqueListing: {
    flexDirection: 'column',
  },
  unqiueListAreaContainer: {
    width: '100%',
    paddingHorizontal: '5%',
    alignSelf: 'center',
  },
  uniqueListArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uniqueListingText: {
    fontSize: 16,
    fontFamily: 'Proxima-Nova-Alt-Regular',
    flex: 2,
    textAlign: 'center',
  },
  uniqueListingTextFonKodu: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'Proxima-Nova-Alt-Regular',
    textAlign: 'center',
  },
  box: {
    width: '100%',
  },
  ListingRuler: {
    width: '100%',
    alignSelf: 'center',
    height: 1,
    borderBottomWidth: 1,
  },
  ListingFont: {
    fontSize: 16,
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  ListingResultFont: {
    fontSize: 16,
  },

  deleteButton: {
    width: '40%',
    height: 30,
    backgroundColor: '#911503',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  deleteButtonText: {
    fontSize: 18,
    fontFamily: 'Proxima-Nova-Alt-Regular',
    color: 'white',
  },
  mainContainerStyle: {
    width: '100%',
    flexDirection: 'row',
  },
  shouldDisplayContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ListAreaSingleItemStyle: {
    flexDirection: 'row',
    marginVertical: 15, //change this value for padding
  },
});

export default PortfolioSummarySingleBatchItem;
