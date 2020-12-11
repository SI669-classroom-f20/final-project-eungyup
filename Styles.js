import { StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';

// For top status bar styles
import Constants from "expo-constants";

export const colors = {
    primary: '#3D90E3', 
    primaryDark: '#2B7EB2', // MD Brown 300
    // primaryLight: '#E8EAF6', // MD Amber 200
    outline: '#828282' // MD Gray 400
}

export const fontSizes = {
    small: 12,
    regular: 15,
    large: 20,
    extraLarge: 40,
}

export const logoStyles = StyleSheet.create({
    topView: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 40,
    },
    logoImage: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 197,
        height: 53,
        resizeMode: 'contain'
    },
})

export const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
        // marginTop: Constants.statusBarHeight,
    },
        contentView: {
            flex: 9,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 30,
        },
            welcomeText: {
                fontSize: fontSizes.extraLarge,
                color: colors.primary,
                paddingBottom: 50,
            },
            inputRow: {
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingBottom: 20
            },
            inputText: {
                flex: 0.7,
                borderColor: colors.outline,
                paddingLeft: 14,
                fontSize: 18,
                borderWidth: 1,
                padding: 10,
            },
            bottomView: {
                flex: 2.5,
                // flexDirection: 'column',
                width: '100%',
                alignItems: 'center'
            },
                buttonContainer: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.outline,
                    borderRadius: 8,
                    backgroundColor: colors.primary,
                    width: '73%',
                    height: 47,
                    marginTop: 50,
                    marginBottom: 30,
                },
                    buttonText: {
                        textAlign: 'center',
                        color: 'white',
                        fontSize: fontSizes.large,
                        paddingVertical: 12,
                    },
                bottomTextContainer:{
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                    bottomQuestionText: {
                        color: colors.outline,
                        fontSize: fontSizes.regular,
                    },
                    bottomLinkText: {
                        paddingTop: 10,
                        color: colors.primary,
                        fontSize: fontSizes.regular,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }
})

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: Constants.statusBarHeight,
    },
    scrollListContainer:{
        flex: 1,
        // fontSize: fontSizes.extraLarge,
    },
    separator: {
        width: '90%',
        alignSelf: 'center',
        // height: 5,
        borderBottomWidth: 2,
        borderColor: colors.outline,
        marginTop: 20,
        marginBottom: 30,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        // Box shadow for Android
        elevation: 2,
    },
    headerContainer:{
        marginBottom: 15,
        // borderTopWidth: 5,
        // borderColor: colors.primary
        // width: '80%',
        // backgroundColor: colors.primary
    },
        headerText: {
            fontSize: fontSizes.large,
            fontWeight: 'bold',
            // paddingBottom: 10,
        },
        contentView: {
            flex: 9,
            // justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 30,
        },
            defaultBoxContainer: {
                width: 300,
                height: 273,
                marginBottom: 20,
                borderWidth: 0.1,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                // Box shadow for Android
                elevation: 2,
            },
            mainBoxContainer: {
                height: 277,
                paddingTop: 25,
                paddingHorizontal: 25,
                // alignItems: 'center',
            },
                defaultExplain:{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginTop: 80,
                },
                    defaultText: {
                        fontSize: fontSizes.regular,
                        color: colors.outline,
                        paddingLeft: 20,
                        width: 130,
                        height: 40,
                    },
                defaultButton: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 35,
                },
                pictureDefualtContainer: {
                    width: 240,
                    height: 180,
                    borderWidth: 1,
                    borderRadius: 8,
                },
                pictureContainer: {
                    width: 240,
                    height: 180,
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // borderWidth: 0.2,
                    borderRadius: 8,
                    alignSelf: 'center'
                },
                imageDefaultStyle: {
                        flex: 1,
                        justifyContent: 'center',
                        // Because the "aspect: [4:3]" in the "picImage" method in the TripPlan Screen,
                        // -> make it 
                        // width: 240,
                        // height: 180,
                        // (4:3)
                        width: 238,
                        height: 180,
                        resizeMode: 'contain',
                    },
                    imageStyle: {
                        flex: 1,
                        justifyContent: 'center',
                        // Because the "aspect: [4:3]" in the "picImage" method in the TripPlan Screen,
                        // -> make it 
                        // width: 240,
                        // height: 180,
                        // (4:3)
                        width: 238,
                        height: 180,
                        resizeMode: 'contain',
                        // borderWidth: 1,
                        borderRadius: 8,
                    },
                tripTitleContainer: {
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                },
                    tripTitleText:{
                        fontSize: fontSizes.regular,
                    },
                    editOrDeleteIconContainer:{
                        flexDirection: 'row',
                    },
                        editIcon: {
                            paddingRight: 10,
                        }
})

