# SI 669 Final Project - Your Trip Mate App
Your Trip Mate is a trip assistant mobile application developed with React Native, Expo, and Google Firebase.


## Target Audience
Young adults (18-24) who often travel with a tight budget

## Current Problem 
When the target audience travels, they often need to store their trip information in separate places. For example, they may put budget and spending information in the excel sheet (or Google Sheets), store pictures in the local phone gallery, and write notes or journals in the physical notebook. Also, since young adults tend to have a tight budget, they may need to track their spendings and check how much money is left frequently.

## Solution
I developed a “Your Trip Mate (YTM)” app in which a user can plan for a trip, record the trip memory (pictures, notes, plan, budget, etc), and check previous trips. The app will be beneficial to the users because it stores all information related to the trip in one digital place. Also, for users who need to track their spendings frequently, the app will calculate and display how much money is left automatically based on their budget and their spendings. In addition, the app is great for users because it lets users store their information in the cloud (Google Firebase) which leads to less worry about losing or missing files.

## Demo & Presentation Video
<a href="https://youtu.be/RvzG5Ue-8XQ">Demo Video (without narrative)</a><br>
<a href="https://www.loom.com/share/58a6c942e66742d7be22d2b8f1eba31f">Presentation Video(containing the demo video with narrative)</a>


## Test on Your Phone
You can test the app on your phone by using the Expo app. Please install the Expo app on your phone before following the below instructions. (Note: You can test it both on Android and iOS, but it works best on Android.)

### Installing Expo
<a href="https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&gl=US">Google Play (Android)</a><br>
<a href="https://apps.apple.com/us/app/expo-client/id982107779 ">Apple App Store (iOS)</a>

On your computer, please follow the instructions below. 
### Instructions

1. Install Expo CLI ``` yarn global add expo-cli ```
2. Clone this repository to your local machine
3. cd into the directory that was created when you cloned the repo (it should be called ```final-project-eungyup```)
4. Run ```yarn install``` to install all dependencies
5. Create a new Firebase project<br>
  a. The app will use Google Firebase and you need to get a config object from firebase<br>
  b. For more detail, please check <a href="https://firebase.google.com/docs/web/setup">here</a>
6. Create ```Secrets.js``` and put your config object that you got from Firebase there
7. Run ```expo start```

You will see something like <a href="https://drive.google.com/file/d/1NCYVkZN1etFOa0pMFPESj0sHkVKRuOaE/view?usp=sharing">here</a>.

Please open your Expo app on your phone and scan the QR code.<br>
You should be able to check the app now!

