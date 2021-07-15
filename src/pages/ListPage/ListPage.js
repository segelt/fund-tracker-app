import {useHeaderHeight} from '@react-navigation/stack';
import axios from 'axios';
import {style} from 'd3-selection';
import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {BallIndicator} from 'react-native-indicators';
import fontakip, {CancelToken} from '../../api/fontakip';
import NavigationContext from '../../context/NavigationContext/NavigationStore';
import {Context} from '../../context/ThemeProvider';
import LinearBackground from '../../LinearBackground';
import ListingTable from './ListingTable';

const TimeItems = [
  {
    label: 'Günlük',
    value: 0,
  },
  {
    label: 'Haftalık',
    value: 1,
  },
  {
    label: '2 Haftalık',
    value: 2,
  },
  {
    label: '1 Aylık',
    value: 3,
  },
  {
    label: '3 Aylık',
    value: 4,
  },
  {
    label: '1 yıllık.',
    value: 5,
  },
  {
    label: '3 yıllık.',
    value: 6,
  },
];

const sortItems = [
  {
    label: 'Artan',
    value: 0,
  },
  {
    label: 'Azalan',
    value: 1,
  },
];

const renderSeperator = (colors) => {
  return (
    <View style={{...styles.dropdownRuler, backgroundColor: colors.text}} />
  );
};

const ListPage = ({navigation, route}) => {
  const {theme} = useContext(Context);
  const {colors} = theme;

  const headerHeight = useHeaderHeight();

  const timeInterval = useRef(0);
  const order = useRef(0);
  const [isFilterOnGoing, setFilterOnGoing] = useState(false);
  const [_ListData, setListData] = useState([]);
  const [_ListingFailed, setListingFailed] = useState(false);

  const {setShouldFetchFundPage} = useContext(NavigationContext);

  //Navigate to fund page for this fund code when the item is selected from the listing table
  const onPressNavigate = (fundCode) => {
    setShouldFetchFundPage(true);
    navigation.navigate('Fund', {fundCode: fundCode});
  };

  function OnDropdownTimeIntervalChange(item) {
    timeInterval.current = item.value;
  }

  const FetchExternalData = async () => {
    setFilterOnGoing(true); //Display the loading animation

    let shouldCancel = true;
    let shouldContinueFetchingData = true;
    let _ListingData = [];

    const source = CancelToken.source();

    setTimeout(() => {
      if (shouldCancel) {
        source.cancel('Timeout reached.');
      }
    }, 6000);

    let params = {
      Kod: order.current,
      TimeInterval: timeInterval.current,
    };

    await fontakip
      .post('/historicdata/sort', params, {
        cancelToken: source.token,
      })
      .then((response) => {
        shouldCancel = false;
        _ListingData = response.data;
      })
      .catch(function (thrown) {
        shouldContinueFetchingData = false;
        // if (axios.isCancel(thrown)) {
        //   Request timeout
        // } else {
        //   an actual error
        // }
      });

    if (shouldContinueFetchingData) {
      setListData(_ListingData);
      setListingFailed(false);
    } else {
      setListingFailed(true);
    }

    setFilterOnGoing(false);
  };

  const ItemLists = () => {
    //If there are any items in the collection, display them in the datatable
    if (_ListData.length > 0) {
      return <ListingTable items={_ListData} onPressEvent={onPressNavigate} />;
    } else {
      return (
        <View
          style={{
            ...styles.emptyContainer,
            backgroundColor: colors.card,
          }}>
          {_ListingFailed ? (
            <Text
              style={{
                color: colors.text,
                ...styles.InformationText,
              }}>
              Filtreleme sonuçları alınamadı. Lütfen daha sonra tekrar
              deneyiniz.
            </Text>
          ) : (
            <Text
              style={{
                color: colors.text,
                ...styles.InformationText,
              }}>
              Lütfen kriter belirleyip filtreleme işlemi yapınız.
            </Text>
          )}
        </View>
      );
    }
  };

  return (
    <LinearBackground>
      <View
        style={{
          ...styles.container,
          paddingTop: headerHeight,
        }}>
        {/* Sorting picker menus */}
        <View style={styles.PickerMenus}>
          <DropDownPicker
            placeholder="Zaman Aralığı"
            items={TimeItems}
            defaultValue={this.timeInterval}
            containerStyle={styles.dropdownContainerStyle}
            style={{
              backgroundColor: colors.card,
              ...styles.dropdownBorderStyle,
            }}
            itemStyle={{
              justifyContent: 'flex-start',
            }}
            globalTextStyle={{
              fontFamily: 'Proxima-Nova-Alt-Regular',
            }}
            dropDownStyle={{
              backgroundColor: colors.card,
              ...styles.dropdownBorderStyle,
            }}
            onChangeItem={OnDropdownTimeIntervalChange}
            labelStyle={{...styles.LabelStyle, color: colors.text}}
            arrowColor={colors.text}
            renderSeperator={() => {
              return renderSeperator(colors);
            }}
          />

          <DropDownPicker
            placeholder="Sıralama Düzeni"
            items={sortItems}
            defaultValue={this.order}
            containerStyle={styles.dropdownContainerStyle}
            style={{
              backgroundColor: colors.card,
              ...styles.dropdownBorderStyle,
            }}
            itemStyle={{
              justifyContent: 'flex-start',
            }}
            globalTextStyle={{
              fontFamily: 'Proxima-Nova-Alt-Regular',
            }}
            dropDownStyle={{
              backgroundColor: colors.card,
              ...styles.dropdownBorderStyle,
            }}
            onChangeItem={(item) => (order.current = item.value)}
            labelStyle={{...styles.LabelStyle, color: colors.text}}
            arrowColor={colors.text}
            renderSeperator={() => {
              return renderSeperator(colors);
            }}
          />
        </View>

        {/* Filtrele button */}
        <TouchableOpacity
          style={{...styles.FiltreleButton, backgroundColor: colors.card}}
          onPress={FetchExternalData}>
          <Text style={{...styles.FiltreleButtonText, color: colors.text}}>
            Filtrele
          </Text>
        </TouchableOpacity>

        {!isFilterOnGoing ? (
          <ItemLists />
        ) : (
          <View style={{flex: 1}}>
            <BallIndicator color={colors.text} size={20} />
          </View>
        )}
      </View>
    </LinearBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 5,
    height: 300,
  },

  PickerMenus: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownContainerStyle: {
    height: 40,
    width: '45%',
  },
  dropdownBackgroundColorStyle: {
    backgroundColor: '#3a404d',
  },
  dropdownBorderStyle: {
    borderWidth: 0,
  },
  LabelStyle: {
    fontSize: 16,
    textAlign: 'left',
  },
  dropdownRuler: {
    //backgroundColor: 'white',
    height: 2,
  },
  FiltreleButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 5,
    marginBottom: 20,
  },
  FiltreleButtonText: {
    fontSize: 16,
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },

  InformationText: {
    fontSize: 18,
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
});
export default ListPage;
