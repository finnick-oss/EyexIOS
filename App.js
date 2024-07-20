import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './SplashScreen';
import SelectIssue from './issues/SelectIssue';
import EyeExercise from './eyeworkoutpkg/EyeExercise';
import SelectTime from './issues/SelectTime';
import LoadData from './download/LoadData';
import HomeDashboard from './dashboard/HomeDashboard';
import FocusMode from './202020rule/FocusMode';
import CompletedActivity from './completedScreens/CompletedActivity';
import HealthTips from './tips/HealthTips';
import HealthTipsFD from './tips/HealthTipsFD';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide header globally
          // Customize transition animation
          animation: 'none', // You can choose 'slide_from_right', 'slide_from_left', 'fade', etc.
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="SelectIssue" component={SelectIssue} />
        <Stack.Screen name="EyeExercise" component={EyeExercise} />
        <Stack.Screen name="SelectTime" component={SelectTime} />
        <Stack.Screen name="LoadData" component={LoadData} />
        <Stack.Screen name="HomeDashboard" component={HomeDashboard} />
        <Stack.Screen name="FocusMode" component={FocusMode} />
        <Stack.Screen name="CompletedActivity" component={CompletedActivity} />
        <Stack.Screen name="HealthTips" component={HealthTips} />
        <Stack.Screen name="HealthTipsFD" component={HealthTipsFD} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
