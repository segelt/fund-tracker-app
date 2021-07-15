import {useIsFocused} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';
import axios from 'axios';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {BallIndicator} from 'react-native-indicators';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {snapPoint} from 'react-native-redash';
import fontakip, {CancelToken} from '../../api/fontakip';
import ApiContext from '../../context/ApiContext/ApiContextStore';
import NavigationContext from '../../context/NavigationContext/NavigationStore';
import {Context} from '../../context/ThemeProvider';
import LinearBackground from '../../LinearBackground';
import {SplitGroups} from '../../Utils';
import DBService from '../SettingsPage/DBService';
import FundGraph from './FundGraph';
import IntervalSelectorButton from './IntervalSelectorButton';
import SingleFundSummaryArea from './SingleFundSummaryArea';

const FundPage = ({navigation, route}) => {
  const {height} = Dimensions.get('window');
  const {fundCode} = route.params;
  const headerHeight = useHeaderHeight();
  const snapPoints = [-440, -220, 0];

  const isFocused = useIsFocused();
  const translateY = useSharedValue(0);

  const {theme} = useContext(Context);
  const {colors} = theme;
  const {shouldFetchFundPage, setShouldFetchFundPage} = useContext(
    NavigationContext,
  );

  const {
    FundPageHistoricalData,
    FundPageFundInfoData,
    FundPageFundRevenueData,
    setFundPageHistoricalData,
    setFundPageFundInfoData,
    setFundPageFundRevenueData,
  } = useContext(ApiContext);

  const [selectedIntervalIndex, setSelectedIntervalIndex] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [summaryLoaded, setSummaryLoaded] = useState(false);

  //Used to determine if the user has any mutual funds
  const [isThereRevenue, setIsRevenue] = useState(false);

  const [graphLoaded, setGraphLoaded] = useState(false);
  let graphWidth = useRef(0);
  let graphHeight = useRef(0);

  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
  const graphValue = useSharedValue(-1);
  const firstDataPoint = useSharedValue(-1);
  const DataLength = useSharedValue(-1);
  const updateGraphValue = (val) => {
    'worklet';
    graphValue.value = val;
  };

  const gainRatio = useDerivedValue(() => {
    //FundPageHistoricalData.current.length;
    if (typeof graphValue.value === 'undefined' || DataLength.value == 0) {
      return 0;
    } else {
      return (
        (graphValue.value.payDegeri * 100) / firstDataPoint.value.payDegeri -
        100
      );
    }
  }, [graphValue]);

  const animatedTextFundValueProps = useAnimatedProps(() => {
    if (typeof graphValue.value.payDegeri === 'undefined') {
      return {text: `-1`};
    } else {
      return {
        text: `${graphValue.value.payDegeri.toFixed(5)}`,
      };
    }
  });

  //There are issues with using the same animated style (animatedTextGainStyles) for multiple components, so a duplicate of textgainstyles is used
  const animatedTextFundValueStyles = useAnimatedStyle(() => {
    if (typeof gainRatio.value === 'undefined') {
      return {color: colors.text};
    } else {
      return {
        color: gainRatio.value > 0 ? colors.positive : colors.negative,
      };
    }
  });

  const animatedTextFundDateProps = useAnimatedProps(() => {
    if (typeof graphValue.value.tarih === 'undefined') {
      return {text: `-1`};
    } else {
      return {
        text: `${graphValue.value.tarih}`,
      };
    }
  });

  const animatedTextGainProps = useAnimatedProps(() => {
    if (typeof gainRatio.value === 'undefined') {
      return {text: `-1%`};
    } else {
      return {
        text: `${gainRatio.value.toFixed(3)} %`,
      };
    }
  });
  const animatedTextGainStyles = useAnimatedStyle(() => {
    if (typeof gainRatio.value === 'undefined') {
      return {color: colors.text};
    } else {
      return {
        color: gainRatio.value > 0 ? colors.positive : colors.negative,
      };
    }
  });

  function NavigateToAddFundPage() {
    navigation.navigate('AddFund', {
      fundCode: FundPageFundInfoData.current.fonKodu,
      fonAdi: FundPageFundInfoData.current.fonAdi,
    });
  }

  const BottomArea = () => {
    //Display either add fund or fund revenue controls
    if (isThereRevenue) {
      return (
        /* Fund Summary container */
        <Animated.View
          style={[
            styles.FundSummary,
            {backgroundColor: colors.inactiveCard}, //todo: switch to colors.card
            SummaryContainerDragger,
          ]}
          zIndex={1000}
          elevation={1000}>
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View
              style={{width: '100%', alignItems: 'center', elevation: 4}}>
              <Text
                style={{
                  ...styles.FonGetirileri,
                  color: colors.invertForeColor,
                }}>
                Fon Getirileri
              </Text>
            </Animated.View>
          </PanGestureHandler>
          <ScrollView
            style={styles.fundGainList}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}>
            {FundPageFundRevenueData.current.distinct.map((item, index) => {
              return (
                <SingleFundSummaryArea
                  data={item}
                  index={index}
                  key={index.toString()}
                />
              );
            })}
          </ScrollView>
        </Animated.View>
      );
    } else {
      return (
        // Add fund button
        <TouchableOpacity
          style={{
            ...styles.addFundButton,
            backgroundColor: colors.inactiveCard,
          }}
          zIndex={1}
          elevation={1}
          onPress={NavigateToAddFundPage}>
          <Text style={{...styles.addFundText, color: colors.invertForeColor}}>
            Bu Fonu Ekle
          </Text>
        </TouchableOpacity>
      );
    }
  };

  //When this page gets focus, fetch fund information if its a new page
  useEffect(() => {
    if (shouldFetchFundPage.current == true) {
      setSummaryLoaded(false);
      setIsRevenue(false);
      FetchSummary();
    } else {
      setSummaryLoaded(true);
      setDataLoaded(true);
    }
  }, [isFocused]);

  //Whenever a new time interval is selected update the fund data
  useEffect(() => {
    setDataLoaded(false);
    GetGraphData();
  }, [selectedIntervalIndex]);

  //Get historical data for currently selected time interval
  const GetGraphData = async () => {
    let shouldCancel = true;
    let shouldContinueFetchingData = true;

    let params = {};
    params[fundCode] = selectedIntervalIndex;
    const source = CancelToken.source();

    setTimeout(() => {
      if (shouldCancel) {
        source.cancel('Timeout reached.');
      }
    }, 6000);

    await fontakip
      .post('/historicdata/single/v1', params, {
        cancelToken: source.token,
      })
      .then((response) => {
        shouldCancel = false;
        let _ResponseData = response.data;

        //If the data is corrupt, do not display information
        if (_ResponseData === 'undefined' || _ResponseData.length == 0) {
          firstDataPoint.value = -1;
          DataLength.value = 0;
        } else {
          firstDataPoint.value = _ResponseData[0];
          DataLength.value = _ResponseData.length;
        }

        setFundPageHistoricalData(response.data);
        //FundPageHistoricalData.current.length
      })
      .catch(function (thrown) {
        shouldContinueFetchingData = false;
        // if (axios.isCancel(thrown)) {
        //   Request was cancelled
        // } else {
        //   an actual error occured
        // }
      });

    setDataLoaded(shouldContinueFetchingData);
  };

  //Fetch summary of user's portfolio for this fund, if the user has any shares of this fund
  const FetchSummary = async () => {
    let shouldCancel = true;
    let shouldContinueFetchingData = true;
    const source = CancelToken.source();
    setTimeout(() => {
      if (shouldCancel) {
        source.cancel('Timeout reached.');
      }
    }, 6000);

    await DBService.getFundAsCollection().then(async (resultSet) => {
      let thisFund = resultSet.filter((fx) => fx.fundCode === fundCode);
      let doesThisUserOwnThisFund = thisFund.length != 0;

      if (doesThisUserOwnThisFund) {
        var _GroupsInValidFormat = SplitGroups(resultSet); //{"NNF": {"16-05-2021": [1.03, 2000]}}

        await fontakip
          .post('/historicdata/batch/gains', _GroupsInValidFormat, {
            cancelToken: source.token,
          })
          .then((response) => {
            let ServerResponse = response.data;

            if (fundCode in ServerResponse) {
              setFundPageFundRevenueData(ServerResponse[fundCode]);
            } else {
              shouldContinueFetchingData = false;
            }
          })
          .catch(function (thrown) {
            shouldContinueFetchingData = false;
            // if (axios.isCancel(thrown)) {
            // Request cancelled
            // } else {
            // an actual error
            // }
          });

        if (shouldContinueFetchingData) {
          setIsRevenue(true);
        }
      }
    });

    if (shouldContinueFetchingData) {
      let params = {Kod: fundCode};
      await fontakip
        .post('/funds/v1', params, {
          cancelToken: source.token,
        })
        .then((response) => {
          shouldCancel = false;
          setFundPageFundInfoData(response.data);
        })
        .catch(function (thrown) {
          shouldContinueFetchingData = false;
          // if (axios.isCancel(thrown)) {
          // Request cancelled
          // } else {
          // an actual error
          // }
        });
    }

    setShouldFetchFundPage(false);
    setSummaryLoaded(true);
  };

  //Animated value for dragging the summary information
  const SummaryContainerDragger = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.offSetY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = Math.min(
        Math.max(event.translationY + ctx.offSetY, snapPoints[0]),
        snapPoints[2],
      );
    },
    onEnd: (event, ctx) => {
      try {
        translateY.value = withTiming(
          snapPoint(translateY.value, event.velocityY, snapPoints),
          {duration: 150},
        );
      } catch (err) {
        //console.log(err);
      }
    },
  });

  //Storing necessary width and height values to graph component, during initial layout.
  function OnGraphLayoutEvent(event) {
    const {width, height} = event.nativeEvent.layout;
    graphWidth.current = width;
    graphHeight.current = height;
    setGraphLoaded(true); //Graph is only rendered when this information is stored in a ref hook.
  }

  return (
    <LinearBackground>
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            ...styles.container,
            marginTop: headerHeight,
          }}>
          <Text
            numberOfLines={3}
            style={{...styles.FundInfo, color: colors.text, height: 50}}>
            {FundPageFundInfoData.current.fonAdi}
          </Text>

          {dataLoaded ? (
            /* Graph container */
            <View style={styles.GraphContainer}>
              {/* Graph header */}
              <View style={styles.GraphHeader}>
                {/* //Horizontal ruler */}
                <View style={styles.returnRuler} />
              </View>

              {/* Interval selector */}
              <View style={styles.IntervalSelector}>
                <IntervalSelectorButton
                  text={'1W'}
                  onPress={() => {
                    setSelectedIntervalIndex(0);
                  }}
                  currentIndex={selectedIntervalIndex}
                  value={0}
                />
                <IntervalSelectorButton
                  text={'1M'}
                  onPress={() => {
                    setSelectedIntervalIndex(1);
                  }}
                  currentIndex={selectedIntervalIndex}
                  value={1}
                />
                <IntervalSelectorButton
                  text={'3M'}
                  onPress={() => {
                    setSelectedIntervalIndex(2);
                  }}
                  currentIndex={selectedIntervalIndex}
                  value={2}
                />
                <IntervalSelectorButton
                  text={'1Y'}
                  onPress={() => {
                    setSelectedIntervalIndex(3);
                  }}
                  currentIndex={selectedIntervalIndex}
                  value={3}
                />
                <IntervalSelectorButton
                  text={'3Y'}
                  onPress={() => {
                    setSelectedIntervalIndex(4);
                  }}
                  currentIndex={selectedIntervalIndex}
                  value={4}
                />
              </View>

              {/* Actual graph */}
              <View
                style={styles.GraphContainerStyle}
                onLayout={OnGraphLayoutEvent}>
                {graphLoaded && FundPageHistoricalData.current.length > 0 && (
                  <FundGraph
                    data={FundPageHistoricalData.current}
                    width={graphWidth.current}
                    height={graphHeight.current}
                    updateParentVal={updateGraphValue}
                  />
                )}
              </View>
            </View>
          ) : (
            //If data is not loaded, display loading animation
            <View style={styles.GraphContainer}>
              <BallIndicator color={colors.text} size={20} />
            </View>
          )}
          <View style={styles.GainRatioDisplaysContainer}>
            {/* Gain Ratio Displays */}
            <View style={styles.GainRatioDisplays}>
              <View style={styles.ReturnInfoTextArea}>
                <Text style={{...styles.GainRatioTexts, color: colors.text}}>
                  Fon Değeri:
                </Text>
                <AnimatedTextInput
                  underlineColorAndroid="transparent"
                  editable={false}
                  animatedProps={animatedTextFundValueProps}
                  style={[
                    {
                      ...styles.textInputStyle,
                    },
                    animatedTextFundValueStyles,
                  ]}></AnimatedTextInput>
              </View>

              <View style={styles.ReturnInfoTextArea}>
                <Text style={{...styles.GainRatioTexts, color: colors.text}}>
                  Tarih:
                </Text>
                <AnimatedTextInput
                  underlineColorAndroid="transparent"
                  editable={false}
                  animatedProps={animatedTextFundDateProps}
                  style={{
                    ...styles.textInputStyle,
                    color: colors.text,
                  }}></AnimatedTextInput>
              </View>

              <View style={styles.ReturnInfoTextArea}>
                <Text style={{...styles.GainRatioTexts, color: colors.text}}>
                  Getirisi:
                </Text>
                <AnimatedTextInput
                  underlineColorAndroid="transparent"
                  editable={false}
                  animatedProps={animatedTextGainProps}
                  style={[
                    {
                      ...styles.textInputStyle,
                    },
                    animatedTextGainStyles,
                  ]}></AnimatedTextInput>
              </View>
            </View>
          </View>

          {summaryLoaded ? (
            <BottomArea />
          ) : (
            <View style={styles.GraphContainer}>
              <BallIndicator color={colors.text} size={20} />
            </View>
          )}
        </View>
      </View>
    </LinearBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  FundInfo: {
    fontSize: 18,
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  GraphHeader: {
    flexDirection: 'column',
    width: '95%',
    alignSelf: 'center',
    //backgroundColor: 'red',
  },
  ReturnInfo: {
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent: 'space-around',
  },
  ReturnInfoTextArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  returnRuler: {
    borderBottomWidth: 0.8,
    borderBottomColor: '#7a7977',
    height: 4,
    width: '100%',
  },
  GraphContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
    height: 250,
  },
  IntervalSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '95%',
    alignSelf: 'center', //todo remove this and make parent container align center
    marginTop: 10,
  },
  FundSummary: {
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 15,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    position: 'absolute',
    top: 530,
    left: 0,
    right: 0,
  },
  FonGetirileri: {
    fontSize: 20,
    fontFamily: 'Proxima-Nova-Alt-Regular',
    marginBottom: 5,
  },
  fundGainList: {
    height: 500,
    width: '100%',
  },
  textInputStyle: {
    fontSize: 16,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'center',
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  GainRatioTexts: {
    marginRight: 20,
    fontSize: 16,
    fontFamily: 'Proxima-Nova-Alt-Regular',
    width: 100,
    textAlign: 'right',
  },

  addFundButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 40,
    elevation: 4,
  },
  addFundText: {
    fontSize: 22,
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },

  GraphContainerStyle: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  GainRatioDisplaysContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  GainRatioDisplays: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default FundPage;
