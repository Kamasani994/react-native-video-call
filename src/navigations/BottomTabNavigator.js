import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform, TouchableOpacity, Pressable, View, Text } from 'react-native';
import { COLORS, ROUTES } from '../constants';
import { Home, Wallet, Notifications, Settings, Patients } from '../screens';
import Icon from 'react-native-vector-icons/Ionicons';
import NavIcon from 'react-native-vector-icons/FontAwesome';
import SettingsNavigator from './SettingsNavigator';
import CustomTabBarButton from '../components/CustomTabBarButton';
import CustomTabBar from '../components/CustomTabBar';
import { useNavigation } from '@react-navigation/native';
import VideoConferencePage from '../screens/VideoCall/HomePage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Videos from '../screens/home/Videos';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const navigation = useNavigation();
  const [type, setType] = useState(null);

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const type = await AsyncStorage.getItem('@type');    
      if (type !== null) {
        setType(type);
      }
    } catch (e) {
      console.log("error at Homepage")
    }
  }

  const customHeaderTitle = () => {
    return (
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
        <NavIcon name='plus-circle' size={30} color={COLORS.green} />
        <Text style={{marginLeft: 4, fontSize: 22, fontWeight: 'bold', color: COLORS.black }}>vC@re</Text>
      </View>
    )
  }

  return (   
    <Tab.Navigator
      // tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: COLORS.white,
        headerShadowVisible: false, // applied here
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: COLORS.bgColor,                    
        },
        headerLeftContainerStyle: {
          paddingLeft: 15,          
        },
        headerRightContainerStyle: {
          paddingRight: 15
        },
        headerLeft: () => {
          return <Pressable onPress={() => navigation.openDrawer()}><NavIcon name='navicon' color='#000' size={30} /></Pressable>
        },
        headerRight: () => {
          return <Pressable ><Icon name='notifications-outline' color='#000' size={22} /></Pressable>
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === ROUTES.HOME_TAB) {
            iconName = focused ? 'ios-home-sharp' : 'ios-home-outline';
          } else if (route.name === ROUTES.SETTINGS_NAVIGATOR) {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === ROUTES.VIDEOCALL) {
            iconName = focused ? 'videocam' : 'videocam-outline';
          } else if (route.name === ROUTES.VIDEOS_DRAWER) {
            iconName = focused ? 'md-videocam' : 'md-videocam-outline';
          } else if (route.name === ROUTES.PATIENTSDETAILS) {
            iconName = focused
              ? 'videocam'
              : 'videocam-outline';
          }

          return <Icon name={iconName} size={22} color={color} />;
        },
      })}
    >

      <Tab.Screen name={ROUTES.HOME_TAB} component={Home} options={{ headerTitle: customHeaderTitle }} />
      {type === '1' && <Tab.Screen name={ROUTES.PATIENTSDETAILS} component={Patients} options={{ headerTitle: customHeaderTitle }} />}
      {type !== '1' && <Tab.Screen name={ROUTES.VIDEOS_DRAWER} component={Videos} options={{ headerTitle: customHeaderTitle }} />}
      <Tab.Screen name={ROUTES.SETTINGS_NAVIGATOR} component={SettingsNavigator} options={{ headerTitle: customHeaderTitle }} />

    </Tab.Navigator>
  );
}

export default BottomTabNavigator;

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    backgroundColor: COLORS.hospitalGreen,
    borderTopWidth: 0,
    bottom: 0,
    right: 0,
    left: 0,
    height: 60,
  },
});
