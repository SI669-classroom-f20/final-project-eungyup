import firebase from 'firebase';
import '@firebase/firestore';
import '@firebase/storage';
import { firebaseConfig } from './Secrets';
import { TouchableHighlightBase } from 'react-native';

class DataModel {
    constructor() {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
        this.usersRef = firebase.firestore().collection('users');
        this.plansRef = firebase.firestore().collection('plans');
        this.storageRef = firebase.storage().ref();

        this.users = [];
        this.plans = [];
        // for picture object
        this.theImage = undefined;
        this.asyncInit();
    }

    asyncInit = async () => {
        this.loadUsers();
        this.loadPlans();
    }

    /*
    for Login
    */
    loadUsers = async () => {
        let querySnap = await this.usersRef.get();
        querySnap.forEach(qDocSnap => {
            let key = qDocSnap.id;
            let data = qDocSnap.data();
            data.key = key;
            this.users.push(data);
        });
    }

    getUsers = () => {
        return this.users;
    }

    // create a user account
    createUser = async (email, pass) => {
        // assemble the data structure
        let newUser = {
            email: email,
            password: pass,
        }

        // add the data to Firebase (user collection)
        let newUserDocRef = await this.usersRef.add(newUser);

        // get the new Firebase Id and save it as the local "key"
        let key = newUserDocRef.id;
        newUser.key = key;
        this.users.push(newUser);
        return newUser;
    }

    /*
    for Home
    */
    loadPlans = async () => {
        let querySnap = await this.plansRef.orderBy('tripStartDate','desc').get();

        querySnap.forEach(async qDocSnap => {
            let data = qDocSnap.data();
            data.key = qDocSnap.id;

            this.plans.push(data);
        });
    }

    getPlans = async (userId) => {
        // clear plans list first so that we do not get duplicated lists
        this.plans = [];

        await this.loadPlans();

        let specificUserPlans = [];
        let plansFound = false;

        for (let plan of this.plans) {
            if (plan.userId === userId) {
                specificUserPlans.push(plan);
                plansFound = true;
            }
        }
        if(plansFound){
            return specificUserPlans;
        }
    }

    // item is an object that contain all of plan fields
    addItem = async (item) => {
        if (item) { // false if undefined
            // add data to firebase first
            let data = item;
            let docRef = await this.plansRef.add(data);

            // add data to local data model
            // add data model's to key (that is same with firebase's id)
            data.key = docRef.id;
            this.plans.push(data);
            }
    }

    // item is an object that contain all of plan fields
    updateItem = async (item) => {
        let data = item;
        let docRef = this.plansRef.doc(item.key);
        await docRef.update(data);

        let plansList = this.plans;
        let foundIndex = -1;
        for (let idx in plansList){
            if(plansList[idx].key === item.key){
                foundIndex = idx;
                break;
            }
        }
        if (foundIndex !== -1){// silently fail if item not found
            plansList[foundIndex] = item;
        }
        this.plans = plansList;
    }

    deleteItem = async (itemKey) => {
        let docRef = this.plansRef.doc(itemKey);
        await docRef.delete();

        let plansList = this.plans;
        let foundIndex = -1;

        for (let idx in plansList){
            if(plansList[idx].key === itemKey){
                foundIndex = idx;
                break;
            }
        }

        if(foundIndex !== -1){// silently fail if item not found
            plansList.splice(foundIndex, 1) // remove one element
        }
        this.plans = plansList;
    }

    /*
    for TripPlanScreen
    */

    // update Image to Storage and return downloadURL
    updateImage = async (imageObject) => {
        //imageObject format: {uri: xxx, width: yyy, height: zzz}
        this.theImage = imageObject;

        // set up storage refs and download URL
        let fileName = '' + Date.now();
        let imageRef = this.storageRef.child(fileName);

        // fetch the image object from the local filesystem
        let response = await fetch(imageObject.uri);
        let imageBlob = await response.blob();

        // then upload it to Firebase Storage
        await imageRef.put(imageBlob);

        // to return downloadURL (so that we can store it to firebase firestore when adding or edting are called in HomeScreen (sending from TripPlanScreen))
        let downloadURL = await imageRef.getDownloadURL();
        imageObject.uri = downloadURL;

        return imageObject.uri;
    }
}

let theDataModel = undefined;

export function getDataModel() {
    if (!theDataModel) {
        theDataModel = new DataModel();
    }
    return theDataModel;
}