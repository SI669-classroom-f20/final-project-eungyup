import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, LogBox } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { RadioButton } from 'react-native-paper';
// for date picker
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from "moment";

import { planItemStyles, colors } from './Styles';
import { getDataModel } from './DataModel';

import Logo from './Logo'


export class PlanItemScreen extends React.Component {

    constructor(props) {
        super(props);
        // initial setup
        let initItemTitle = '';

        // for start date
        let initItemStartDateString = moment(new Date()).format('MM/DD/YYYY');
        // for Android, may not need this.props.date
        let initItemStartDate = this.props.date || new Date();
        let initItemStartShow = false;

        // for end date
        let initItemEndDateString = moment(new Date()).format('MM/DD/YYYY');
        // for Android, may not need this.props.date
        let initItemEndDate = this.props.date || new Date();
        let initItemEndShow = false;

        let initItemBudget = 0;
        let initItemSpending = 0;

        let initItemNotes = '';

        let initRandomKeyNumber = Math.floor(Math.random() * 10000);

        if (this.props.route.params){
            this.itemOperation = this.props.route.params.itemOperation;

            // This is for "edit" from TripPlan
            if(this.props.route.params.itemOperation === 'edit') {
                initItemTitle = this.props.route.params.theItem.itemTitle;

                // for start date
                initItemStartDateString = this.props.route.params.theItem.itemStartDateString;
                //  due to complicated format, don't get itemStartDate (just use the default above is sufficient)

                // for end date
                initItemEndDateString = this.props.route.params.theItem.itemEndDateString;
                // due to complicated format, don't get itemStartDate (just use the default above is sufficient)

                initItemBudget = this.props.route.params.theItem.itemBudget;
                initItemSpending = this.props.route.params.theItem.itemSpending;

                initItemNotes = this.props.route.params.theItem.itemNotes;
            }
        }

        this.state = {
            itemTitle: initItemTitle,

            // for start date
            itemStartDateString: initItemStartDateString,
            itemStartDate: initItemStartDate,
            itemStartShow: initItemStartShow,

            // for end date
            itemEndDateString: initItemEndDateString,
            itemEndDate: initItemEndDate,
            itemEndShow: initItemEndShow,

            itemBudget: initItemBudget,
            itemSpending: initItemSpending,

            itemNotes: initItemNotes,

            itemKeyNumber: initRandomKeyNumber,
        }

        // Because of passing a timestamp, it gives this log.
        // However, since this log doesn't affect the app function, make it ignore.
        LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
    }

    onChangeStartDate = (event, selectedDate) => {
        this.setState(
            {
                itemStartDateString: moment(selectedDate).format('MM/DD/YYYY'),
                itemStartDate: selectedDate,
                itemStartShow: false,
                itemEndDateString: moment(selectedDate).format('MM/DD/YYYY'),
                itemEndDate: selectedDate,
                itemEndShow: false
            });
    }

    onChangeEndDate = (event, selectedDate) => {
        this.setState({itemEndDateString: moment(selectedDate).format('MM/DD/YYYY'), itemEndDate: selectedDate, itemEndShow: false});
    }

    onCancel = () => {
        this.props.navigation.navigate("TripPlan");
    }

    onAddOrEdit = () => {
        let theItem = {};
        if(this.itemOperation === 'add'){
            theItem = {
                // for editing and deleting in TripPlan, added a key. (will get it on editing as well)
                itemKey: '' + this.state.itemKeyNumber + this.state.itemTitle,

                itemTitle: this.state.itemTitle,

                // for start date
                itemStartDateString: this.state.itemStartDateString,
                itemStartDate: this.state.itemStartDate,

                // for end date
                itemEndDateString: this.state.itemEndDateString,
                itemEndDate: this.state.itemEndDate,

                itemBudget: this.state.itemBudget,
                itemSpending: this.state.itemSpending,
                itemNotes: this.state.itemNotes,
            }
        }
        else {
            // by geting the whole "theItem", I can get the same key
            theItem = this.props.route.params.theItem;
            theItem.itemTitle = this.state.itemTitle;

            theItem.itemStartDateString = this.state.itemStartDateString;
            theItem.itemStartDate = this.state.itemStartDate;

            theItem.itemEndDateString = this.state.itemEndDateString;
            theItem.itemEndDate = this.state.itemEndDate;

            theItem.itemBudget = this.state.itemBudget;
            theItem.itemSpending = this.state.itemSpending;

            theItem.itemNotes = this.state.itemNotes;
        }
        this.props.navigation.navigate("TripPlan", {
            itemOperation: this.itemOperation,
            theItem: theItem
        });
    };

