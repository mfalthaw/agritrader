import * as React from 'react';
import { Grid, Row, Col, Content, Button, Text } from 'native-base';
import CardSummary from '../../../../components/CardSummary';
import ProductCard from '../../components/ProductCard';
import styles from '../../style';
import Composer from '../../../../hoc/PageComposer/index';
import { Route } from '../../../../navigation/navigator';
import { InjectedFabProps } from '../../../../hoc/PageComposer/FabPage/index';
// import Page from '../../../../lib/baseComponents/Page/index';

interface OwnPropsType {
  currentDayTotal: string;
  currentWeekTotal: string;
  currentMonthTotal: string;
  exportValues: any[];
}

interface DispatchPropsType {
  navigate(route: Route): void;
}

interface StorePropsType {
  weeklybalance: string;
  weeklyTotal: string;
  dailyTotal: string;
  collectTransactions: any[];
}

interface OwnStateType {
}

type NestedPropsType = StorePropsType & DispatchPropsType & OwnPropsType;

/** FarmerSearch PropsType */
type PropsType = InjectedFabProps & NestedPropsType;

/**
 * Container for Exports
 */
class Export extends React.Component<PropsType, OwnStateType> {
  // TODO need to connect this to the redux state
  /**
   * Render method for Exports
   */
  public render() {
    const testData = [{
      label: 'Today',
      value: this.props.currentDayTotal,
      units: 'L',
    },                {
      label: 'This Week',
      value: this.props.currentWeekTotal,
      units: 'L',
    },                {
      label: 'This Month',
      value: this.props.currentMonthTotal,
      units: 'L',
    },
    ];

    return (
      <Content style={styles.container}>
        <Grid style={styles.contents}>
          <Row>
            <CardSummary
              data={testData}
            />
          </Row>
          <Row>
            <ProductCard
              values={this.props.exportValues}
            />
          </Row>
        </Grid>
        <Row style={styles.addEntryButton}>
          <Col>
            <Button block info >
              <Text>
                ADD ENTRY
            </Text>
            </Button>
          </Col>
        </Row>
      </Content>
    );
  }
}

const ExportPage = new Composer<NestedPropsType>(Export)
  .fab()
  .page;

const mapStateToProps: MapStateToProps<StorePropsType, OwnPropsType, State> = (state) => {
  return {
    weeklyTotal: getWeeklyFarmerMilkTotal(state),
    dailyTotal: getFarmerDayTotal(state),
    collectTransactions: getFormattedFarmersTransactions(state),
    weeklybalance: getFarmerWeeklyBalance(state),
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchPropsType, OwnPropsType> = (dispatch) => {
  return {
    navigate: (route: Route) => dispatch(navActions.navigateTo(route)),
    setActiveMilkEntry: (uuid: string) => dispatch(activeRowsActions.setActiveMilkEntry(uuid)),
    navigateToMilkEntry: () => dispatch(navActions.navigateTo(Route.MILK_ENTRY_DETAILS)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CollectPage);
