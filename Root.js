import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CommonActions, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useContext, useRef, useState} from 'react';
import {StatusBar, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationContext from './src/context/NavigationContext/NavigationStore';
import {Context} from './src/context/ThemeProvider';
import AddFundPage from './src/pages/AddFundPage/AddFundPage';
import FundPage from './src/pages/FundPage/FundPage';
import ListPage from './src/pages/ListPage/ListPage';
import PortfolioPage from './src/pages/PortfolioPage/PortfolioPage';
import SearchResults from './src/pages/SearchPage/SearchResults';
import SettingsPage from './src/pages/SettingsPage/SettingsPage';

const BottomTab = createBottomTabNavigator();

const Root = () => {
  const {theme} = useContext(Context);
  const {thisRoute, setThisRoute} = useContext(NavigationContext);
  const {colors} = theme;

  const PortfolioStack = createStackNavigator();
  function PortfolioStackScreen() {
    return (
      <PortfolioStack.Navigator initialRouteName="PortfolioPage">
        <PortfolioStack.Screen
          name="PortfolioPage"
          component={PortfolioPage}
          options={{
            headerShown: false,
          }}
        />
        <PortfolioStack.Screen
          name="SearchResults"
          component={SearchResults}
          options={({navigation}) => ({
            headerShown: false,
          })}
        />

        <PortfolioStack.Screen
          name="Fund"
          component={FundPage}
          options={({navigation}) => ({
            headerTitleStyle: {
              ...RootStyles.headerTitleCommonStyle,
              color: colors.text,
            },
            headerTransparent: true,
            headerStyle: {
              backgroundColor: 'transparent',
            },
            title: 'Fon Bilgileri',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(resetPortfolioStackAction)}
                style={{marginRight: 20}}>
                <Icon
                  name="md-home"
                  size={25}
                  color={theme.dark ? '#eefbfb' : 'rgb(28, 28, 30)'}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              height: 60,
            },
            headerTintColor: theme.dark ? '#eefbfb' : 'rgb(28, 28, 30)',
          })}
        />

        <PortfolioStack.Screen
          name="AddFund"
          component={AddFundPage}
          options={({navigation}) => ({
            headerTitleStyle: {
              ...RootStyles.headerTitleCommonStyle,
              color: colors.text,
            },
            headerTransparent: true,
            headerStyle: {
              backgroundColor: 'transparent',
            },
            title: 'Fon Ekleme Sayfası',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(resetPortfolioStackAction)}
                style={{marginRight: 20}}>
                <Icon
                  name="md-home"
                  size={25}
                  color={theme.dark ? '#eefbfb' : 'rgb(28, 28, 30)'}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              height: 60,
            },
            headerTintColor: theme.dark ? '#eefbfb' : 'rgb(28, 28, 30)',
          })}
        />
      </PortfolioStack.Navigator>
    );
  }

  const CompareStack = createStackNavigator();
  function CompareStackScreen() {
    return (
      <CompareStack.Navigator initialRouteName="ComparePage">
        <CompareStack.Screen
          name="ComparePage"
          component={ListPage}
          options={({navigation}) => ({
            headerTitleStyle: {
              ...RootStyles.headerTitleCommonStyle,
              color: colors.text,
            },
            headerTransparent: true,
            title: 'Sıralama Sayfası',
            headerStyle: {
              height: 60,
            },
            headerTintColor: theme.dark ? '#eefbfb' : 'rgb(28, 28, 30)',
          })}
        />
        <CompareStack.Screen
          name="SearchResults"
          component={SearchResults}
          options={({navigation}) => ({
            headerTitleStyle: {
              ...RootStyles.headerTitleCommonStyle,
              color: colors.text,
            },
            headerTransparent: true,
            title: 'Arama Sonuçları',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(resetPortfolioStackAction)}
                style={{marginRight: 20}}>
                <Icon
                  name="md-home"
                  size={25}
                  color={theme.dark ? '#eefbfb' : 'rgb(28, 28, 30)'}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              height: 60,
            },
            headerTintColor: theme.dark ? '#eefbfb' : 'rgb(28, 28, 30)',
          })}
        />

        <CompareStack.Screen
          name="Fund"
          component={FundPage}
          options={({navigation}) => ({
            headerTitleStyle: {
              ...RootStyles.headerTitleCommonStyle,
              color: colors.text,
            },
            headerTransparent: true,
            headerStyle: {
              backgroundColor: 'transparent',
            },
            title: 'Fon Bilgileri',
            headerRight: () => (
              <Icon
                name="md-home"
                size={25}
                style={{marginRight: 20}}
                color={theme.dark ? '#eefbfb' : 'rgb(28, 28, 30)'}
              />
            ),
            headerStyle: {
              height: 60,
            },
            headerTintColor: theme.dark ? '#eefbfb' : 'rgb(28, 28, 30)',
          })}
        />

        <CompareStack.Screen
          name="AddFund"
          component={AddFundPage}
          options={({navigation}) => ({
            headerTitleStyle: {
              ...RootStyles.headerTitleCommonStyle,
              color: colors.text,
            },
            headerTransparent: true,
            headerStyle: {
              backgroundColor: 'transparent',
              color: colors.text,
            },
            title: 'Fon Ekleme Sayfası',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(resetPortfolioStackAction)}
                style={{marginRight: 20}}>
                <Icon
                  name="md-home"
                  size={25}
                  color={theme.dark ? '#eefbfb' : 'rgb(28, 28, 30)'}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              height: 60,
            },
            headerTintColor: theme.dark ? '#eefbfb' : 'rgb(28, 28, 30)',
          })}
        />
      </CompareStack.Navigator>
    );
  }

  const SettingsStack = createStackNavigator();
  function SettingsStackScreen() {
    return (
      <SettingsStack.Navigator initialRouteName="SettingsPage">
        <SettingsStack.Screen
          name="SettingsPage"
          component={SettingsPage}
          options={({navigation}) => ({
            headerTitleStyle: {
              ...RootStyles.headerTitleCommonStyle,
              color: colors.text,
            },
            headerTransparent: true,
            title: 'Ayarlarım',
            headerStyle: {
              height: 60,
            },
          })}
        />
      </SettingsStack.Navigator>
    );
  }

  const resetPortfolioStackAction = CommonActions.reset({
    index: 0,
    routes: [{name: 'PortfolioPage'}],
  });

  const resetCompareStackAction = CommonActions.reset({
    index: 0,
    routes: [{name: 'ComparePage'}],
  });

  const navigationRef = useRef();
  const routeNameRef = useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        setThisRoute(routeNameRef.current); //set the current route information on context
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          //log previous route name, current route name
          setThisRoute(currentRouteName);
        }

        // Save the current route name for next comparison
        routeNameRef.current = currentRouteName;
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={!theme.dark ? 'dark-content' : 'light-content'}
      />
      <BottomTab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Portfolyo') {
              iconName = focused ? 'list-circle-outline' : 'list-circle-sharp';
            } else if (route.name === 'Sıralama') {
              iconName = focused ? 'analytics-outline' : 'analytics-outline';
            } else if (route.name === 'Ayarlar') {
              iconName = focused ? 'settings-outline' : 'settings';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: theme.dark ? '#63c1ff' : '#035B95',
          inactiveTintColor: theme.dark ? '#ededed' : '#1E1E1E',
          tabStyle: {
            backgroundColor: !theme.dark ? '#ffffff' : '#211f1f',
          },
        }}>
        <BottomTab.Screen name="Portfolyo" component={PortfolioStackScreen} />
        <BottomTab.Screen name="Sıralama" component={CompareStackScreen} />
        <BottomTab.Screen name="Ayarlar" component={SettingsStackScreen} />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
};

export default Root;

const RootStyles = StyleSheet.create({
  headerTitleCommonStyle: {
    alignSelf: 'center',
    fontFamily: 'Proxima-Nova-Alt-Regular',
  },
});
