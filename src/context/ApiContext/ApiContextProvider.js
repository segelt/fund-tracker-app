import React, {useReducer, useRef} from 'react';

import ApiContext, {initialState} from './ApiContextStore';

const ApiContextProvider = ({children}) => {
  //const [state, dispatch] = useReducer(reducer, initialState);
  const PieData = useRef([]);
  const RightListingData = useRef([]);
  const LeftListingData = useRef([]);
  const FundPageHistoricalData = useRef([]);
  const FundPageFundInfoData = useRef([]);
  const FundPageFundRevenueData = useRef([]);

  const setPieData = (_PieData) => {
    PieData.current = _PieData;
  };

  const setRightListingData = (_RightListingData) => {
    RightListingData.current = _RightListingData;
  };

  const setLeftListingData = (_LeftListingData) => {
    LeftListingData.current = _LeftListingData;
  };

  const setFundPageHistoricalData = (_FundPageHistoricalData) => {
    FundPageHistoricalData.current = _FundPageHistoricalData;
  };

  const setFundPageFundInfoData = (_FundPageFundInfoData) => {
    FundPageFundInfoData.current = _FundPageFundInfoData;
  };

  const setFundPageFundRevenueData = (_FundPageFundRevenueData) => {
    FundPageFundRevenueData.current = _FundPageFundRevenueData;
  };

  return (
    <ApiContext.Provider
      value={{
        PieData,
        RightListingData,
        LeftListingData,
        FundPageHistoricalData,
        FundPageFundInfoData,
        FundPageFundRevenueData,
        setPieData,
        setRightListingData,
        setLeftListingData,
        setFundPageHistoricalData,
        setFundPageFundInfoData,
        setFundPageFundRevenueData,
      }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContextProvider;
