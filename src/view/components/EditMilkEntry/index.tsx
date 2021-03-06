import * as React from 'react';
import { Content, List, View, ListItem, Text, Grid, Row, Col, H1, Button, Input, Item } from 'native-base';

import { Farmer } from '../../../store/modules/farmer/types';
import { MilkEntry } from '../../../store/modules/milk/types';
import { Route } from '../../navigation/routes';

import { MapStateToProps, MapDispatchToProps, connect } from 'react-redux';
import navActions from '../../../store/modules/nav/actions';
import { InjectedFabProps } from '../../hoc/PageComposer/FabPage/index';
import Composer from '../../hoc/PageComposer/index';
import { State, ThunkUpdateRow, StoreRow } from '../../../store/types';

import milkThunks from '../../../store/modules/milk/thunks';

import Styles from './style';
import { getActiveFarmer } from '../../../store/modules/farmer/selectors';
import { getActiveMilkEntry } from '../../../store/modules/milk/selectors';
import * as moment from 'moment';


interface OwnPropsType {
}

interface DispatchPropsType {
  navigate(route: Route): void;
  goBack(): void;
  updateMilkEntry(newEntry: ThunkUpdateRow<MilkEntry>): void;
}

interface StorePropsType {
  farmer: Farmer;
  milkEntry: StoreRow<MilkEntry>;
}

type NestedPropsType = StorePropsType & DispatchPropsType & OwnPropsType;

/** EditMilkEntry PropsType */
type PropsType = InjectedFabProps & NestedPropsType;

interface OwnStateType {
  amountOfProduct: number;
  quality: string;
  costPerUnit: number;
  validAmount: boolean;
  validRate: boolean;
  validQuality: boolean;
}

/**
 * Button color
 */
type ButtonColor = 'PRIMARY' | 'INFO';

/**
 * Page for EditMilkEntry
 */
class EditMilkEntry extends React.Component<PropsType, OwnStateType> {

  constructor(props: PropsType) {
    super(props);
    this.state = {
      amountOfProduct: this.props.milkEntry.amountOfProduct,
      quality: this.props.milkEntry.milkQuality,
      costPerUnit: this.props.milkEntry.costPerUnit,
      validAmount: true,
      validRate: true,
      validQuality: true,
    };
  }

  /** Create page buttons */
  private renderCancelButton = () => this.renderButton('Cancel', 'INFO', this.onCancelPress);
  private renderSaveButton = () => this.renderButton('Save', 'PRIMARY', this.onSavePress);

  /** Handle pressing cancel button */
  private onCancelPress = () => this.props.goBack();

  /** Handle pressing save button */
  private onSavePress = () => {
    let newEntry: ThunkUpdateRow<MilkEntry> = {
      uuid: this.props.milkEntry.uuid,
      toPersonUuid: this.props.milkEntry.toPersonUuid,
      fromPersonUuid: this.props.milkEntry.fromPersonUuid,
      amountOfProduct: this.state.amountOfProduct,
      costPerUnit: this.state.costPerUnit,
      currency: 'UGX',
      milkQuality: this.state.quality,
    };
    this.props.updateMilkEntry(newEntry);
    this.props.navigate(Route.FARMER);
  }

  private allValid = () => (
    this.state.validAmount
    && this.state.validRate
  )

  /**
   * Handle entry changes, update local state
   */
  private onAmountChange = (newAmount: string) => {
    const newAmountFloat = Number(newAmount);
    if (!newAmountFloat || newAmountFloat < 0) {
      this.setState(state => ({ validAmount: false }));
    } else {
      this.setState(state => ({ amountOfProduct: newAmountFloat, validAmount: true }));
    }
  }
  
  private onQualityChange = (newQuality: string) => this.setState(state => ({ quality: newQuality }));
  
  private onRateChange = (newCostPerUnit: string) => {
    const newRateFloat = Number(newCostPerUnit);
    
    if (!newRateFloat || newRateFloat < 0) {
      this.setState(state => ({ validRate: false }));
    } else {
      this.setState(state => ({ costPerUnit: newRateFloat, validRate: true }));
    }
  }

