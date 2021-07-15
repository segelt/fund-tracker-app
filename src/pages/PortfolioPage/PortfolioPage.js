import {useIsFocused} from '@react-navigation/native';
import React, {useContext, useEffect, useReducer, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BallIndicator} from 'react-native-indicators';
import Icon from 'react-native-vector-icons/MaterialIcons';
import fontakip, {CancelToken} from '../../api/fontakip';
import ApiContextProvider from '../../context/ApiContext/ApiContextStore';
import NavigationContext from '../../context/NavigationContext/NavigationStore';
import {Context} from '../../context/ThemeProvider';
import LinearBackground from '../../LinearBackground';
import {
  ExtractFundCodesAndSetValues,
  SplitGroups,
  StatusBarHeight,
} from '../../Utils';
import DBService from '../SettingsPage/DBService';
import PieChartListing from './PieChartListing';
import PortfolioSummarySelector from './PortfolioSummarySelector';
import SearchBar from './SearchBar';
import PortfolioSummaryListing from './SummaryLeftPanel/PortfolioSummaryListing';
import PortfolioSummaryRightListing from './SummaryRightPanel/PortfolioSummaryRightListing';

const visualHeight = 230;
const scrollCircleHeight = 10;

const PortfolioPage = (props) => {
  const {navigation} = props;
  const [_ForceRefresh, forceUpdate] = useReducer((x) => x + 1, 0);
  const {width, height} = Dimensions.get('window');

  const {theme} = useContext(Context);

  const [currentSummarySection, setcurrentSummarySection] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isDataEmpty, setDataEmpty] = useState(false);
  const [summarySectionLoaded, setSummarySectionLoaded] = useState(false);
  const [dataFetchSuccess, setDataFetchSuccess] = useState(true);
  const isFocused = useIsFocused();

  const {colors} = theme;

  const {
    thisRoute,
    shouldFetchPortfolioData,
    setShouldFetchPortfolioData,
    portfolioFetchSuccess,
    setShouldFetchFundPage,
    setPortfolioFetchSuccess,
  } = useContext(NavigationContext);

  const {
    PieData,
    RightListingData,
    LeftListingData,
    setPieData,
    setRightListingData,
    setLeftListingData,
  } = useContext(ApiContextProvider);

  //When this screen obtains focus, fetch data if data needs to be fetched
  useEffect(() => {
    if (portfolioFetchSuccess.current == false) {
      setDataFetchSuccess(false);
    }

    if (shouldFetchPortfolioData.current == true) {
      setDataLoaded(false);
      BackgroundFunction();
    } else {
      setDataLoaded(true);
    }
  }, [isFocused]);

  //Load the new data when summary is changed (gains vs historical data display)
  useEffect(() => {
    GetSummaryData();
  }, [currentSummarySection]);

  //Get Summary Data
  const GetSummaryData = async () => {
    setSummarySectionLoaded(true);
  };

  //Disable fetching portfolio data and fetch data
  const BackgroundFunction = async () => {
    setShouldFetchPortfolioData(false); //placing this at the end causes double execution

    await DBService.getRowCount().then(async (rowCount) => {
      if (rowCount == 0) {
        setDataLoaded(true);
        setDataEmpty(true);
      } else {
        //Perform the db query, fetch data
        await DBService.getFundAsCollection()
          .then(async (resultSet) => {
            var splittedGroups = SplitGroups(resultSet); //{"NNF": {"16-05-2021": [1.03, 2000]}}
            var extractedIntervals = ExtractFundCodesAndSetValues(resultSet, 3); //{"NNF": 3}

            let shouldCancel = true;
            let shouldContinueFetchingData = true;
            let _PieData = [];
            let _LeftListingGraph = [];
            let _RightListingGraph = [];

            const source = CancelToken.source();

            setTimeout(() => {
              if (shouldCancel) {
                source.cancel('Timeout reached.');
              }
            }, 2000);

            //piechartdata
            await fontakip
              .post('/historicdata/batch/portfolio', splittedGroups, {
                cancelToken: source.token,
              })
              .then((response) => {
                _PieData = response.data;
              })
              .catch(function (thrown) {
                setDataFetchSuccess(false);
                setPortfolioFetchSuccess(false);
                shouldContinueFetchingData = false;
                // if (axios.isCancel(thrown)) {
                //   Timeout
                // } else {
                //   An actual error.
                //   console.log(thrown)
                // }
              });

            if (shouldContinueFetchingData) {
              await fontakip
                .post('/historicdata/batch/gains', splittedGroups, {
                  cancelToken: source.token,
                })
                .then((response) => {
                  _LeftListingGraph = response.data;
                })
                .catch(function (thrown) {
                  setDataFetchSuccess(false);
                  setPortfolioFetchSuccess(false);
                  shouldContinueFetchingData = false;
                  // if (axios.isCancel(thrown)) {
                  //   Timeout
                  // } else {
                  //   An actual error
                  // }
                });
            }

            if (shouldContinueFetchingData) {
              await fontakip
                .post('/historicdata/batch/v1', extractedIntervals, {
                  cancelToken: source.token,
                })
                .then((response) => {
                  _RightListingGraph = response.data;
                  shouldCancel = false;
                })
                .catch(function (thrown) {
                  setDataFetchSuccess(false);
                  setPortfolioFetchSuccess(false);
                  shouldContinueFetchingData = false;
                  // if (axios.isCancel(thrown)) {
                  //   Timeout
                  // } else {
                  //   An actual error
                  // }
                });
            }

            if (shouldContinueFetchingData) {
              setPieData(_PieData);
              setLeftListingData(_LeftListingGraph);
              setRightListingData(_RightListingGraph);
              setPortfolioFetchSuccess(true);
              setDataFetchSuccess(true);
            }
            // else {
            //   //manage errors here
            // }
            setDataLoaded(true);
            setDataEmpty(false);
            //Get the data
          })
          .catch((err) => {
            //console.log(err);
            setDataLoaded(false);
          });
      }
    });
  };

  const onSearchPressHandler = () => {
    const {navigation} = props;
    navigation.navigate('SearchResults');
  };

  const onAddFundButtonPressHandler = () => {
    navigation.navigate('AddFund', {
      fundCode: '',
      fonAdi: '',
    });
  };

  const onComparePagePressHandler = () => {
    navigation.navigate('Compare');
  };

  const onRefreshHandler = () => {
    setShouldFetchPortfolioData(true);
    forceUpdate(_ForceRefresh + 1); //No clean way of doing this
  };

  //When the user presses refresh button, refresh the contents of the screen (call the external api)
  useEffect(() => {
    if (shouldFetchPortfolioData.current == true) {
      setDataLoaded(false);
      BackgroundFunction();
    }
  }, [_ForceRefresh]);

  //If summary area is not loaded, display loading animation.
  //If it is loaded, display gains/losses or historical data depending on user choice
  const PortfolioArea = () => {
    if (!summarySectionLoaded) {
      return <BallIndicator color={colors.text} size={20} />;
    }
    if (currentSummarySection == 0) {
      return (
        <PortfolioSummaryListing
          data={LeftListingData.current}
          refreshCallback={onRefreshHandler}
        />
      );
    } else {
      return <PortfolioSummaryRightListing data={RightListingData.current} />;
    }
  };

  const MainView = () => {
    if (dataFetchSuccess) {
      if (!isDataEmpty) {
        return (
          <View style={{flex: 1}}>
            {/* Portfolio visualized container */}
            <View style={styles.graphsContainer}>
              <PieChartListing
                width={width}
                height={visualHeight}
                data={PieData.current}
              />
            </View>

            {/* Bottom area that contains gains losses by two different groups */}
            <View style={{flex: 1}}>
              {/* Selection area */}
              <View style={styles.PortfolioSummaryContainer}>
                <PortfolioSummarySelector
                  text="Fon Getirileri"
                  isSelected={currentSummarySection == 0}
                  onPress={() => {
                    setSummarySectionLoaded(false);
                    setcurrentSummarySection(0);
                  }}
                />
                <PortfolioSummarySelector
                  text="Grafik (Son 1 Yıl)"
                  isSelected={currentSummarySection == 1}
                  onPress={() => {
                    setSummarySectionLoaded(false); //this state is set at event listener
                    setcurrentSummarySection(1);
                  }}
                />
              </View>

              {/* Lists are displayed here. Either 1st (gains etc) or 2nd (graphs etc) */}
              {summarySectionLoaded ? (
                <PortfolioArea />
              ) : (
                <BallIndicator color={colors.text} size={20} />
              )}
            </View>
          </View>
        );
      } else {
        return (
          <View style={styles.NoDataDisplay}>
            <Text style={{...styles.NoDataText, color: colors.text}}>
              Portfolyonuzda fon bulunmamaktadır
            </Text>
            <TouchableOpacity
              style={{
                ...styles.addFundButton,
                backgroundColor: colors.inactiveCard,
              }}
              zIndex={1}
              elevation={1}
              onPress={onAddFundButtonPressHandler}>
              <Text
                style={{...styles.addFundText, color: colors.invertForeColor}}>
                Fon Ekle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.addFundButton,
                backgroundColor: colors.inactiveCard,
              }}
              zIndex={1}
              elevation={1}
              onPress={onComparePagePressHandler}>
              <Text
                style={{...styles.addFundText, color: colors.invertForeColor}}>
                Fonları İncele
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    } else {
      return (
        <View style={styles.PortfolioErrorContainer}>
          <Icon name="report-problem" size={100} color={colors.negative} />
          <Text
            style={{
              color: colors.text,
              ...styles.PortfolioErrorText,
            }}>
            Bağlantıda bir sorun yaşandı. Lütfen bağlantınızı kontrol edip
            tekrar deneyiniz. Problem devam ederse, ayarlarım menüsünden
            uygulamayı sıfırlayınız.
          </Text>
        </View>
      );
    }
  };

  if (dataLoaded) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}
        forceInset={{top: 'always'}}>
        <LinearBackground>
          <View style={{width: width, height: StatusBarHeight}}></View>
          {/* Search bar */}
          <SearchBar
            onPressEvent={onSearchPressHandler}
            onRefreshEvent={onRefreshHandler}
          />
          <MainView />
        </LinearBackground>
      </SafeAreaView>
    );
  } else {
    return (
      <View style={{flex: 1, backgroundColor: colors.background}}>
        <BallIndicator color={colors.text} size={20} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  SearchBarContainer: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  graphsContainer: {
    height: visualHeight,
  },
  picture: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  scrollIndicatorContainer: {
    //the dots under portfolio page
    width: '100%',
    height: 19,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  CircleHighlight: {
    width: scrollCircleHeight + 4,
    height: scrollCircleHeight + 4,
    borderRadius: (scrollCircleHeight + 4) / 2,
    backgroundColor: '#dbd7ce',
    borderWidth: 0.7,
    marginHorizontal: 4,
  },
  Circle: {
    width: scrollCircleHeight,
    height: scrollCircleHeight,
    borderRadius: scrollCircleHeight / 2,
    backgroundColor: '#363533',
    borderWidth: 0.7,
    marginHorizontal: 4,
  },
  PortfolioSummaryContainer: {
    width: '100%',
    justifyContent: 'center',
    height: 50,
    flexDirection: 'row',
  },
  NoDataDisplay: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  NoDataText: {
    fontSize: 18,
    marginTop: 30,
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  addFundButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 10,
    elevation: 4,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFundText: {
    fontSize: 18,
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  PortfolioErrorContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  PortfolioErrorText: {
    fontSize: 18,
    fontFamily: 'Proxima-Nova-Alt-Regular',
    marginTop: 30,
    textAlign: 'center',
  },
});

export default PortfolioPage;
