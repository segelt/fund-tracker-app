import React, {useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Context} from '../../context/ThemeProvider';

const ListingTable = ({items, onPressEvent}) => {
  const {theme} = useContext(Context);
  const {colors} = theme;

  return (
    <View style={{...styles.container, backgroundColor: colors.card}}>
      {/* Column Headers for table */}
      <View style={styles.HeaderStyle}>
        <Text
          style={{
            ...styles.HeaderTextStyle,
            flex: 2,
            color: colors.text,
            textAlign: 'left',
          }}>
          Fon Kodu
        </Text>
        <Text style={{...styles.HeaderTextStyle, color: colors.text, flex: 4}}>
          Fon Adı
        </Text>
        <Text
          numberOfLines={1}
          style={{...styles.HeaderTextStyle, color: colors.text, flex: 2}}>
          Pay Değeri
        </Text>
        <Text style={{...styles.HeaderTextStyle, color: colors.text, flex: 2}}>
          Getiri
        </Text>
        <Text
          style={{
            ...styles.HeaderTextStyle,
            color: colors.text,
            flex: 1,
          }}></Text>
      </View>

      {/* Items */}
      <ScrollView style={styles.scrollContainer} decelerationRate="fast">
        {items.map((item, index) => {
          return (
            //Outer container
            <View key={index.toString() + 'outer_container'}>
              {/* Inner container that contains the item info */}
              <View
                key={index.toString() + 'inner_container'}
                style={styles.ItemContainer}>
                <Text
                  style={{
                    ...styles.ItemTextStyle,
                    textAlign: 'left',
                    flex: 2,
                    color: colors.text,
                  }}>
                  {item.fonkodu}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    ...styles.ItemTextStyle,
                    textAlign: 'left',
                    flex: 4,
                    color: colors.text,
                  }}>
                  {item.fonadi}
                </Text>
                <Text
                  style={{
                    ...styles.ItemTextStyle,
                    textAlign: 'center',
                    flex: 2,
                    color: colors.text,
                  }}>
                  {item.birimpaydegeri}
                </Text>
                <Text
                  style={{
                    ...styles.ItemTextStyle,
                    textAlign: 'center',
                    flex: 2,
                    color:
                      item.percentagegain != null && item.percentagegain >= 0
                        ? colors.positive
                        : colors.negative,
                  }}>
                  {item.percentagegain >= 0 ? '+' : '-'}%
                  {item.percentagegain.toFixed(3)}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    onPressEvent(item.fonkodu); //navigate to fund page for this fund code
                  }}>
                  <Icon
                    name="arrow-forward-ios"
                    size={30}
                    color={colors.text}
                  />
                </TouchableOpacity>
              </View>

              {/* Horizontal ruler */}
              <View
                style={{
                  ...styles.HorizontalRuler,
                  borderBottomColor: colors.text,
                }}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  HeaderStyle: {
    flexDirection: 'row',
  },
  HeaderTextStyle: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 5,
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  ItemContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HorizontalRuler: {
    height: 4,
    width: '100%',
    borderBottomWidth: 0.5,
  },
  ItemTextStyle: {
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
});
export default ListingTable;
