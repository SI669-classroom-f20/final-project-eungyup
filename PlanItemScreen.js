import React, {useEffect} from 'react';
import { KeyboardAvoidingView, StyleSheet, TextInput, Text, View, Image, FlatList, TouchableOpacity, Alert, SafeAreaView, ScrollView, LogBox, Platform, Button} from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { RadioButton } from 'react-native-paper';
// For Date Picker
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from "moment";

import { planItemStyles, colors } from './Styles';


import { getDataModel } from './DataModel';
// for Picture
import * as ImagePicker from 'expo-image-picker';
// import Constants from 'expo-constants';
// import { render } from 'react-dom';
import Logo from './Logo'


export class PlanItemScreen extends React.Component {

    constructor(props) {
        super(props);


        // Initial setup
        // let userId = '';
        let initItemTitle = '';

        // For Start Date
        let initItemStartDateString = moment(new Date()).format('MM/DD/YYYY');
        // (my) For Android, I may not need this.props.date
        let initItemStartDate = this.props.date || new Date();
        let initItemStartShow = false;

        // For End Date
        let initItemEndDateString = moment(new Date()).format('MM/DD/YYYY');
        // (my) For Android, I may not need this.props.date
        let initItemEndDate = this.props.date || new Date();
        let initItemEndShow = false;

        let initItemBudget = null;
        let initItemSpending = null;

        let initItemNotes = '';

        let initRandomKeyNumber = Math.floor(Math.random() * 10000);

        if (this.props.route.params){
            this.itemOperation = this.props.route.params.itemOperation;
            console.log('(PlanItem) this.itemOperation', this.itemOperation);


            // This is for "edit" from TripPlan
            if(this.props.route.params.itemOperation === 'edit') {
                // console.log('(TripPlan) worked');
                console.log('(Plan Item) edit tehItem', this.props.route.params.theItem)


                initItemTitle = this.props.route.params.theItem.itemTitle;
                // For Start Date

                initItemStartDateString = this.props.route.params.theItem.itemStartDateString;

                // (my) due to complicated format, I don't get tripStartDate (just use the default above is sufficient)
                // initTripStartDate = this.props.route.params.item.tripStartDate;
                // Since I should not store tripStartShow (open and close calendar) in the firebase and local model don't inculude this
                // let initTripStartShow = false;

                // For End Date

                initItemEndDateString = this.props.route.params.theItem.itemEndDateString;

                // (my) due to complicated format, I don't get tripStartDate (just use the default above is sufficient)
                // initTripEndDate = this.props.route.params.item.tripEndDate;
                // Since I should not store tripEndShow (open and close calendar) in the firebase and local model don't inculude this
                // let initTtripEndShow = false;

                initItemBudget = this.props.route.params.theItem.itemBudget;
                initItemSpending = this.props.route.params.theItem.itemSpending;

                initItemNotes = this.props.route.params.theItem.itemNotes;
            }
        }


        this.state = {

            itemTitle: initItemTitle,

            // For Start Date
            itemStartDateString: initItemStartDateString,
            // (my) For Android, I may not need this.props.date
            itemStartDate: initItemStartDate,
            itemStartShow: initItemStartShow,

            // For End Date
            itemEndDateString: initItemEndDateString,
            // (my) For Android, I may not need this.props.date
            itemEndDate: initItemEndDate,
            itemEndShow: initItemEndShow,

            itemBudget: initItemBudget,
            itemSpending: initItemSpending,

            itemNotes: initItemNotes,

            itemKeyNumber: initRandomKeyNumber,
        }


        // (my) just ignore the warnign sign
        // Becuase this log doesn't affect the app function, make it ignore
        LogBox.ignoreLogs(['Setting a timer']);
        LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
        // LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }

    onChangeStartDate = (event, selectedDate) => {
        // console.log('new Date()', new Date());
        // console.log('new Date()', typeof(new Date()));
        console.log(selectedDate);
        this.setState({itemStartDateString: moment(selectedDate).format('MM/DD/YYYY'), itemStartDate: selectedDate, itemStartShow: false});
        // console.log('format timestamp', moment(selectedDate).unix());
        // let timeStampNumber = Number(moment(selectedDate).unix()));
        // let timeStamp = moment(selectedDate).unix();
        // console.log('type of timestamp', typeof(timeStamp));
        // let totalSumOfTimeStamp = 0;
        // for (let num in String(timeStamp)){
        //     totalSumOfTimeStamp += Number(num)
        // }

        // // this.setState({testTimeStamp: moment(selectedDate).unix()});
        // this.setState({testTimeStamp: totalSumOfTimeStamp});
        // console.log('this.state.testTimeStamp: ', this.state.testTimeStamp)
    }

    onChangeEndDate = (event, selectedDate) => {
        console.log(selectedDate);
        this.setState({itemEndDateString: moment(selectedDate).format('MM/DD/YYYY'), itemEndDate: selectedDate, itemEndShow: false});
    }

    onCancel = () => {
        this.props.navigation.navigate("TripPlan");
    }
    // showOverlay = () => {
    //     this.setState({ tripStartShow: true}) 
    // }
    onAddOrEdit = () => {
        let theItem = {};
        if(this.itemOperation === 'add'){
            console.log("(PlanItem) added in PlanItem (this.itemOperation): ", this.itemOperation);
            theItem = {
                //(my) for editing and deleting in TripPlan, I added a key. (will get it on editing  as well)
                itemKey: '' + this.state.itemKeyNumber + this.state.itemTitle,
                
                itemTitle: this.state.itemTitle,
    
                // For Start Date
                itemStartDateString: this.state.itemStartDateString,
                itemStartDate: this.state.itemStartDate,
    
                // For Ednd Date
                itemEndDateString: this.state.itemEndDateString,
                itemEndDate: this.state.itemEndDate,
    
                itemBudget: this.state.itemBudget,
                itemSpending: this.state.itemSpending,
                itemNotes: this.state.itemNotes,
            }
        }
        else {
            console.log("(PlanItem) edited in PlanItem (this.itemOperation): ", this.itemOperation);
            console.log("(PlanItem)  edited in PlanItem (this.props.route.params.theItem): ", this.props.route.params.theItem);
            // // (my) by geting the whole "theItem", I can get the same key
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
        console.log("(PlanItem) added in PlanItem (theItem): ", theItem);
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
                                // for Android, need to make keyboardType={"default"} to use secureTextEntry = {true}
                                keyboardType={"default"}
                                onChangeText={(text)=>{this.setState({itemTitle: text})}}
                            />
                    </View>


                    {/* Snapshot: Start Date, End Date, Total Budget, Total Spending, Notes, and Picture */}
                    <View style={planItemStyles.planItemSnapshotContainer}>
                        <Text style={planItemStyles.planItemHeaderText}>Snapshot</Text>

                        {/* Start Date */}
                        <View style={planItemStyles.dateContainer}>
                            <Text style={planItemStyles.dateText}>Start Date: </Text>
                            <View style={planItemStyles.datePickerContainer}>
                                {/* Code Reference from https://medium.com/@jethro.riosa/implementation-of-react-native-community-datetimepicker-3acf4b69f5 */}
                                <TouchableOpacity onPress={()=> this.setState({itemStartShow: true})} style={planItemStyles.inputContainerStyle}>
                                    {/* (my) For android, I may not need  <Text style={styles.placeholderStyle}>{this.props.placeholder}</Text>
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
                            <View style={planItemStyles.endDatePickerContainer}>
                                {/* Code Reference from https://medium.com/@jethro.riosa/implementation-of-react-native-community-datetimepicker-3acf4b69f5 */}
                                <TouchableOpacity onPress={()=> this.setState({itemEndShow: true})} style={planItemStyles.inputContainerStyle}>
                                    {/* (my) For android, I may not need  <Text style={styles.placeholderStyle}>{this.props.placeholder}</Text>
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

                        {/* Total Budget */}
                        <View style={planItemStyles.moneyContainer}>
                            <Text style={planItemStyles.moneyText}>Budget: $</Text>
                            <TextInput
                                style={planItemStyles.inputText}
                                autoCorrect={false}
                                // placeholder='Type your budget'
                                maxLength={6}
                                value={this.state.itemBudget}
                                // for Android, need to make keyboardType={"default"} to use secureTextEntry = {true}
                                keyboardType={"decimal-pad"}
                                onChangeText={(text)=>{this.setState({itemBudget: text})}}
                            />
                        </View>

                        {/* Total Spending */}
                        <View style={planItemStyles.moneyContainer}>
                                <Text style={planItemStyles.moneyText}>Spending: $</Text>
                                <TextInput
                                style={planItemStyles.inputText}
                                autoCorrect={false}
                                // placeholder='Type your spending'
                                maxLength={6}
                                value={this.state.itemSpending}
                                // for Android, need to make keyboardType={"default"} to use secureTextEntry = {true}
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
                                    // autoCorrect={false}
                                    placeholder='Add your notes'
                                    value={this.state.itemNotes}
                                    // for Android, need to make keyboardType={"default"} to use secureTextEntry = {true}
                                    keyboardType={"default"}
                                    multiline={true}
                                    underlineColorAndroid='transparent'
                                    // numberOfLines={5}
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