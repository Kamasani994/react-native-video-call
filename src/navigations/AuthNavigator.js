import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Login, ForgotPassword, Register} from '../screens';
import {COLORS, ROUTES} from '../constants';
import DrawerNavigator from './DrawerNavigator';
import VideoHomePage from '../screens/VideoCall/HomePage';
import VideoConferencePage from '../screens/VideoCall/VideoConferencePage';

const Stack = createStackNavigator();
// Navigator, Screen, Group

function AuthNavigator() {
  
  return (
    <Stack.Navigator screenOptions={{}} initialRouteName={ROUTES.LOGIN}>
      <Stack.Screen
        name={ROUTES.FORGOT_PASSWORD}
        component={ForgotPassword}
        options={({route}) => ({
          headerTintColor: COLORS.white,
          // headerBackTitle: 'Back',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          title: route.params.userId,
        })}
      />
      <Stack.Screen
        name={ROUTES.LOGIN}
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen name={ROUTES.REGISTER} component={Register} />
      <Stack.Screen
        name={ROUTES.HOME}
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='VideoHome'
        component={VideoHomePage}
        options={{headerShown: false}}
      />

      <Stack.Screen name='VideoConferencePage' component={VideoConferencePage} options={{headerShown: false}} /> 
    </Stack.Navigator>
  );
}

export default AuthNavigator;
