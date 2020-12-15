import React from 'react';
import { View, Text, Image, SectionList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { homeStyles, colors } from './Styles';
import { getDataModel } from './DataModel';
import Logo from './Logo'

export class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

        this.dataModel = getDataModel();
        if (this.props.route.params){
            this.userId = this.props.route.params.currentUser.key;
        }

        this.nextKey = 0;
        this.state = {
            theImage: require('./assets/ImageNotAvailable.png'),
            DATA: [],
        }
    }

    componentDidMount() {
        this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentWillUnmount() {
        this.focusUnsubscribe();
    }

    subscribeToPlan = async() => {
        this.state.DATA = [];
        // userSpecificPlans is an array with plans objects related to the user
        this.userSpecificPlans = await this.dataModel.getPlans(this.userId);

        if(this.userSpecificPlans){
            this.orderListByStatus(this.userSpecificPlans);
        }
        // when there is no item after deleting, clean the list
        else{
            let aCleanList = []
            this.setState({DATA: aCleanList});
        }
    }

    // added async here so that await add/update data first then get plans in the this.subscribeToPlan()
    onFocus = async () => {
        if (this.props.route.params) {
            const {operation, item} = this.props.route.params;
            // item is an object
            if (operation === 'add') {
                await this.dataModel.addItem(item);
            }
            else if (operation === 'edit') {
                await this.dataModel.updateItem(item);
            }
        }
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
            if(plan.tripStatus == 'onTrip'){
                onTripList.push(plan);
            }
            if(plan.tripStatus == 'upcoming'){
                upcomingList.push(plan);
            }
            if(plan.tripStatus == 'completed'){
                completedList.push(plan);
            }
        }

        if(onTripList.length){
            onTripObj = {title: "On Trip", data: onTripList};
            newData.push(onTripObj);
        }

        if(upcomingList.length){
            upcomingObj = {title: "Upcoming Trip", data: upcomingList};
            newData.push(upcomingObj);
        }

        if(completedList.length){
            completedObj = {title: "Completed", data: completedList};
            newData.push(completedObj);
        }

        this.setState({DATA: newData});
    }

    render() {
        return (
            <View style={homeStyles.container}>
                {/* Top */}
                <Logo/>

                <View style={homeStyles.scrollListContainer}>
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
                                                    <TouchableOpacity
                                                        onPress={() => {this.onEdit(item)}}
                                                    >
                                                        <MaterialIcons name="edit"
                                                            size={21}
                                                            color={colors.primary}
                                                            style={homeStyles.editIcon}
                                                            />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        // add cancel confirmation
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
                                                            }}
                                                    >
                                                        <Ionicons name="md-trash" 
                                                            size={21} 
                                                            color={colors.primary} />
                                                    </TouchableOpacity>
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
                    />
                </View>
            </View>
        );
    }
}