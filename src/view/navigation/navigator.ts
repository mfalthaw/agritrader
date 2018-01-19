import { StackNavigator, NavigationRouteConfigMap } from 'react-navigation';
import * as React from 'react';

import HomePage from '../pages/Home';
import FarmerPage from '../pages/Farmer';
import LoginPage from '../pages/Login';
// import FarmerSearch from '../pages/FarmerSearch';

/** Information for each route in app */
export interface RouteInfo {
  name: Route;
  icon: string;
  component: React.ComponentClass | React.StatelessComponent;
  inDrawer: boolean;
}

/** Named routes in the application */
export enum Route {
  HOME = 'Home',
  LOGIN = 'Login',
  FARMER = 'Farmer',
  SEARCH_FARMER = 'SearchFarmer',
}

/** App route information */
export const routes: RouteInfo[] = [
  {
    name: Route.LOGIN,
    icon: 'person',
    component: LoginPage,
    inDrawer: false,
  },
  {
    name: Route.HOME,
    icon: 'home',
    component: HomePage,
    inDrawer: true,
  },
  {
    name: Route.FARMER,
    icon: 'person',
    component: FarmerPage,
    inDrawer: true,
  },
  // {
  //   name: Route.SEARCH_FARMER,
  //   icon: 'search',
  //   component: FarmerSearch,
  //   inDrawer: true,
  // },
];

/** Convert IRoute[] to a NavigationRouteConfigMap */
function toNavigatorRoutes(routes: RouteInfo[]): NavigationRouteConfigMap {
  return routes.map(route => ({
    [route.name]: {
      screen: route.component,
    },
  })).reduce((a, b) => ({ ...a, ...b }));
}

/** Initial route for appplication */
export const INITIAL_ROUTE = Route.LOGIN;

/** Top-level navigator for application */
const navigator = StackNavigator(toNavigatorRoutes(routes), {
  headerMode: 'none',
  initialRouteName: INITIAL_ROUTE,
});

export default navigator;
