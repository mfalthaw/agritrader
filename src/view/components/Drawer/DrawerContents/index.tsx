import * as React from 'react';
import { Grid, Row } from 'react-native-easy-grid';
import { Content, List } from 'native-base';

import { routes, RouteInfo } from '../../../navigation/navigator';
import style from './style';
import DrawerItem from '../DrawerItem';
import DrawerHeader from '../DrawerHeader';

/** DrawerContents props */
export interface OwnProps {}

const DrawerContents: React.StatelessComponent<OwnProps> = (props) => {
  return (
    <Content style={style.content} >
      <DrawerHeader />
      <List>
        {getDrawerItems(routes)}
      </List>
    </Content>
  );
};

function getDrawerItems(routes: RouteInfo[]): JSX.Element[] {
  return routes.map(route => <DrawerItem icon={route.icon} key={route.name} text={route.name} />);
}

export default DrawerContents;
