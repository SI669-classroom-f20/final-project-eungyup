import React, {useEffect} from 'react';
import { StyleSheet, TextInput, Text, View, Image, FlatList, TouchableOpacity, Alert, SafeAreaView, ScrollView, LogBox, Platform, Button} from 'react-native';
import { FontAwesome ,FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { RadioButton } from 'react-native-paper';
// For Date Picker
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from "moment";

import { tripPlanStyles, colors } from './Styles';


import { getDataModel } from './DataModel';
// for Picture
import * as ImagePicker from 'expo-image-picker';
// import Constants from 'expo-constants';
// import { render } from 'react-dom';



export class TripPlanScreen extends React.Component {

    constructor(props) {
        super(props);

        // local dataModel
        this.dataModel = getDataModel();


        // Initial setup
        let userId = '';
        let initTripTitle = '';
        let initTripCategory = '';
        let initTripStatus = 'upcoming';

        // For Start Date
        let initTripStartDateString = moment(new Date()).format('MM/DD/YYYY');
        // (my) For Android, I may not need this.props.date
        let initTripStartDate = this.props.date || new Date();
        let initTripStartShow = false;

        // For End Date
        let initTripEndDateString = moment(new Date()).format('MM/DD/YYYY');
        // (my) For Android, I may not need this.props.date
        let initTripEndDate = this.props.date || new Date();
        let initTtripEndShow = false;

        let initTotalBudget = 0;
        let initTotalSpending = 0;
        let initMoneyLeft = 0;

        let initNotes = '';

        let initImageURL = null;

        let initPlanItems = [];

        if (this.props.route.params){
            this.operation = this.props.route.params.operation;
            console.log('(TripPlan) this.operation', this.operation);

            // This is for "add" from Home
            userId = this.props.route.params.userId;
            console.log('(TripPlan) add userId', userId);

            // This is for "edit" from Home
            if(this.props.route.params.operation === 'edit') {
                // console.log('(TripPlan) worked');
                console.log('(TripPlan) edit item', this.props.route.params.item)

                userId = this.props.route.params.item.userId;
                console.log('(TripPlan) edit userId', userId);
                initTripTitle = this.props.route.params.item.tripTitle;
                initTripCategory = this.props.route.params.item.tripCategory;
                initTripStatus = this.props.route.params.item.tripStatus;
        
                // For Start Date

                initTripStartDateString = this.props.route.params.item.tripStartDateString;

                // (my) due to complicated format, I don't get tripStartDate (just use the default above is sufficient)
                // initTripStartDate = this.props.route.params.item.tripStartDate;
                // Since I should not store tripStartShow (open and close calendar) in the firebase and local model don't inculude this
                // let initTripStartShow = false;
        
                // For End Date

                initTripEndDateString = this.props.route.params.item.tripEndDateString;

                // (my) due to complicated format, I don't get tripStartDate (just use the default above is sufficient)
                // initTripEndDate = this.props.route.params.item.tripEndDate;
                // Since I should not store tripEndShow (open and close calendar) in the firebase and local model don't inculude this
                // let initTtripEndShow = false;
        
                initTotalBudget = this.props.route.params.item.totalBudget;
                initTotalSpending = this.props.route.params.item.totalSpending;
                initMoneyLeft = this.props.route.params.item.moneyLeft;
        
                initNotes = this.props.route.params.item.notes;

                initImageURL = this.props.route.params.item.imageURL;

                initPlanItems = this.props.route.params.item.planItems;
            }
        }

        // let initList = [];
        // for (let i = 0; i <25; i++){
        //     initList.push({
        //         text: 'item' + i,
        //         key: '' + i
        //     });
        // }

        this.state = {

            userId: userId,
            tripTitle: initTripTitle,
            tripCategory: initTripCategory,
            tripStatus: initTripStatus,

            // For Start Date
            tripStartDateString: initTripStartDateString,
            // (my) For Android, I may not need this.props.date
            tripStartDate: initTripStartDate,
            tripStartShow: initTripStartShow,

            // For End Date
            tripEndDateString: initTripEndDateString,
            // (my) For Android, I may not need this.props.date
            tripEndDate: initTripEndDate,
            tripEndShow: initTtripEndShow,

            totalBudget: initTotalBudget,
            totalSpending: initTotalSpending,
            moneyLeft: initMoneyLeft,

            notes: initNotes,

            // (my) For picture local uri
            image: null,

            imageURL: initImageURL,

            testTimeStamp: 0,
            // Test
            // theList: initList,

            // Plan Items List
            planItems: initPlanItems,
        }

        // (my) just ignore the warnign sign
        // Becuase this log doesn't affect the app function, make it ignore
        LogBox.ignoreLogs(['Setting a timer']);
        LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
        // LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }

    /*
    componentDidMount for adding a new planItem
    */
    componentDidMount() {
        this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentWillUnmount() {
        this.focusUnsubscribe();
    }

    onFocus = async () => {
        if (this.props.route.params.theItem) {
            const {itemOperation, theItem} = this.props.route.params;
            // item is an object
            if (itemOperation === 'add') {
                console.log('(TripPlan onFouce add -> theItem', theItem);
                this.addItem(theItem);
            }
            else if (itemOperation === 'edit') {
                console.log('(TripPlan onFouce add -> theItem', theItem);
                this.updateItem(theItem);
            }
        }
        this.props.navigation.setParams({itemOperation: 'none'});
    }

    addItem = (theItem) => {
        console.log('(TripPlan) addItem old planItems list: ', this.state.planItems);
        let newList = this.state.planItems;
        newList.push(theItem);

        this.setState({planItems: newList});
        console.log('(TripPlan) addItem new planItems list: ', this.state.planItems);
    }



    onChangeStartDate = (event, selectedDate) => {
        // console.log('new Date()', new Date());
        // console.log('new Date()', typeof(new Date()));
        console.log(selectedDate);
        this.setState({tripStartDateString: moment(selectedDate).format('MM/DD/YYYY'), tripStartDate: selectedDate, tripStartShow: false});
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
        this.setState({tripEndDateString: moment(selectedDate).format('MM/DD/YYYY'), tripEndDate: selectedDate, tripEndShow: false});
    }

    onCancel = () => {
        this.props.navigation.navigate("Home");
    }
    // showOverlay = () => {
    //     this.setState({ tripStartShow: true}) 
    // }
    onAddOrEdit = () => {
        let theItem = {};
        if(this.operation === 'add'){
            console.log("(Trip Plan) added in Trip Plan (this.operation): ", this.operation);
            theItem = {
                userId: this.state.userId,
                tripTitle: this.state.tripTitle,
                tripCategory: this.state.tripCategory,
                tripStatus: this.state.tripStatus,
    
                // For Start Date
                tripStartDateString: this.state.tripStartDateString,
                // (my) For Android, I may not need this.props.date
                tripStartDate: this.state.tripStartDate,
                // tripStartShow: this.state.tripStartShow,
    
                // For Ednd Date
                tripEndDateString: this.state.tripEndDateString,
                // (my) For Android, I may not need this.props.date
                tripEndDate: this.state.tripEndDate,
                // tripEndShow: this.state.tripEndShow,
    
                totalBudget: this.state.totalBudget,
                totalSpending: this.state.totalSpending,
                moneyLeft: this.state.moneyLeft,
                notes: this.state.notes,

                imageURL: this.state.imageURL,

                planItems: this.state.planItems,
                // test timestamp
                // testTimeStamp: this.state.testTimeStamp,
            }
        }
        else {
            console.log("(Trip Plan) edited in Trip Plan (this.operation): ", this.operation);
            console.log("(Trip Plan) edited in Trip Plan (this.props.route.params.item): ", this.props.route.params.item);
            theItem = this.props.route.params.item;
            theItem.tripTitle = this.state.tripTitle;
            theItem.tripCategory = this.state.tripCategory;
            theItem.tripStatus = this.state.tripStatus;

            theItem.tripStartDateString = this.state.tripStartDateString;
            theItem.tripStartDate = this.state.tripStartDate;

            theItem.tripEndDateString = this.state.tripEndDateString;
            theItem.tripEndDate = this.state.tripEndDate;

            theItem.totalBudget = this.state.totalBudget;
            theItem.totalSpending = this.state.totalSpending;
            theItem.moneyLeft = this.state.moneyLeft;

            theItem.notes = this.state.notes;

            theItem.imageURL = this.state.imageURL;

            theItem.planItems = this.state.planItems;
            // test timestamp
            // theItem.testTimeStamp = this.state.testTimeStamp;
        }

        this.props.navigation.navigate("Home", {
            operation: this.operation,
            item: theItem
        });
    };

    // for selecting picture
    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        // (my) ratio for vertical and horizontal
        aspect: [4, 3],
        quality: 1,
        });
        console.log(result);

        if (!result.cancelled) {
        this.setState({image: result.uri});
        }

        // update to firebase storage
        let firebaseStorageURI = await this.dataModel.updateImage(result);
        console.log('(Trip Plan) pickImage firebaseStorageURI', firebaseStorageURI);

        this.setState({imageURL: firebaseStorageURI});
        console.log('(Trip Plan) pickImage this.state.imageURL', this.state.imageURL);

    };

    render() {
        return (
            <View style={tripPlanStyles.container}>
                {/*  Flatlist */}
                <View style={tripPlanStyles.flatListContainer}>
                    <FlatList
                        data={this.state.planItems}

                        // Header
                        ListHeaderComponent={
                            <View>
                                {/* Top */}
                                <View style={tripPlanStyles.topView}>
                                    <Image
                                        source={require('./assets/logo.png')}
                                        style={tripPlanStyles.logoImage}
                                    />
                                </View>

                                {/* Content */}
                                <View style={tripPlanStyles.contentView}>
                                    {/* Trip Information: Trip Title and Trip Category */}
                                    <View style={tripPlanStyles.tripInfoContainer}>
                                        <Text style={tripPlanStyles.tripInfoText}>Trip Title: </Text>
                                        <TextInput
                                                style={tripPlanStyles.inputText}
                                                autoCorrect={false}
                                                placeholder='Add your trip title'
                                                maxLength={40}
                                                value={this.state.tripTitle}
                                                // for Android, need to make keyboardType={"default"} to use secureTextEntry = {true}
                                                keyboardType={"default"}
                                                onChangeText={(text)=>{this.setState({tripTitle: text})}}
                                            />
                                    </View>
                                    <View style={tripPlanStyles.tripInfoContainer}>
                                        <Text style={tripPlanStyles.tripInfoText}>Trip Category: </Text>
                                        <TextInput
                                                style={tripPlanStyles.inputText}
                                                autoCorrect={false}
                                                placeholder='Add your trip category'
                                                maxLength={40}
                                                value={this.state.tripCategory}
                                                // for Android, need to make keyboardType={"default"} to use secureTextEntry = {true}
                                                keyboardType={"default"}
                                                onChangeText={(text)=>{this.setState({tripCategory: text})}}
                                            />
                                    </View>

                                    {/* Trip Status: Upcoming Trip, On Trip, Completed */}
                                    <View style={tripPlanStyles.tripStatusContainer}>
                                        <Text style={tripPlanStyles.tripheaderText}>Status</Text>
                                        <View style={tripPlanStyles.tripStatusRadioContainer}>
                                            <RadioButton
                                                value="upcoming"
                                                status={ this.state.tripStatus === 'upcoming' ? 'checked' : 'unchecked' }
                                                onPress={() => this.setState({tripStatus: 'upcoming'})}
                                                uncheckedColor={colors.primary}
                                                color={colors.primary}
                                            />
                                            <Text style={tripPlanStyles.tripStatusRadioText}>Upcoming Trip</Text>
                                        </View>
                                        <View style={tripPlanStyles.tripStatusRadioContainer}>
                                            <RadioButton
                                                value="onTrip"
                                                status={ this.state.tripStatus === 'onTrip' ? 'checked' : 'unchecked' }
                                                onPress={() => this.setState({tripStatus: 'onTrip'})}
                                                uncheckedColor={colors.primary}
                                                color={colors.primary}
                                            />
                                            <Text style={tripPlanStyles.tripStatusRadioText}>On Trip</Text>
                                        </View>
                                        <View style={tripPlanStyles.tripStatusRadioContainer}>
                                            <RadioButton
                                                value="completed"
                                                status={ this.state.tripStatus === 'completed' ? 'checked' : 'unchecked' }
                                                onPress={() => this.setState({tripStatus: 'completed'})}
                                                uncheckedColor={colors.primary}
                                                color={colors.primary}
                                            />
                                            <Text style={tripPlanStyles.tripStatusRadioText}>Completed</Text>
                                        </View>
                                    </View>

                                    {/* Snapshot: Start Date, End Date, Total Budget, Total Spending, Notes, and Picture */}
                                    <View style={tripPlanStyles.tripSnapshotContainer}>
                                        <Text style={tripPlanStyles.tripheaderText}>Snapshot</Text>

                                        {/* Start Date */}
                                        <View style={tripPlanStyles.dateContainer}>
                                            <Text style={tripPlanStyles.dateText}>Start Date: </Text>
                                            <View style={tripPlanStyles.datePickerContainer}>
                                                {/* Code Reference from https://medium.com/@jethro.riosa/implementation-of-react-native-community-datetimepicker-3acf4b69f5 */}
                                                <TouchableOpacity onPress={()=> this.setState({tripStartShow: true})} style={tripPlanStyles.inputContainerStyle}>
                                                    {/* (my) For android, I may not need  <Text style={styles.placeholderStyle}>{this.props.placeholder}</Text>
                                                    )} */}
                                                    {this.state.tripStartDateString ? (
                                                        <Text style={tripPlanStyles.textStyle}>{this.state.tripStartDateString}</Text>
                                                    ) : (
                                                        <Text style={tripPlanStyles.placeholderStyle}>{this.props.placeholder}</Text>
                                                    )} 
                                                </TouchableOpacity>
                                                {this.state.tripStartShow && 
                                                    <DateTimePicker
                                                        value={this.state.tripStartDate}
                                                        mode={'date'}
                                                        is24Hour={true}
                                                        display="default"
                                                        onChange={this.onChangeStartDate}
                                                        style={{ backgroundColor: 'white' }}
                                                    />
                                                }
                                                <FontAwesome5 name="calendar-alt" size={28} color={colors.primary} style={tripPlanStyles.calendarIcon} onPress={()=> this.setState({tripStartShow: true})} />
                                            </View>
                                        </View>

                                        {/* End Date */}
                                        <View style={tripPlanStyles.dateContainer}>
                                            <Text style={tripPlanStyles.dateText}>End Date: </Text>
                                            <View style={tripPlanStyles.endDatePickerContainer}>
                                                {/* Code Reference from https://medium.com/@jethro.riosa/implementation-of-react-native-community-datetimepicker-3acf4b69f5 */}
                                                <TouchableOpacity onPress={()=> this.setState({tripEndShow: true})} style={tripPlanStyles.inputContainerStyle}>
                                                    {/* (my) For android, I may not need  <Text style={styles.placeholderStyle}>{this.props.placeholder}</Text>
                                                    )} */}
                                                    {this.state.tripEndDateString ? (
                                                        <Text style={tripPlanStyles.textStyle}>{this.state.tripEndDateString}</Text>
                                                    ) : (
                                                        <Text style={tripPlanStyles.placeholderStyle}>{this.props.placeholder}</Text>
                                                    )} 
                                                </TouchableOpacity>
                                                {this.state.tripEndShow && 
                                                    <DateTimePicker
                                                        value={this.state.tripEndDate}
                                                        mode={'date'}
                                                        is24Hour={true}
                                                        display="default"
                                                        onChange={this.onChangeEndDate}
                                                        style={{ backgroundColor: 'white' }}
                                                    />
                                                }
                                                <FontAwesome5 name="calendar-alt" size={28} color={colors.primary} style={tripPlanStyles.calendarIcon} onPress={()=> this.setState({tripEndShow: true})} />
                                            </View>
                                        </View>

                                        {/* Total Budget */}
                                        <View style={this.state.totalBudget == 0 ? tripPlanStyles.moneyDefaultContainer : tripPlanStyles.moneyContainer}>
                                            <Text style={tripPlanStyles.moneyText}>Total Budget: </Text>
                                            {this.state.totalBudget == 0 ?
                                                <Text style={tripPlanStyles.defaultNumberText}>Once you add a budget in a plan item, the Total Budget will be updated automatically.</Text>
                                                :
                                                <Text style={tripPlanStyles.numberText}>$ {this.state.totalBudget}</Text>
                                            }
                                        </View>

                                        {/* Total Spending */}
                                        <View style={this.state.totalSpending == 0 ? tripPlanStyles.moneyDefaultContainer : tripPlanStyles.moneyContainer}>
                                                <Text style={tripPlanStyles.moneyText}>Total Spending: </Text>
                                                {this.state.totalSpending == 0?
                                                <Text style={tripPlanStyles.defaultNumberText}>Once you add a spending in a plan item, the Total Spending will be updated automatically.</Text>
                                                :
                                                <Text style={tripPlanStyles.numberText}>$ {this.state.totalBudget}</Text>
                                                }
                                        </View>

                                        {/* MoneyLeft */}
                                        <View style={this.state.moneyLeft == 0 ? tripPlanStyles.moneyDefaultContainer : tripPlanStyles.moneyContainer}>
                                                <Text style={tripPlanStyles.moneyText}>Money Left: </Text>
                                                {this.state.totalSpending == 0?
                                                <Text style={tripPlanStyles.defaultNumberText}>Once you add a budget and spending in a plan item, the Money Left will be updated automatically.</Text>
                                                :
                                                <Text style={tripPlanStyles.numberText}>$ {this.state.moneyLeft}</Text>
                                                }
                                        </View>

                                        {/* Notes */}
                                        <View style={tripPlanStyles.notesContainer}>
                                            <Text style={tripPlanStyles.notesText}>Notes: </Text>
                                            <View style={tripPlanStyles.notesTextInputContainer}>
                                                <TextInput
                                                    style={tripPlanStyles.notesInputText}
                                                    // autoCorrect={false}
                                                    placeholder='Add your notes'
                                                    value={this.state.notes}
                                                    // for Android, need to make keyboardType={"default"} to use secureTextEntry = {true}
                                                    keyboardType={"default"}
                                                    multiline={true}
                                                    underlineColorAndroid='transparent'
                                                    // numberOfLines={5}
                                                    onChangeText={(text)=>{this.setState({notes: text})}}
                                                />
                                            </View>
                                        </View>

                                        {/* Picture */}
                                        <View style={tripPlanStyles.pictureContainer}>
                                            <Text style={tripPlanStyles.pictureText}>Picture: </Text>
                                            {/* <Button title="Pick an image from camera roll" onPress={this.pickImage} /> */}

                                            {this.props.route.params.operation === 'edit' && this.props.route.params.item.imageURL?
                                                <View style={tripPlanStyles.imageContainer}>
                                                    {/* width and height below is configued the image that was taken */}
                                                        <Image source={{uri: this.state.imageURL}}
                                                                style={tripPlanStyles.imageStyle}
                                                        />
                                                </View>

                                            :

                                                <View style={this.state.image ? tripPlanStyles.imageContainer : tripPlanStyles.imageDefaultParentContainer}>
                                                {this.state.image ?
                                                    <Image source={{uri: this.state.imageURL}}
                                                    style={tripPlanStyles.imageStyle} 
                                                    />
                                                    :
                                                    <View style={tripPlanStyles.imageDefaultContainer}>
                                                        <Text style={tripPlanStyles.imageDefaultText}>Add a trip picture</Text>
                                                        <View>
                                                            <TouchableOpacity
                                                                // style={homeStyles.defaultButton}
                                                                onPress={this.pickImage}
                                                            >
                                                                <MaterialIcons name="add-circle-outline" size={50} color={colors.primary} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                }
                                                </View>
                                                }

                                        </View>
                                    </View>

                                    {/* Plan Items Section just header */}
                                    <View style={tripPlanStyles.tripSnapshotContainer}>
                                        <Text style={tripPlanStyles.tripheaderText}>Plan Items</Text>
                                    </View>
                                </View>
                            </View>
                        }
                        keyExtractor={item => item.itemKey}
                        // FlatLst
                        renderItem={({item}) => {
                            // console.log('item', item.text)
                            return(
                                <View>
                                    <View style={tripPlanStyles.flatRenderItemContainer}>
                                        <FontAwesome name="circle" size={40} color={colors.primary} />
                                        <Text style={tripPlanStyles.flatRenderText}>{item.itemTitle}</Text>
                                    </View>
                                    {/* Vertical Line */}
                                    <View style={tripPlanStyles.flatRenderItemVerticalLine}/>
                                </View>
                            )
                        }}

                        // Footer
                        // Bottom View
                        ListFooterComponent={
                            <View>
                                {/* For a new plan item button and text */}
                                <View style={tripPlanStyles.addPlanItemContainer}>
                                    <TouchableOpacity
                                        style={tripPlanStyles.addPlanItemSection}
                                        onPress={()=>
                                            this.props.navigation.navigate('PlanItem',
                                            {
                                                itemOperation: "add",
                                            })}
                                    >
                                        <MaterialIcons name="add-circle-outline" size={40} color={colors.primary} />
                                        <Text style={tripPlanStyles.addPlanItemSectionText}>Add a new plan item</Text>
                                    </TouchableOpacity>
                                </View>
                                {/* For Button */}
                                <View style={tripPlanStyles.bottomView}>
                                    <View style={tripPlanStyles.cancelContainer}>
                                        <TouchableOpacity 
                                            style={tripPlanStyles.buttonContainerCancel}
                                            onPress={this.onCancel}
                                        >
                                            <Text style={tripPlanStyles.buttonTextCancel}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity 
                                            style={tripPlanStyles.buttonContainer}
                                            onPress={this.onAddOrEdit}
                                        >
                                            <Text style={tripPlanStyles.buttonText}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }
                    />
                </View>

            </View>
        );
    }
}