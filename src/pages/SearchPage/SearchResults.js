import axios from 'axios';
import React, {useContext, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {BallIndicator} from 'react-native-indicators';
import Icon from 'react-native-vector-icons/Ionicons';
import fontakip, {CancelToken} from '../../api/fontakip';
import NavigationContext from '../../context/NavigationContext/NavigationStore';
import {Context} from '../../context/ThemeProvider';
import LinearBackground from '../../LinearBackground';
import {StatusBarHeight} from '../../Utils';

const SearchResultBox = (props, onPressEvent, colors) => {
  var item = props.item;

  const _OnSearchPress = () => {
    onPressEvent(item.fonKodu);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        ...styles.SearchResultContainer,
        //backgroundColor: colors.background,
      }}
      onPress={_OnSearchPress}>
      <View style={styles.FonBilgiContainer}>
        <View style={styles.FonDetayContainer}>
          <Text style={{...styles.FundCodeName, color: colors.text}}>
            {item.fonKodu}
          </Text>
          <Text
            style={{...styles.FonTuruStyle, color: colors.text}}
            numberOfLines={1}>
            {item.fonTuru}
          </Text>
        </View>
        <Text
          style={{
            ...styles.FonAdiStyle,
            color: colors.text,
          }}
          numberOfLines={2}>
          {item.fonAdi}
        </Text>
      </View>
      <Icon
        style={{alignSelf: 'center'}}
        name="arrow-forward-outline"
        size={30}
        color={colors.text}
      />
    </TouchableOpacity>
  );
};

const SearchResults = (props) => {
  const [enteredText, setEnteredText] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataFetchSuccess, setDataFetchSuccess] = useState(true);
  const {theme} = useContext(Context);
  const {colors} = theme;
  const [SearchQueryResultData, setSearchQueryResultData] = useState([]);

  const {setShouldFetchFundPage} = useContext(NavigationContext);
  const {width, height} = Dimensions.get('window');

  //navigate to the screen with given fund code parameter
  const navigateToScreen = (searchStr) => {
    const {navigation} = props;
    setShouldFetchFundPage(true);
    navigation.navigate('Fund', {fundCode: searchStr});
  };

  const ResultList = () => {
    if (dataFetchSuccess) {
      return (
        <FlatList
          data={SearchQueryResultData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => {
            return SearchResultBox(item, navigateToScreen, colors);
          }}
          style={{...styles.ResultItemStyle, borderTopColor: colors.border}}
        />
      );
    } else {
      return <Text>Veriler yüklenemedi. Lütfen tekrar deneyiniz</Text>;
    }
  };

  const QueryFilter = async (searchString) => {
    setLoading(true);

    const source = CancelToken.source();
    let shouldCancel = true;

    setTimeout(() => {
      if (shouldCancel) {
        source.cancel('Timeout reached.');
      }
    }, 4000);
    await fontakip
      .get('/funds/v2', {
        cancelToken: source.token,
        params: {
          Kod: searchString,
        },
      })
      .then((response) => {
        setSearchQueryResultData(response.data);
        setDataFetchSuccess(true);
        shouldCancel = false;
      })
      .catch(function (thrown) {
        setDataFetchSuccess(false);
        // if (axios.isCancel(thrown)) {
        //   Request canceled -- thrown.message
        // } else {
        //   --an actual error
        // }
      });
    setLoading(false);
  };

  const QueryFilterWithoutAsync = (searchString) => {
    QueryFilter(searchString);
  };

  return (
    <LinearBackground>
      <View
        style={{
          ...styles.container,
          //backgroundColor: colors.background,
        }}>
        {/* The header */}
        <View style={{...styles.SearchHeaderArea, width: width}}>
          {/* Back button and search input area */}
          <View style={styles.SearchIputArea}>
            <TouchableHighlight
              activeOpacity={1}
              underlayColor="transparent"
              onPress={props.navigation.goBack}
              style={styles.search_icon_box}>
              <Icon
                name="arrow-back"
                size={24}
                color={colors.text}
                style={styles.searchIcon}
              />
            </TouchableHighlight>
            <TextInput
              style={{
                ...styles.input,
                backgroundColor: colors.card,
                color: colors.text,
              }}
              placeholder="Fon ara"
              placeholderTextColor={colors.text}
              onChangeText={(searchString) => {
                setEnteredText(searchString);
              }}
              onSubmitEditing={() => {
                QueryFilterWithoutAsync(enteredText);
              }}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        {/* Data, or loading animation */}
        {loading ? (
          <BallIndicator color={colors.text} size={20} />
        ) : (
          <ResultList />
        )}
      </View>
    </LinearBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchIcon: {},
  search_icon_box: {
    justifyContent: 'center',
    height: '100%',
    marginLeft: 14,
  },
  input: {
    flex: 1,
    borderRadius: 16,
    fontSize: 16,
    fontFamily: 'Proxima-Nova-Alt-Regular',
    marginHorizontal: 14,
    marginVertical: 2,
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
  SearchResultContainer: {
    width: '100%',
    height: 70,
    marginVertical: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomWidth: 0.2,
  },
  FundCodeName: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    fontFamily: 'Proxima-Nova-Alt-Regular',
    marginRight: 10,
  },
  FonAdiStyle: {
    fontSize: 14,
    textAlign: 'left',
    fontFamily: 'Proxima-Nova-Alt-Regular',
    flex: 1,
  },
  FonBilgiContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  FonDetayContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  FonTuruStyle: {
    fontSize: 16,
    textAlign: 'right',
    fontWeight: 'bold',
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  ResultItemStyle: {borderTopWidth: 1},
  SearchHeaderArea: {
    height: 60,
    paddingTop: StatusBarHeight,
    marginBottom: 10,
  },
  SearchIputArea: {flex: 1, flexDirection: 'row'},
});

export default SearchResults;
