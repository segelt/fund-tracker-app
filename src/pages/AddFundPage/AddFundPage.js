import DateTimePicker from '@react-native-community/datetimepicker';
import {useHeaderHeight} from '@react-navigation/stack';
import axios from 'axios';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import fontakip, {CancelToken} from '../../api/fontakip';
import NavigationContext from '../../context/NavigationContext/NavigationStore';
import {Context} from '../../context/ThemeProvider';
import LinearBackground from '../../LinearBackground';
import {FormatDateInDDMMYYYY, isFloat, isInt} from '../../Utils';
import DBService from '../SettingsPage/DBService';
import FundModificationModal from './FundModificationModal';

const AddFundPage = ({navigation, route}) => {
  const [fundQuery, setFundQuery] = useState();
  const [isFundFetchedSuccess, setFundFetchSuccess] = useState(); //0 = none, 1 = success, 2 = fail
  const [fundName, setFundName] = useState();
  const [fundInfo, setFonInfo] = useState();
  const [unitPrice, setUnitPrice] = useState();
  const [amountBought, setAmountBought] = useState();
  const [isUnitPriceValid, setUnitPriceValid] = useState(false);
  const [isAmountBoughtValid, setAmountBoughtValid] = useState(false);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [modalVisible, setModalVisible] = useState();
  const modalMessage = useRef('');
  const ActionState = useRef(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShow(Platform.OS === 'ios');
  };

  var {params} = route;

  const {setShouldFetchPortfolioData} = useContext(NavigationContext);

  useEffect(() => {
    setFundName(params.fundCode ?? '');
    setFundQuery(params.fundCode ?? '');
    setFonInfo(params.fonAdi ?? '');

    setFundFetchSuccess(0);
    setUnitPrice('');
    setAmountBought('');
    setModalVisible(false);
  }, []);

  const {theme} = useContext(Context);
  const {colors} = theme;

  const headerHeight = useHeaderHeight();

  const FundModificationModalComponent = React.memo(
    () => (
      <FundModificationModal
        isVisible={modalVisible}
        setModalVisible={setModalVisible}
        Message={modalMessage.current}
        ActionState={ActionState.current}
      />
    ),
    [modalVisible, ActionState.current],
  );

  //Searches for the fund information from the api and retrieves the value (if there is any)
  const FundSearchButton = () => {
    if (isFundFetchedSuccess == 1) {
      return (
        <TouchableOpacity
          style={{
            ...styles.fundNameAraButton,
            backgroundColor: colors.positive,
          }}
          onPress={fetchFundButtonAction}>
          <Text
            style={{
              ...styles.searchFundButtonText,
              color: theme.dark ? '#000000' : '#ffffff',
            }}>
            ARA
          </Text>
        </TouchableOpacity>
      );
    } else if (isFundFetchedSuccess == 2) {
      return (
        <TouchableOpacity
          style={{
            ...styles.fundNameAraButton,
            backgroundColor: colors.negative,
          }}
          onPress={fetchFundButtonAction}>
          <Text
            style={{
              ...styles.searchFundButtonText,
              color: theme.dark ? '#000000' : '#ffffff',
            }}>
            ARA
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={{
            ...styles.fundNameAraButton,
            backgroundColor: colors.inactiveCard,
            borderColor: colors.border,
          }}
          onPress={fetchFundButtonAction}>
          <Text
            style={{
              ...styles.searchFundButtonText,
              color: colors.invertForeColor,
            }}>
            ARA
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const fetchFundButtonAction = async () => {
    let shouldContinueFetchingData = true;
    if (fundQuery && fundQuery.length != 0) {
      let shouldCancel = true;
      let params = {
        Kod: fundQuery,
      };
      const source = CancelToken.source();

      setTimeout(() => {
        if (shouldCancel) {
          setFundFetchSuccess(2);
          source.cancel('Timeout reached.');
        }
      }, 6000);

      await fontakip
        .post('/funds/v1', params, {
          cancelToken: source.token,
        })
        .then((response) => {
          shouldCancel = false;
          let isResponseEmpty = response.data.length == 0; //returning another response code would work better (400 or 403)

          if (isResponseEmpty) {
            shouldContinueFetchingData = false;
          } else {
            let _ResponseData = response.data;
            setFundName(_ResponseData.fonAdi);
            setFundQuery(_ResponseData.fonKodu);
            setFonInfo(_ResponseData.fonTuru);
          }
        })
        .catch(function (thrown) {
          // if (axios.isCancel(thrown)) {
          // } else {
          // }
        });
    }

    if (shouldContinueFetchingData) {
      setFundFetchSuccess(1);
    } else {
      setFundFetchSuccess(2);
    }
  };

  const fetchFundValueAction = async () => {
    let shouldContinueFetchingData = true;
    if (fundQuery && fundQuery.length != 0 && date) {
      let shouldCancel = true;
      const source = CancelToken.source();
      let params = {
        fundCode: fundQuery,
        Date: FormatDateInDDMMYYYY(date),
      };

      let responsePrice = -1;
      setTimeout(() => {
        if (shouldCancel) {
          source.cancel('Timeout reached.');
        }
      }, 6000);

      await fontakip
        .get('/historicdata/priceFromDate', {
          cancelToken: source.token,
          params: params,
        })
        .then((response) => {
          shouldCancel = false;
          responsePrice = response.data;
        })
        .catch(function (thrown) {
          shouldContinueFetchingData(false);
          // if (axios.isCancel(thrown)) {
          // } else {
          //Actual error
          // }
        });

      if (shouldContinueFetchingData && responsePrice != -1) {
        let responseInText = responsePrice.toString();
        setUnitPrice(responseInText);
        setUnitPriceValid(isFloat(responseInText));
      } else {
        setUnitPrice('-1');
        setUnitPriceValid(false);
      }
    }
  };

  const AddFundAsyncAction = async () => {
    if (isUnitPriceValid && isAmountBoughtValid) {
      var unitPriceBought = parseFloat(unitPrice);
      var fundAmountBought = parseInt(amountBought);
      var fundDateBought = FormatDateInDDMMYYYY(date);
      let insertMap = {
        fonKodu: fundQuery,
        tarih: fundDateBought,
        payFiyati: unitPriceBought,
        payMiktari: fundAmountBought,
      };

      try {
        //Querying for table
        const result = await DBService.checkIfValueExists(insertMap);

        //Querying for insert value
        if (result) {
          //update
          await DBService.updateValue(insertMap)
            .then((_UpdateResult) => {
              if (_UpdateResult == true) {
                setShouldFetchPortfolioData(true);
                ActionState.current = true;
                modalMessage.current = 'Ekleme işlemi başarılı gerçekleşti.';
                setModalVisible(true);
              }
            })
            .catch((err) => {
              ActionState.current = false;
              modalMessage.current = 'Ekleme işleminde hata oluştu.';
              setModalVisible(true);
            });
        } else {
          //add
          await DBService.insertValue(insertMap)
            .then((_InsertResult) => {
              if (_InsertResult == true) {
                setShouldFetchPortfolioData(true);
                ActionState.current = true;
                modalMessage.current = 'Ekleme işlemi başarılı gerçekleşti.';
                setModalVisible(true);
              }
            })
            .catch((err) => {
              ActionState.current = false;
              modalMessage.current = 'Ekleme işleminde hata oluştu.';
              setModalVisible(true);
            });
        }
      } catch (err) {
        //Catch error
      }
    } else {
      //An error occured
    }
  };

  //Render methods
  function FundCodeInputEvent(text) {
    setFundQuery(text);
  }

  function RevealDateModal() {
    setShow(true);
  }

  function UnitPriceInputEvent(text) {
    setUnitPriceValid(isFloat(text));
    setUnitPrice(text);
  }

  function AmountBoughtInputEvent(text) {
    setAmountBoughtValid(isInt(text));
    setAmountBought(text);
  }

  return (
    <LinearBackground>
      <View
        style={{
          ...styles.container,
          paddingTop: headerHeight,
          //backgroundColor: colors.background,
        }}>
        <FundModificationModalComponent />
        <Text style={{...styles.addFundText, color: colors.text}}>
          Eklenecek fon
        </Text>

        {/* Fund input area */}
        <View
          style={{...styles.FundNameArea, ...{borderBottomColor: colors.text}}}>
          <TextInput
            style={styles.fundNameInputStyle}
            placeholder="Aranacak Fon Kodu"
            onChangeText={FundCodeInputEvent}
            value={fundQuery}></TextInput>
          <FundSearchButton />
        </View>

        {/* Fund Code */}
        <View
          style={{
            ...styles.inputAreaStyle,
            ...{borderBottomColor: colors.text},
          }}>
          <Text style={{...styles.LeftColumnStyle, color: colors.text}}>
            Fon Kodu:
          </Text>
          <Text
            numberOfLines={2}
            style={{...styles.RightColumnStyle, color: colors.text}}>
            {fundName}
          </Text>
        </View>

        {/* Fund Name */}
        <View
          style={{
            ...styles.inputAreaStyle,
            ...{borderBottomColor: colors.text},
          }}>
          <Text style={{...styles.LeftColumnStyle, color: colors.text}}>
            Fon Adı:
          </Text>
          <Text style={{...styles.RightColumnStyle, color: colors.text}}>
            {fundInfo}
          </Text>
        </View>

        {/* Date Bought */}
        <View
          style={{
            ...styles.inputAreaStyle,
            ...{borderBottomColor: colors.text},
          }}>
          <Text
            style={{
              ...styles.LeftColumnStyle,
              color: colors.text,
            }}>
            Alış Tarihi:
          </Text>
          <View style={styles.RightColumnViewStyle}>
            <View style={styles.RightColumnTextViewStyle}>
              <Text
                style={{
                  ...styles.RightColumnTextStyle,
                  ...{color: colors.text},
                }}>
                {FormatDateInDDMMYYYY(date)}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                ...styles.fundNameAraButton,
                backgroundColor: colors.inactiveCard,
              }}
              onPress={RevealDateModal}>
              <Text
                style={{
                  ...styles.searchFundButtonText,
                  color: colors.invertForeColor,
                }}>
                TARİH BELİRLE
              </Text>
            </TouchableOpacity>
          </View>
          {show && (
            <DateTimePicker
              value={date}
              mode={'date'}
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        {/* Price bought */}
        <View
          style={{
            ...styles.inputAreaStyle,
            ...{borderBottomColor: colors.text},
          }}>
          <Text
            style={{
              ...styles.LeftColumnStyle,
              color: isUnitPriceValid ? colors.positive : colors.negative,
            }}>
            Alış Birim Pay Değeri:
          </Text>
          <View style={styles.RightColumnViewStyle}>
            <TextInput
              style={styles.RightColumnTextInputStyle}
              placeholder="Alış pay değeri"
              keyboardType="numeric"
              onChangeText={UnitPriceInputEvent}
              value={unitPrice}></TextInput>
            <TouchableOpacity
              style={{
                ...styles.fundNameAraButton,
                backgroundColor: colors.inactiveCard,
              }}
              onPress={fetchFundValueAction}>
              <Text
                style={{
                  ...styles.searchFundButtonText,
                  color: colors.invertForeColor,
                }}>
                TARİHTEN BUL
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Amount bought */}
        <View
          style={{
            ...styles.inputAreaStyle,
            ...{borderBottomColor: colors.text},
          }}>
          <Text
            style={{
              ...styles.LeftColumnStyle,
              color: isAmountBoughtValid ? colors.positive : colors.negative,
            }}>
            Alınan Pay Miktarı:
          </Text>
          <TextInput
            style={styles.RightColumnTextInputStyle}
            placeholder="Alınan Pay Miktarı"
            onChangeText={AmountBoughtInputEvent}
            value={amountBought}></TextInput>
        </View>

        {/* Add fund to my porfolio button */}
        <TouchableOpacity
          style={{
            ...styles.addFundButton,
            backgroundColor: colors.inactiveCard,
          }}
          onPress={AddFundAsyncAction}>
          <Text
            style={{
              ...styles.addFundButtonText,
              color: colors.invertForeColor,
            }}>
            PORTFOLYOMA EKLE
          </Text>
        </TouchableOpacity>
      </View>
    </LinearBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  addFundText: {
    fontFamily: 'Proxima-Nova-Alt-Regular',
    fontSize: 20,
    marginVertical: 15,
  },
  FundNameArea: {
    flexDirection: 'row',
    //marginTop: 15,
    paddingBottom: 20,
    borderBottomWidth: 0.8,
  },
  inputAreaStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.8,
    paddingVertical: 20,
  },
  fundNameInputStyle: {
    flex: 3,
    backgroundColor: 'white',
    borderRadius: 5,
    height: 36,
    alignSelf: 'center',
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  fundNameAraButton: {
    width: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchFundButtonText: {
    color: 'white',
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'Proxima-Nova-Alt-Regular', //todo: add bold implementation
  },
  LeftColumnStyle: {
    fontSize: 16,
    width: 80,
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  RightColumnStyle: {
    fontSize: 16,
    flex: 3,
    marginLeft: 20,
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  RightColumnTextInputStyle: {
    flex: 3,
    backgroundColor: 'white',
    height: 36,
    borderRadius: 5,
    marginLeft: 20,
    alignSelf: 'center',
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
  RightColumnViewStyle: {
    flexDirection: 'row',
    flex: 1,
  },
  RightColumnTextStyle: {},
  RightColumnTextViewStyle: {
    flex: 3,
    marginLeft: 20,
    height: 36,
    justifyContent: 'center',
  },
  addFundButton: {
    alignSelf: 'center',
    paddingHorizontal: 30,
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 10,
  },
  addFundButtonText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
});
export default AddFundPage;
