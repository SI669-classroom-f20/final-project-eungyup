import React from 'react';
import { View, Text, TextInput, Image, FlatList, TouchableOpacity, Alert, LogBox} from 'react-native';
import { FontAwesome ,FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
// for date picker
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from "moment";

import { tripPlanStyles, colors } from './Styles';

import { getDataModel } from './DataModel';
// for picture
import * as ImagePicker from 'expo-image-picker';

import Logo from './Logo'


export class TripPlanScreen extends React.Component {

    constructor(props) {
        super(props);

        // local dataModel
        this.dataModel = getDataModel();

        // initial setup
        let userId = '';
        let initTripTitle = '';
        let initTripCategory = '';
        let initTripStatus = 'upcoming';

        // for start date
        let initTripStartDateString = moment(new Date()).format('MM/DD/YYYY');
        // for Android, may not need this.props.date
        let initTripStartDate = this.props.date || new Date();
        let initTripStartShow = false;

        // for end date
        let initTripEndDateString = moment(new Date()).format('MM/DD/YYYY');
        // for Android, may not need this.props.date
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

            // this is for "add" from Home
            userId = this.props.route.params.userId;

            // this is for "edit" from Home
            if(this.props.route.params.operation === 'edit') {
                userId = this.props.route.params.item.userId;
                initTripTitle = this.props.route.params.item.tripTitle;
                initTripCategory = this.props.route.params.item.tripCategory;
                initTripStatus = this.props.route.params.item.tripStatus;

                // for start date
                initTripStartDateString = this.props.route.params.item.tripStartDateString;
                // due to complicated format, don't get tripStartDate (just use the default above is sufficient)

                // for end date
                initTripEndDateString = this.props.route.params.item.tripEndDateString;
                // due to complicated format, don't get tripStartDate (just use the default above is sufficient)

                initTotalBudget = this.props.route.params.item.totalBudget;
                initTotalSpending = this.props.route.params.item.totalSpending;
                initMoneyLeft = this.props.route.params.item.moneyLeft;

                initNotes = this.props.route.params.item.notes;

                initImageURL = this.props.route.params.item.imageURL;

                initPlanItems = this.props.route.params.item.planItems;
            }
        }

        this.state = {
            userId: userId,
            tripTitle: initTripTitle,
            tripCategory: initTripCategory,
            tripStatus: initTripStatus,

            // for start date
            tripStartDateString: initTripStartDateString,
            tripStartDate: initTripStartDate,
            tripStartShow: initTripStartShow,

            // for end date
            tripEndDateString: initTripEndDateString,
            tripEndDate: initTripEndDate,
            tripEndShow: initTtripEndShow,

            totalBudget: initTotalBudget,
            totalSpending: initTotalSpending,
            moneyLeft: initMoneyLeft,

            notes: initNotes,

            // for local picture  uri
            image: null,

            // for global picture uri (Firebase)
            imageURL: initImageURL,

            // plan items list
            planItems: initPlanItems,

            totalBudgetText: '(Once you add a budget in a plan item, the total budget will be updated automatically.)',
            totalSpendingText: '(Once you add a spending in a plan item, the total spending will be updated automatically.)',
            moneyLeftText: '(Once you add a budget and a spending in a plan item, the money left will be updated automatically.)'
        }
        // Because of passing a timestamp, it gives this log.
        // However, since this log doesn't affect the app function, make it ignore.
        LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
    }

    // componentDidMount for adding a new planItem
    componentDidMount() {
        this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentWillUnmount() {
        this.focusUnsubscribe();
    }

    onFocus = () => {
        if (this.props.route.params) {
            let itemOperation = this.props.route.params.itemOperation;
            let theItem = this.props.route.params.theItem;
            // item is an object
            if (itemOperation === 'add') {
                this.addItem(theItem);
            }
            if (itemOperation === 'edit') {
                this.updateItem(theItem);
            }
        }
        this.calculateMoney();
        this.props.navigation.setParams({itemOperation: 'none'});
    }

    addItem = (theItem) => {
        let newList = this.state.planItems;
        newList.push(theItem);
        this.setState({planItems: newList});
    }

    updateItem = (theItem) => {
        let newList = this.state.planItems;
        let foundIndex = -1;

        for (let idx in newList){
            if(newList[idx].itemKey === theItem.itemKey){
                foundIndex = idx;
                break;
            }
        }

        if(foundIndex !== -1){
            newList[foundIndex] = theItem;
        }

        this.setState({planItems: newList});
    }

    calculateMoney = () => {
        let theBudget = 0;
        let theSpending = 0 ;
        let theMoneyLeft = 0;

        let newList = this.state.planItems;

        for(let item of newList){
            theBudget += Number(item.itemBudget);
            theSpending += Number(item.itemSpending);
            theMoneyLeft = Number(theBudget - theSpending);
        }

        this.setState({totalBudget: theBudget, totalSpending: theSpending, moneyLeft: theMoneyLeft});
    }

    onChangeStartDate = (event, selectedDate) => {
        this.setState(
            {
                tripStartDateString: moment(selectedDate).format('MM/DD/YYYY'),
                tripStartDate: selectedDate,
                tripStartShow: false,
                // Because the end date should be on or after the start date, set the end date to match the start date when a user adds a start date
                tripEndDateString: moment(selectedDate).format('MM/DD/YYYY'),
                tripEndDate: selectedDate,
                tripEndShow: false
            });
    }

    onChangeEndDate = (event, selectedDate) => {
        this.setState({tripEndDateString: moment(selectedDate).format('MM/DD/YYYY'), tripEndDate: selectedDate, tripEndShow: false});
    }

    onCancel = () => {
        this.props.navigation.navigate("Home");
    }

    onAddOrEdit = () => {
        let theItem = {};
        if(this.operation === 'add'){
            theItem = {
                userId: this.state.userId,
                tripTitle: this.state.tripTitle,
                tripCategory: this.state.tripCategory,
                tripStatus: this.state.tripStatus,

                // for start date
                tripStartDateString: this.state.tripStartDateString,
                tripStartDate: this.state.tripStartDate,

                // for end date
                tripEndDateString: this.state.tripEndDateString,
                tripEndDate: this.state.tripEndDate,

                totalBudget: this.state.totalBudget,
                totalSpending: this.state.totalSpending,
                moneyLeft: this.state.moneyLeft,
                notes: this.state.notes,

                imageURL: this.state.imageURL,

                planItems: this.state.planItems,
            }
        }
        else {
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
        // ratio for vertical and horizontal
        aspect: [4, 3],
        quality: 1,
        });

        if (!result.cancelled) {
        this.setState({image: result.uri});
        }

        // update to firebase storage
        let firebaseStorageURI = await this.dataModel.updateImage(result);

        this.setState({imageURL: firebaseStorageURI});
    };

    onEdit = (item) => {
        this.props.navigation.navigate("PlanItem",{
            itemOperation: 'edit',
            theItem: item
        })
    }

    deleteItem = (itemKey) => {
        let newList = this.state.planItems;
        let foundIndex = -1;

        for(let idx in newList){
            if(newList[idx].itemKey === itemKey){
                foundIndex = idx;
                break;
            }
        }

        if (foundIndex !== -1){
            newList.splice(foundIndex,1); // remove one element
        }

        this.setState({planItems: newList});
    }

    onDelete = (itemKey) => {
        this.deleteItem(itemKey);
    }

    onDeletePicture = () =>{
        this.setState({imageURL: null, image: null});
    }

    render() {
        return (
            <View style={tripPlanStyles.container}>
                {/* Top */}
                <Logo/>

                <View style={tripPlanStyles.flatListContainer}>
                    <FlatList
                        data={this.state.planItems}
                        // Header
                        ListHeaderComponent={
                            <View>
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
                                            {/* Code Reference for date picker from https://medium.com/@jethro.riosa/implementation-of-react-native-community-datetimepicker-3acf4b69f5 */}
                                            <View style={tripPlanStyles.datePickerContainer}>
                                                <TouchableOpacity onPress={()=> this.setState({tripStartShow: true})} style={tripPlanStyles.inputContainerStyle}>
                                                    {/* on android, may not need  <Text style={styles.placeholderStyle}>{this.props.placeholder}</Text>
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
                                            {/* Code Reference for date picker from https://medium.com/@jethro.riosa/implementation-of-react-native-community-datetimepicker-3acf4b69f5 */}
                                            <View style={tripPlanStyles.endDatePickerContainer}>
                                                <TouchableOpacity onPress={()=> this.setState({tripEndShow: true})} style={tripPlanStyles.inputContainerStyle}>
                                                    {/* on android, may not need  <Text style={styles.placeholderStyle}>{this.props.placeholder}</Text>
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
                                        <View>
                                            <View style={tripPlanStyles.moneyContainer}>
                                                <Text style={tripPlanStyles.moneyText}>Total Budget: </Text>
                                                <Text style={tripPlanStyles.numberText}>$ {this.state.totalBudget}</Text>
                                            </View>
                                            <View style={tripPlanStyles.moneyDefaultContainer}>
                                                <Text style={tripPlanStyles.moneyDescriptions}>{this.state.totalBudgetText}</Text>
                                            </View>
                                        </View>

                                        {/* Total Spending */}
                                        <View>
                                            <View style={tripPlanStyles.moneyContainer}>
                                                    <Text style={tripPlanStyles.moneyText}>Total Spending: </Text>
                                                    <Text style={tripPlanStyles.numberText}>$ {this.state.totalSpending}</Text>
                                            </View>
                                            <View style={tripPlanStyles.moneyDefaultContainer}>
                                                <Text style={tripPlanStyles.moneyDescriptions}>{this.state.totalSpendingText}</Text>
                                            </View>
                                        </View>

                                        {/* MoneyLeft */}
                                        <View>
                                            <View style={tripPlanStyles.moneyContainer}>
                                                    <Text style={tripPlanStyles.moneyText}>Money Left: </Text>
                                                    <Text style={tripPlanStyles.numberText}>$ {this.state.moneyLeft}</Text>
                                            </View>
                                            <View style={tripPlanStyles.moneyDefaultContainer}>
                                                <Text style={tripPlanStyles.moneyDescriptions}>{this.state.moneyLeftText}</Text>
                                            </View>
                                        </View>

                                        {/* Notes */}
                                        <View style={tripPlanStyles.notesContainer}>
                                            <Text style={tripPlanStyles.notesText}>Notes: </Text>
                                            <View style={tripPlanStyles.notesTextInputContainer}>
                                                <TextInput
                                                    style={tripPlanStyles.notesInputText}
                                                    placeholder='Add your notes'
                                                    value={this.state.notes}
                                                    keyboardType={"default"}
                                                    multiline={true}
                                                    underlineColorAndroid='transparent'
                                                    onChangeText={(text)=>{this.setState({notes: text})}}
                                                />
                                            </View>
                                        </View>

                                        {/* Picture */}
                                        <View style={tripPlanStyles.pictureContainer}>
                                        {this.props.route.params.operation === 'edit' && this.props.route.params.item.imageURL || this.state.image?
                                            <View style={tripPlanStyles.editOrDeleteIconContainer}>
                                                <Text style={tripPlanStyles.pictureText}>Picture: </Text>
                                                <View style={tripPlanStyles.editOrDeleteIconContainer}>
                                                            <TouchableOpacity
                                                                onPress={this.pickImage}
                                                            >
                                                                <MaterialIcons name="edit"
                                                                    size={21}
                                                                    color={colors.primary}
                                                                    style={tripPlanStyles.editIcon}
                                                                    />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={()=>{
                                                                    Alert.alert(
                                                                        'Delete Picture',
                                                                        'Are you sure you want to delete the picture?',
                                                                        [
                                                                            { text: 'Cancel', style: 'cancel' },
                                                                            { text: "Delete", onPress: ()=> this.onDeletePicture()}
                                                                        ]
                                                                    );
                                                                    }}
                                                            >
                                                                <Ionicons name="md-trash"
                                                                    size={21}
                                                                    color={colors.primary} />
                                                            </TouchableOpacity>
                                                </View>
                                            </View>
                                            :
                                            <View>
                                                <Text style={tripPlanStyles.pictureText}>Picture: </Text>
                                            </View>
                                        }
                                            {this.props.route.params.operation === 'edit' && this.state.imageURL?
                                                <View style={tripPlanStyles.imageContainer}>
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

                                    {/* Plan Items Section (just its header) */}
                                    <View style={tripPlanStyles.tripSnapshotContainer}>
                                        <Text style={tripPlanStyles.tripheaderText}>Plan Items</Text>
                                    </View>
                                </View>
                            </View>
                        }
                        keyExtractor={item => item.itemKey}
                        renderItem={({item}) => {
                            return(
                                <View>
                                    <View style={tripPlanStyles.flatRenderItemContainer}>
                                        <FontAwesome name="circle" size={40} color={colors.primary} />
                                        <Text style={tripPlanStyles.flatRenderText}>{item.itemTitle}</Text>
                                        <TouchableOpacity
                                            onPress={() => {this.onEdit(item)}}
                                        >
                                            <MaterialIcons name="edit"
                                                size={21}
                                                color={colors.primary}
                                                style={tripPlanStyles.editIcon}
                                                />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            // add cancel confirmation
                                            onPress={()=>{
                                                let itemTitle = item.itemTitle;
                                                Alert.alert(
                                                    'Delete Item?',
                                                    'Are you sure you want to delete "'+ itemTitle + '"?',
                                                    [
                                                    {text: "Cancel", style:"cancel"},
                                                    {text: "Delete", onPress: ()=> this.onDelete(item.itemKey)}
                                                    ],
                                                    {cancelable: false}
                                                )
                                                }}
                                        >
                                            <Ionicons name="md-trash"
                                                size={21}
                                                color={colors.primary}
                                                />
                                            </TouchableOpacity>
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
                                {/* For a new plan item's add button and text */}
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
                                {/* For a save and cancel buttons */}
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