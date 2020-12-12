import firebase from 'firebase';
import '@firebase/firestore';
import '@firebase/storage';
import { firebaseConfig } from './Secrets';
import { TouchableHighlightBase } from 'react-native';

class DataModel {
    constructor() {
        if (firebase.apps.length === 0) { // aka !firebase.apps.length
            firebase.initializeApp(firebaseConfig);
        }
        this.usersRef = firebase.firestore().collection('users');
        this.plansRef = firebase.firestore().collection('plans');
        this.storageRef = firebase.storage().ref();
        // this.storageRef = firebase.storage().ref();
        this.users = [];
        // for plans collection that contian multiple users' plans
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

    // Create a user account

    createUser = async (email, pass) => {
        // assemble the data structure
        let newUser = {
            email: email,
            password: pass,
        }

        // add the data to Firebase (user collection)
        let newUserDocRef = await this.usersRef.add(newUser);

        // get the new Firebase ID and save it as the local "key"
        let key = newUserDocRef.id;
        newUser.key = key;
        this.users.push(newUser);
        return newUser;
    }

    /*
    for Home
    */

    loadPlans = async () => {
        console.log('(DataModel.js loadPlans()');
        let querySnap = await this.plansRef.orderBy('tripStartDate','desc').get();
        // (my check) I may not need async below
        querySnap.forEach(async qDocSnap => {
            let data = qDocSnap.data();
            data.key = qDocSnap.id;
            // let thisPlan = {
            //     key: qDocSnap.id,
            //     user: data.user,
            //     // plans: []
            // }
            // later add "plans" collection
            // let messageRef = qDocSnap.ref.collection("messages");
            // let messagesQSnap = await messageRef.get();
            // messagesQSnap.forEach(qDocSnap => {
            //     let messageData = qDocSnap.data();
            //     messageData.author = this.getUserForID(messageData.author);
            //     messageData.key = qDocSnap.id;
            //     thisChat.messages.push(messageData);
            // });
            this.plans.push(data);
            // this.plans.push(thisPlan);
            // console.log('trip: ', this.trips)
        });
        console.log('DataModel.js loadPlans this.plans', this.plans)
    }

    getPlans = async (userId) => {
        // look for this plan in the existing data model 'plans' array
        // if it's here, we know it's already in Firebase
        // console.log('(DataModel.js get plans(userid) -> userId: ', userId);
        // console.log('(DataModel.js get plans(userid) > this.plans: ', this.plans);
        // clear plans list not to get duplicated lists
        this.plans = [];

        await this.loadPlans();

        let specificUserPlans = [];
        let plansFound = false;

        for (let plan of this.plans) {
            // we need to use user keys to look for a match
            // and we need to check for each user in each position
            // console.log('userId: ', userId);
            // (my) in the future, may only need to get key insead of pushibng user object to Firebase
            // console.log('plan.userId', plan.userId);
            // (my) in the future, may only need to get key insead of pushibng user object to Firebase
            if (plan.userId === userId) {
                // console.log('(DataModel.js getPlans(userId) -> each plan',plan);
                specificUserPlans.push(plan); // if found, return it and we're done
                plansFound = true;
            }
            // return specificUserPlans;
        }
        if(plansFound){
            // userSpecificPlans is an array with plans objects related to the user
            return specificUserPlans;
        }

        // // plan not found, gotta create it. Create an object for the FB doc
        // let newPlanDocData = { user: user };
        // // add it to firebase
        // let newPlanDocRef = await this.plansRef.add(newPlanDocData);
        // // create a local plan object with full-fledged user objects (not just keys)
        // let newPlan = {
        //     // (my) in the future, may only need to get key insead of pushibng user object to Firebase
        //     user: user,
        //     key: newPlanDocRef.id, // use the Firebase ID
        //     planItems: []
        // }
        // // add it to the data model's chats, then return it
        // this.plans.push(newPlan);

        // // userSpecificPlans is an array with plans objects related to the user
        // specificUserPlans.push(newPlan);

        // return specificUserPlans;
    }

    // item is an object that contain all of plan fields
    addItem = async (item) => {
        if (item) { // false if undefined
            // Add data to firebase first
            let data = item;
            let docRef = await this.plansRef.add(data);

            // Add data to local data model (theList)
            // Add data model's to key (that is same with firebase's id)
            data.key = docRef.id;
            this.plans.push(data);
            }
    }

    // item is an object that contain all of plan fields
    updateItem = async (item) => {
        console.log('(DataModel.js updateItem(Item) item.key', item.key);
        let data = item;
        let docRef = this.plansRef.doc(item.key);
        await docRef.update(data);

        // (my) I may not below code to update plans becaues in the Home, it will get plans data after updating
        let plansList = this.plans;
        console.log('(DataModel.js updateItem(Item) plansList', plansList);
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
        // console.log('(DataModel.js updateItem(Item) this.plans', this.plans)
    }

    deleteItem = async (itemKey) => {
        let docRef = this.plansRef.doc(itemKey);
        await docRef.delete();

        // (my) I need below
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
        console.log('(DataModel.js deleteItem(itemKey) this.plans(new)', this.plans)
    }

    /*
    for TripPlanScreen
    */

    // Update Image to Storage and return downloadURL
    updateImage = async (imageObject) => {
        //imageObject format: {uri: xxx, width: yyy, height: zzz}
        console.log('DataModel.js updateImage(imageObject)', imageObject);

        this.theImage = imageObject;

        // Set up storage refs and download URL
        let fileName = '' + Date.now();
        let imageRef = this.storageRef.child(fileName);

        // fetch the image object from the local filesystem
        let response = await fetch(imageObject.uri);
        let imageBlob = await response.blob();

        // then upload it to Firebase Storage
        await imageRef.put(imageBlob);

        // to return downloadURL so that we can store it to firebase firestore when adding or edting called in HomeScreen (sending from TripPlanScreen)
        let downloadURL = await imageRef.getDownloadURL();
        imageObject.uri = downloadURL;
        console.log('DataModel.js updateImage(imageObject) new imageObject uri', imageObject.uri);

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