export const tripPlanStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        justifyContent: 'center',
        // marginTop: Constants.statusBarHeight,
    },
    scrollViewTest:{
        backgroundColor: 'cornsilk',
        // height: 1000,
        // flex: 7
    },
    flatListContainer:{
        flex: 1,
        fontSize: fontSizes.extraLarge,
    },
        contentView: {
            flex: 9,
            // justifyContent: 'center',
            // alignItems: 'center',
            width: '100%',
            marginTop: 30,
        },
            tripInfoContainer: {
                flexDirection: 'row',
                paddingLeft: 25,
                marginBottom: 10,
            },
                tripInfoText: {
                    fontSize: fontSizes.large,
                },
                inputText: {
                    flex: 0.8,
                    borderColor: colors.outline,
                    paddingLeft: 5,
                    fontSize: fontSizes.regular,
                    borderBottomWidth: 1,
                    // padding: 10,
                },
            tripStatusContainer: {
                paddingLeft: 25,
                marginTop: 20,
            },
                tripheaderText: {
                    fontSize: fontSizes.large,
                    fontWeight: 'bold',
                    marginBottom: 10,
                },
                    tripStatusRadioContainer: {
                        flexDirection: 'row',
                        alignItems: 'center',
                    },
                        tripStatusRadioText: {
                            fontSize: fontSizes.regular,
                            paddingLeft: 5,
                        },
            tripSnapshotContainer: {
                paddingLeft: 25,
                marginTop: 30,
            },
                dateContainer: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                    marginLeft: 5,
                    marginBottom: 10,
                },
                    dateText: {
                        fontSize: fontSizes.regular,
                    },
                    endDateText: {
                        fontSize: fontSizes.regular,
                        paddingRight: 30,
                    },
                    datePickerContainer: {
                        marginLeft: 5,
                        flexDirection: 'row',
                        alignItems: 'center'
                    },
                    endDatePickerContainer:{
                        marginLeft: 11,
                        flexDirection: 'row',
                        alignItems: 'center'
                    },
                        inputContainerStyle: {
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: '#CAD3DF',
                            borderRadius: 5,
                            // marginVertical: 10,
                            // marginHorizontal: 10,
                            paddingRight: 10,
                            height: 40,
                        },
                            placeholderStyle: {
                                fontSize: fontSizes.regular,
                                color: '#CDCDCD',
                                marginHorizontal: 10,
                            },
                            textStyle: {
                            //   fontFamily: 'Gill Sans',
                                fontSize: fontSizes.regular,
                                marginHorizontal: 10,
                            },
                        calendarIcon:{
                            paddingLeft: 10,
                        },
                moneyDefaultContainer:{
                    marginLeft: 5,
                    marginBottom: 12,
                },
                moneyContainer: {
                    marginTop: 10,
                    marginLeft: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                },
                    moneyText: {
                        fontSize: fontSizes.regular,
                    },
                    moneyDescriptions: {
                        width: '90%',
                        fontSize: fontSizes.small,
                        color: colors.outline,
                    },
                    numberText: {
                        fontSize: fontSizes.regular,
                        paddingLeft: 5,
                    },
                    notesContainer: {
                        marginBottom: 12,
                        marginLeft: 5,
                    },
                    notesText: {
                        fontSize: fontSizes.regular,
                        paddingBottom: 5,
                    },
                        notesInputText: {
                            flex: 0.7,
                            // width: 250,
                            height: 180,
                            width: 300,
                            borderColor: colors.outline,
                            paddingLeft: 5,
                            fontSize: fontSizes.regular,
                            borderWidth: 1,
                            borderRadius: 8,
                            textAlignVertical: "top"
                        },
                    pictureContainer: {
                        marginBottom: 12,
                        marginLeft: 5,
                    },
                        pictureText: {
                            fontSize: fontSizes.regular,
                            paddingBottom: 5,
                        },
                        imageDefaultParentContainer: {
                            // Because the "aspect: [4:3]" in the "picImage" method in the TripPlan Screen,
                            // -> make it 
                            // width: 240,
                            // height: 180,
                            // (4:3)
                            width: 240,
                            height: 180,
                            borderWidth: 0.6,
                            borderRadius: 8,
                            color: colors.outline,
                            padding: 0,
                            // alignItems: 'flex-start',
                        },
                        imageContainer: {
                            // Because the "aspect: [4:3]" in the "picImage" method in the TripPlan Screen,
                            // -> make it
                            // width: 240,
                            // height: 180,
                            // (4:3)
                            width: 240,
                            height: 180,
                        },
                            imageStyle: {
                                flex: 1,
                                justifyContent: 'flex-start',
                                // Because the "aspect: [4:3]" in the "picImage" method in the TripPlan Screen,
                                // -> make it 
                                // width: 240,
                                // height: 180,
                                // (4:3)
                                width: 240,
                                height: 180,
                                resizeMode: 'contain',
                                borderWidth: 1,
                                borderRadius: 8,
                            },

                            imageDefaultContainer: {
                                alignItems: 'center',
                            },
                                imageDefaultText:{
                                    fontSize: fontSizes.regular,
                                    color: colors.outline,
                                    paddingTop: 40,
                                    paddingBottom: 20,
                                },
            flatRenderItemContainer: {
                marginLeft: 33,
                flexDirection: 'row',
                alignItems: 'center',
            },
            editIcon: {
                paddingLeft: 20,
                paddingRight: 10,
            },
                flatRenderText: {
                    paddingLeft: 12,
                    fontSize: fontSizes.regular,
                },
            flatRenderItemVerticalLine: {
                borderLeftWidth: 5,
                height: 20,
                marginLeft: 47,
                marginVertical: 0,
                borderLeftColor: colors.primary,

            },
            addPlanItemContainer: {
                marginLeft: 30,
            },
            addPlanItemSection: {
                flexDirection: 'row',
                alignItems: 'center',
            },
                addPlanItemSectionText: {
                    paddingLeft: 10,
                    fontSize: fontSizes.regular,
                    color: colors.outline,
                },
            bottomView: {
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
            },
            cancelContainer: {
                marginRight: 25,
            },
            buttonContainerCancel: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.outline,
                    borderRadius: 8,
                    backgroundColor: colors.outline,
                    width: 81,
                    height: 50,
                    marginTop: 50,
                    marginBottom: 30,
                },
                buttonTextCancel: {
                        textAlign: 'center',
                        color: 'white',
                        fontSize: fontSizes.regular,
                        padding: 12,
                    },
                buttonContainer: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.outline,
                    borderRadius: 8,
                    backgroundColor: colors.primary,
                    width: 81,
                    height: 47,
                    marginTop: 50,
                    marginBottom: 30,
                },
                    buttonText: {
                        textAlign: 'center',
                        color: 'white',
                        fontSize: fontSizes.regular,
                        paddingVertical: 12,
                    },
})

