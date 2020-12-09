
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { LoginScreen } from './LoginScreen';
import { HomeScreen } from './HomeScreen';
import { TripPlanScreen } from './TripPlanScreen';
import {PlanItemScreen} from './PlanItemScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TripPlan" component={TripPlanScreen} />
        <Stack.Screen name="PlanItem" component={PlanItemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;