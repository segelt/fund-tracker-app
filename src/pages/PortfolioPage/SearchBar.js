import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Context} from '../../context/ThemeProvider';

function SearchBar({onPressEvent, onRefreshEvent}) {
  const {theme} = useContext(Context);
  const {colors} = theme;

  const _onSearchFocus = () => {
    onPressEvent();
  };

  const _onRefreshFocus = () => {
    onRefreshEvent();
  };

  const _onAddFundFocus = () => {
    navigation.navigate('AddFund', {
      fundCode: '',
      fonAdi: '',
    });
  };

  const navigation = useNavigation();

  return (
    <View style={styles.searchContainer}>
      <Text style={{...styles.Title, color: colors.text}}>Portfolyo</Text>
      <View style={styles.RightCornerStyle}>
        <TouchableHighlight
          activeOpacity={1}
          underlayColor={colors.transparent}
          onPress={_onAddFundFocus}
          style={{
            ...styles.search_icon_box,
            justifyContent: 'center',
          }}>
          <Icon
            name="add-sharp"
            size={30}
            color={colors.text}
            style={styles.searchIcon}
          />
        </TouchableHighlight>
        <TouchableHighlight
          activeOpacity={1}
          underlayColor={colors.transparent}
          onPress={_onRefreshFocus}
          style={{
            ...styles.search_icon_box,
            justifyContent: 'center',
          }}>
          <Icon name="refresh-sharp" size={28} color={colors.text} />
        </TouchableHighlight>
        <TouchableHighlight
          activeOpacity={1}
          underlayColor={colors.transparent}
          onPress={_onSearchFocus}
          style={{
            ...styles.search_icon_box,
            //backgroundColor: colors.card,
            justifyContent: 'center',
          }}>
          <Icon
            name="ios-search-outline"
            size={28}
            color={colors.text}
            style={styles.IconStyle}
          />
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Title: {
    fontFamily: 'Proxima-Nova-Alt-Regular',
    fontSize: 24,
    textAlign: 'center',
  },
  searchSection: {
    width: '90%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
    borderRadius: 16,
  },
  searchIcon: {
    padding: 8,
  },
  searchContainer: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  search_icon_box: {borderRadius: 40, marginHorizontal: 5},
  RightCornerStyle: {
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  IconStyle: {
    paddingHorizontal: 8,
    marginTop: 5,
  },
});

export default SearchBar;