export const planItemStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // marginTop: Constants.statusBarHeight,
    },
    flatListContainer:{
        // flex: 3,
        fontSize: fontSizes.extraLarge,
    },
        contentView: {
            flex: 1,
            // justifyContent: 'center',
            // alignItems: 'center',
            width: '100%',
            marginTop: 30,
        },
            planItemInfoContainer: {
                flexDirection: 'row',
                paddingLeft: 25,
                marginBottom: 10,
            },
                planItemInfoText: {
                    fontSize: fontSizes.large,
                },
                planItemInputText: {
                    flex: 0.8,
                    borderColor: colors.outline,
                    paddingLeft: 5,
                    fontSize: fontSizes.regular,
                    borderBottomWidth: 1,
                    // padding: 10,
                },
                inputText: {
                    flex: 0.25,
                    borderColor: colors.outline,
                    paddingLeft: 5,
                    fontSize: fontSizes.regular,
                    borderBottomWidth: 1,
                    // padding: 10,
                },
                planItemHeaderText: {
                    fontSize: fontSizes.large,
                    fontWeight: 'bold',
                    marginBottom: 10,
                },
                    tripStatusRadioContainer: {
                        flexDirection: 'row',
                        alignItems: 'center',
                    },
                        tripStatusRadioText: {
                            fontSize: fontSizes.regular,
                            paddingLeft: 5,
                        },
            planItemSnapshotContainer: {
                paddingLeft: 25,
                marginTop: 30,
            },
                dateContainer: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                    marginLeft: 5,
                    marginBottom: 10,
                },
                endDateContainer:{
                    marginBottom: 12,
                },
                    dateText: {
                        fontSize: fontSizes.regular,
                    },
                    endDateText: {
                        fontSize: fontSizes.regular,
                        paddingRight: 30,
                    },
                    datePickerContainer: {
                        marginLeft: 5,
                        flexDirection: 'row',
                        alignItems: 'center'
                    },
                    endDatePickerContainer:{
                        marginLeft: 11,
                        flexDirection: 'row',
                        alignItems: 'center'
                    },
                        inputContainerStyle: {
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: '#CAD3DF',
                            borderRadius: 5,
                            // marginVertical: 10,
                            // marginHorizontal: 10,
                            paddingRight: 10,
                            height: 40,
                        },
                            placeholderStyle: {
                                fontSize: fontSizes.regular,
                                color: '#CDCDCD',
                                marginHorizontal: 10,
                            },
                            textStyle: {
                            //   fontFamily: 'Gill Sans',
                                fontSize: fontSizes.regular,
                                marginHorizontal: 10,
                            },
                        calendarIcon:{
                            paddingLeft: 10,
                        },
                moneyDefaultContainer:{
                    marginLeft: 5,
                    marginBottom: 12,
                },
                moneyContainer: {
                    marginBottom: 15,
                    marginLeft: 5,
                    flexDirection: 'row',
                    // alignItems: 'center',
                },
                    moneyText: {
                        fontSize: fontSizes.regular,
                        paddingRight: 3,
                    },
                    defaultNumberText: {
                        width: '90%',
                        fontSize: fontSizes.small,
                        color: colors.outline,
                    },
                    numberText: {
                        fontSize: fontSizes.regular,
                        paddingLeft: 5,
                    },
                    notesContainer: {
                        // marginTop: 12,
                        marginLeft: 5,
                    },
                    notesText: {
                        fontSize: fontSizes.regular,
                        paddingBottom: 10,
                    },
                        notesInputText: {
                            flex: 0.7,
                            // width: 250,
                            height: 180,
                            width: 300,
                            borderColor: colors.outline,
                            paddingLeft: 5,
                            fontSize: fontSizes.regular,
                            borderWidth: 1,
                            borderRadius: 8,
                            textAlignVertical: "top"
                        },
        bottomView: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
        },
        cancelContainer: {
            marginRight: 25,
        },
        buttonContainerCancel: {
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.outline,
                borderRadius: 8,
                backgroundColor: colors.outline,
                width: 81,
                height: 50,
                marginTop: 50,
                marginBottom: 30,
            },
            buttonTextCancel: {
                    textAlign: 'center',
                    color: 'white',
                    fontSize: fontSizes.regular,
                    padding: 12,
                },
            buttonContainer: {
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.outline,
                borderRadius: 8,
                backgroundColor: colors.primary,
                width: 81,
                height: 47,
                marginTop: 50,
                marginBottom: 30,
            },
                buttonText: {
                    textAlign: 'center',
                    color: 'white',
                    fontSize: fontSizes.regular,
                    paddingVertical: 12,
                },
})