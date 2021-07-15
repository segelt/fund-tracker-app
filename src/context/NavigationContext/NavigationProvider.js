import React, {useReducer, useRef} from 'react';

import NavigationContext, {initialState} from './NavigationStore';
import {reducer} from './NavigationReducer';

const NavigationProvider = ({children}) => {
  //const [state, dispatch] = useReducer(reducer, initialState);
  const thisRoute = useRef('');
  const shouldFetchPortfolioData = useRef(true);
  const portfolioFetchSuccess = useRef(true);
  const shouldFetchFundPage = useRef(true);
  const lastFundPageDisplayed = useRef('');

  const setThisRoute = (newRoute) => {
    thisRoute.current = newRoute;
  };

  const setShouldFetchPortfolioData = (newvalue) => {
    shouldFetchPortfolioData.current = newvalue;
  };

  const setPortfolioFetchSuccess = (newvalue) => {
    portfolioFetchSuccess.current = newvalue;
  };

  const setShouldFetchFundPage = (newvalue) => {
    shouldFetchFundPage.current = newvalue;
  };

  const setlastFundPageDisplayed = (newvalue) => {
    lastFundPageDisplayed.current = newvalue;
  };

  return (
    <NavigationContext.Provider
      value={{
        thisRoute,
        shouldFetchPortfolioData,
        shouldFetchFundPage,
        lastFundPageDisplayed,
        portfolioFetchSuccess,
        setThisRoute,
        setShouldFetchFundPage,
        setShouldFetchPortfolioData,
        setlastFundPageDisplayed,
        setPortfolioFetchSuccess,
      }}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;
