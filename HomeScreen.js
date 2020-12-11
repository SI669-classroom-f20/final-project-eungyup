import React from 'react';
import { StyleSheet, TextInput, Text, View, Image, SectionList, FlatList, TouchableOpacity, Alert, KeyboardAvoidingView, LogBox } from 'react-native';
import { Ionicons, MaterialIcons ,MaterialCommunityIcons } from '@expo/vector-icons';

import { homeStyles, colors } from './Styles';
import { getDataModel } from './DataModel';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import Logo from './Logo'

export class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

        // console.log("in HomeScreen, route.params = ", props.route.params);


        // let initList = [];
        // for (let i = 0; i <40; i++){
        //     initList.push({
        //         text: 'item' + i,
        //         key: '' + i
        //     });
        // }

        this.dataModel = getDataModel();
        if (this.props.route.params){
            // console.log("in HomeScreen, this.props.route.params.currentUser", this.props.route.params.currentUser);
            this.userId = this.props.route.params.currentUser.key;
        }


        this.nextKey = 0;
        this.state = {
            // user: this.props.route.params.currentUser,
            theList: [],
            theImage: require('./assets/ImageNotAvailable.png'),

            DATA: [],
        }

        // (my) just ignore the warnign sign
        // Becuase this log doesn't affect the app function, make it ignore
        LogBox.ignoreLogs(['Setting a timer']);
    }

    componentDidMount() {
        // create or get data from firebase
        // this.getListItems();
        // this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);

        // because we need to wait to getOrCreate trip and get a trip data, use async, await
        // in componentDidMount() => we cannot use async so create a new function
        // this.subscribeToPlan();

        this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentWillUnmount() {
        this.focusUnsubscribe();
    }

    subscribeToPlan = async() => {
        // userSpecificPlans is an array with plans objects related to the user
        // first clear the theList (otherwise get duplicate lists)
        this.state.theList = [];
        this.userSpecificPlans = await this.dataModel.getPlans(this.userId);
        console.log('(home)this.userSpecificPlans', this.userSpecificPlans);

        if(this.userSpecificPlans){
            this.orderListByStatus(this.userSpecificPlans);
            // let orderedByStatusList = this.orderListByStatus(this.userSpecificPlans);

            // this.setState({theList: orderedByStatusList})
            // // this.setState({theList: this.userSpecificPlans});
            // console.log('(home) theList', this.state.theList);
        }
        // when there is no item after deleting => clean the list
        else{
            let aCleanList = []
            this.setState({theList: aCleanList});
        }
    }

    // (my) added async to add/update data first then get plans in the this.subscribeToPlan()
    onFocus = async () => {
        if (this.props.route.params) {
            const {operation, item} = this.props.route.params;
            // item is an object
            if (operation === 'add') {
                console.log('(Home Screen onFouce add -> item', item);
                await this.dataModel.addItem(item);
            } 
            else if (operation === 'edit') {
                console.log('(Home Screen onFouce edit -> item', item);
                await this.dataModel.updateItem(item);
            }
        }
        // (my) to get an updated plans by ordered by tripStartDate call getDataModel one more time
        // this.dataModel = await getDataModel();
        this.subscribeToPlan();
        this.props.navigation.setParams({operation: 'none'});
    }

    onEdit = (item) => {
        this.props.navigation.navigate("TripPlan",{
            operation: 'edit',
            item: item
        })
    }

    onDelete = async (itemKey) => {
        await this.dataModel.deleteItem(itemKey);
        this.subscribeToPlan();
    }

    orderListByStatus = (userSpecificPlans) =>{
        let onTripList = [];
        let upcomingList = [];
        let completedList = [];

        let onTripObj = {};
        let upcomingObj = {};
        let completedObj = {};

        let newData = [];

        for(let plan of userSpecificPlans){
            // console.log('(Home orderListByStatus', plan);
            if(plan.tripStatus == 'onTrip'){
                onTripList.push(plan);
            }
            if(plan.tripStatus == 'upcoming'){
                upcomingList.push(plan);
            }
            if(plan.tripStatus == 'completed'){
                completedList.push(plan);
            }
            // console.log('(Home orderListByStatus onTripList', onTripList);
        }

        if(onTripList.length){
            console.log('onTripList.length', onTripList.length);
            onTripObj = {title: "On Trip", data: onTripList};
            console.log('onTripObj', onTripObj);

            newData.push(onTripObj);
        }

        if(upcomingList.length){
            console.log('upcomingList.length', upcomingList.length);
            upcomingObj = {title: "Upcoming Trip", data: upcomingList};
            console.log('upcomingObj', upcomingObj);

            newData.push(upcomingObj);
        }

        if(completedList.length){
            console.log('completedList.length', completedList.length);
            completedObj = {title: "Completed", data: completedList};
            console.log('upcomingObj', upcomingObj);

            newData.push(completedObj);
        }

        console.log('newData', newData);
        this.setState({DATA: newData});

        console.log('this.state.DATA', this.state.DATA);
        // combinedArray.push(...onTripList, ...upcomingList, ...completed);
        // console.log('(Home orderListByStatus combinedArray', combinedArray);

        // return combinedArray;
    }


    render() {
        return (
            <View style={homeStyles.container}>
                {/* Top */}
                <Logo/>
                {/*  Flatlist */}
                <View style={homeStyles.flatListContainer}>
                    <SectionList
                        sections={this.state.DATA}

                        // Header
                        ListHeaderComponent={
                            <View style={homeStyles.test}>

                                {/* Content */}
                                <View style={homeStyles.contentView}>
                                    <View style={homeStyles.defaultBoxContainer}>
                                        <View style={homeStyles.defaultExplain}>
                                            <Ionicons name="md-journal" size={35} color={colors.primary}/>
                                            <Text style={homeStyles.defaultText}>Let's plan a new journey today!</Text>
                                        </View>
                                        <View >
                                            <TouchableOpacity
                                                style={homeStyles.defaultButton}
                                                onPress={()=>
                                                    this.props.navigation.navigate('TripPlan', 
                                                    {
                                                        operation: "add",
                                                        userId: this.userId
                                                    })}
                                            >
                                                <MaterialIcons name="add-circle-outline" size={60} color={colors.primary} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        }
                        keyExtractor={(item, index) => item.tripTitle + index}
                        renderItem={({item}) => {
                            console.log('item', item);
                            console.log('item.tripStatus', item.tripStatus);
                            // console.log("on the top asjdlfkjsadlkfjlasjdfl˚å∆ß¬ƒ˚jlksa");
                                return(
                                    <View >
                                        {/* Individual Tile */}
                                        <View style={[homeStyles.defaultBoxContainer, homeStyles.mainBoxContainer]}>
                                            <View style={item.imageURL ? homeStyles.pictureContainer : homeStyles.pictureDefualtContainer}>

                                                {item.imageURL ?
                                                    <Image
                                                        source={{uri: item.imageURL}}
                                                        style={homeStyles.imageStyle}
                                                    />
                                                :
                                                    <Image
                                                        source={this.state.theImage}
                                                        style={homeStyles.imageDefaultStyle}
                                                    />
                                                }

                                            </View>
                                            <View style={homeStyles.tripTitleContainer}>
                                                <Text style={homeStyles.tripTitleText}>{item.tripTitle}</Text>
                                                <View style={homeStyles.editOrDeleteIconContainer}>
                                                    <MaterialIcons name="edit"
                                                        size={21}
                                                        color={colors.primary}
                                                        style={homeStyles.editIcon} 
                                                        onPress={() => {this.onEdit(item)}}
                                                        />
                                                    <Ionicons name="md-trash" 
                                                        size={21} 
                                                        color={colors.primary}
                                                        // Add Cancel Confirmation
                                                        onPress={()=>{
                                                        let tripTitle = item.tripTitle;
                                                        Alert.alert(
                                                            'Delete Item?',
                                                            'Are you sure you want to delete "'+ tripTitle + '"?',
                                                            [
                                                            {text: "Cancel", style:"cancel"},
                                                            {text: "Delete", onPress: ()=> this.onDelete(item.key)}
                                                            ],
                                                            {cancelable: false}
                                                        )
                                                        }} />
                                                </View>
                                            </View>
                                            <View>
                                                    <Text>{item.tripStartDateString} - {item.tripEndDateString}</Text>
                                            </View>

                                        </View>
                                    </View>
                                )
                        }
                    }
                    renderSectionHeader={({ section: { title } }) => (
                        <View>
                            <View style={homeStyles.separator}/>
                            <View style={homeStyles.headerContainer}>
                                <Text style={homeStyles.headerText}>{title}</Text>
                            </View>
                        </View>
                    )}
                    // ItemSeparatorComponent={()=>(
                    //     <View style={homeStyles.separator}/>
                    // )}
                    />
                </View>



            </View>

        );
    }
}