    render() {
        return (
            <View style={planItemStyles.container}>
                {/* Top */}
                <Logo/>

                {/* Contetent */}
                <ScrollView style={planItemStyles.contentView}>
                    {/* PlanItem Information: PlanItem Title */}
                    <View style={planItemStyles.planItemInfoContainer}>
                        <Text style={planItemStyles.planItemInfoText}> Plan Title: </Text>
                        <TextInput
                                style={planItemStyles.planItemInputText}
                                autoCorrect={false}
                                placeholder='Add your plan title'
                                maxLength={40}
                                value={this.state.itemTitle}
                                keyboardType={"default"}
                                onChangeText={(text)=>{this.setState({itemTitle: text})}}
                            />
                    </View>

                    {/* Snapshot: Start Date, End Date, Budget, Spending, and Notes */}
                    <View style={planItemStyles.planItemSnapshotContainer}>
                        <Text style={planItemStyles.planItemHeaderText}>Snapshot</Text>

                        {/* Start Date */}
                        <View style={planItemStyles.dateContainer}>
                            <Text style={planItemStyles.dateText}>Start Date: </Text>
                            {/* Code Reference for date picker from https://medium.com/@jethro.riosa/implementation-of-react-native-community-datetimepicker-3acf4b69f5 */}
                            <View style={planItemStyles.datePickerContainer}>
                                <TouchableOpacity onPress={()=> this.setState({itemStartShow: true})} style={planItemStyles.inputContainerStyle}>
                                    {/* on android, may not need  <Text style={styles.placeholderStyle}>{this.props.placeholder}</Text>
                                    )} */}
                                    {this.state.itemStartDateString ? (
                                        <Text style={planItemStyles.textStyle}>{this.state.itemStartDateString}</Text>
                                    ) : (
                                        <Text style={planItemStyles.placeholderStyle}>{this.props.placeholder}</Text>
                                    )} 
                                </TouchableOpacity>
                                {this.state.itemStartShow && 
                                    <DateTimePicker
                                        value={this.state.itemStartDate}
                                        mode={'date'}
                                        is24Hour={true}
                                        display="default"
                                        onChange={this.onChangeStartDate}
                                        style={{ backgroundColor: 'white' }}
                                    />
                                }
                                <FontAwesome5 name="calendar-alt" size={28} color={colors.primary} style={planItemStyles.calendarIcon} onPress={()=> this.setState({itemStartShow: true})} />
                            </View>
                        </View>

                        {/* End Date */}
                        <View style={[planItemStyles.dateContainer, planItemStyles.endDateContainer]}>
                            <Text style={planItemStyles.dateText}>End Date: </Text>
                            {/* Code Reference for date picker from https://medium.com/@jethro.riosa/implementation-of-react-native-community-datetimepicker-3acf4b69f5 */}
                            <View style={planItemStyles.endDatePickerContainer}>
                                <TouchableOpacity onPress={()=> this.setState({itemEndShow: true})} style={planItemStyles.inputContainerStyle}>
                                    {/* on android, may not need  <Text style={styles.placeholderStyle}>{this.props.placeholder}</Text>
                                    )} */}
                                    {this.state.itemEndDateString ? (
                                        <Text style={planItemStyles.textStyle}>{this.state.itemEndDateString}</Text>
                                    ) : (
                                        <Text style={planItemStyles.placeholderStyle}>{this.props.placeholder}</Text>
                                    )} 
                                </TouchableOpacity>
                                {this.state.itemEndShow && 
                                    <DateTimePicker
                                        value={this.state.itemEndDate}
                                        mode={'date'}
                                        is24Hour={true}
                                        display="default"
                                        onChange={this.onChangeEndDate}
                                        style={{ backgroundColor: 'white' }}
                                    />
                                }
                                <FontAwesome5 name="calendar-alt" size={28} color={colors.primary} style={planItemStyles.calendarIcon} onPress={()=> this.setState({itemEndShow: true})} />
                            </View>
                        </View>

                        {/* Budget */}
                        <View style={planItemStyles.moneyContainer}>
                            <Text style={planItemStyles.moneyText}>Budget: $</Text>
                            <TextInput
                                style={planItemStyles.inputText}
                                autoCorrect={false}
                                maxLength={6}
                                value={String(this.state.itemBudget)}
                                keyboardType={"decimal-pad"}
                                onChangeText={(text)=>{this.setState({itemBudget: text})}}
                            />
                        </View>

                        {/* Spending */}
                        <View style={planItemStyles.moneyContainer}>
                                <Text style={planItemStyles.moneyText}>Spending: $</Text>
                                <TextInput
                                style={planItemStyles.inputText}
                                autoCorrect={false}
                                maxLength={6}
                                value={String(this.state.itemSpending)}
                                keyboardType={"decimal-pad"}
                                onChangeText={(text)=>{this.setState({itemSpending: text})}}
                            />
                        </View>

                        {/* Notes */}
                        <View style={planItemStyles.notesContainer}>
                            <Text style={planItemStyles.notesText}>Notes: </Text>
                            <View>
                                <TextInput
                                    style={planItemStyles.notesInputText}
                                    placeholder='Add your notes'
                                    value={this.state.itemNotes}
                                    keyboardType={"default"}
                                    multiline={true}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text)=>{this.setState({itemNotes: text})}}
                                />
                            </View>
                        </View>
                    </View>

                {/* BottomView */}
                <View style={planItemStyles.bottomView}>
                    <View style={planItemStyles.cancelContainer}>
                        <TouchableOpacity 
                            style={planItemStyles.buttonContainerCancel}
                            onPress={this.onCancel}
                        >
                            <Text style={planItemStyles.buttonTextCancel}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity 
                            style={planItemStyles.buttonContainer}
                            onPress={this.onAddOrEdit}
                        >
                            <Text style={planItemStyles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </ScrollView>
            </View>
        );
    }
}