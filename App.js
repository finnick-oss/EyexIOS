import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './SplashScreen'; // Import SplashScreen component
import SelectIssue from './issues/SelectIssue'; // Import SelectIssue component
import EyeExercise from './eyeworkoutpkg/EyeExercise'; // Import EyeExercise component
import SelectTime from './issues/SelectTime'; // Make sure this path is correct
import LoadData from './download/LoadData';
import HomeDashboard from './dashboard/HomeDashboard';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown:false}} />
        <Stack.Screen name="SelectIssue" component={SelectIssue} options={{headerShown:false}}/>
        <Stack.Screen name="EyeExercise" component={EyeExercise} options={{headerShown:false}}/>
        <Stack.Screen name="SelectTime" component={SelectTime} options={{headerShown: false}}/>
        <Stack.Screen name="LoadData" component={LoadData} options={{headerShown: false}}/>
        <Stack.Screen name="HomeDashboard" component={HomeDashboard} options={{headerShown:false}}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