  /**
   * Returns a button with text, color, and onPress callback specified
   */
  private renderButton(text: string, color: ButtonColor, onPress: any) {
    const isInfo = color === 'INFO';
    const isPrimary = color === 'PRIMARY';

    if (isPrimary) {
      return (
        <Col style={Styles.button}>
          <Button disabled={!this.allValid()} block info={isInfo} primary={isPrimary} onPress={onPress}>
            <Text>{text}</Text>
          </Button>
        </Col>
      );
    } else {
      return (
        <Col style={Styles.button}>
          <Button block info={isInfo} primary={isPrimary} onPress={onPress}>
            <Text>{text}</Text>
          </Button>
        </Col>
      );
    }
  }

  private renderHeader() {
    return (
      <Grid>
        <Row style={Styles.headerRow}>
          <H1>
            {this.props.farmer.firstName} {this.props.farmer.lastName}
          </H1>
        </Row>
        <Row style={Styles.headerRow}>
          <Text style={Styles.header}>
            {moment(this.props.milkEntry.datetime).utc().format('MMMM Do YYYY, h:mm:ss a')}
          </Text>
        </Row>
      </Grid>
    );
  }

  private formatEditRow(label: string, 
                        value: number | string, 
                        onChangeText: any,
                        isNumeric: boolean,
                        validField?: boolean) {
    if (isNumeric) {
      return (
        <Grid>
          <Row>
            <Col>
              <Text>{label}</Text>
            </Col>
            <Col>
            <Item success={validField} error={!validField}>
              <Input keyboardType={'numeric'} onChangeText={onChangeText}>
                <Text>{value}</Text>
              </Input>
            </Item>
            </Col>
          </Row>
        </Grid>
      );
    }
    return (
      <Grid>
        <Row>
          <Col>
            <Text>{label}</Text>
          </Col>
          <Col>
          <Item success={validField} error={!validField}>
            <Input autoCapitalize="sentences" onChangeText={onChangeText}>
              <Text>{value}</Text>
            </Input>
          </Item>
          </Col>
        </Row>
      </Grid>
    );
  }

  private renderEditFields() {
    return (
      <View style={Styles.editView}>
        {this.formatEditRow('Amount (L)', this.props.milkEntry.amountOfProduct, this.onAmountChange, true, this.state.validAmount)}
        {this.formatEditRow('Lactometer', this.props.milkEntry.milkQuality, this.onQualityChange, true, this.state.validQuality)}
        {this.formatEditRow('Rate (UGX/L)', this.props.milkEntry.costPerUnit, this.onRateChange, true, this.state.validRate)}
      </View>
    );
  }

  /**
   * Render method for EditMilkEntry
   */
  public render() {
    return(
      <Content padder style={{ backgroundColor: 'white' }}>
      <List>
        <ListItem>
          {this.renderHeader()}
        </ListItem>
      </List>
      {this.renderEditFields()}
      <Grid>
        <Row style={Styles.buttonRow}>
          {this.renderCancelButton()}
          {this.renderSaveButton()}
        </Row>
      </Grid>
    </Content>
    );
  }
}

const EditMilkEntryPage = new Composer<NestedPropsType>(EditMilkEntry).page;

const mapStateToProps: MapStateToProps<StorePropsType, OwnPropsType, State> = (state) => {
  return {
    farmer: getActiveFarmer(state),
    milkEntry: getActiveMilkEntry(state),
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchPropsType, OwnPropsType> = (dispatch) => {
  return {
    navigate: (route: Route) => dispatch(navActions.navigateToWithoutHistory(route)),
    goBack: () => dispatch(navActions.goBack()),
    updateMilkEntry: async (newEntry: ThunkUpdateRow<MilkEntry>) => dispatch(milkThunks.updateMilkEntry(newEntry)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditMilkEntryPage);
