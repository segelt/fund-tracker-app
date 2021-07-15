import {createContext} from 'react';

export const initialState = {
  PieData: [],
  RightListingData: [],
  LeftListingData: [],
  FundPageHistoricalData: [],
  FundPageFundInfoData: [],
  FundPageFundRevenueData: [],
};

export default ApiContext = createContext(initialState);
