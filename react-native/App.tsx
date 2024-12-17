import React from 'react';
import VoiceCommandScreen from './src/screens/VoiceCommandScreen';
import NotificationScreen from './src/screens/Notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

enableScreens();

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="VoiceCommandScreen" component={VoiceCommandScreen} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
