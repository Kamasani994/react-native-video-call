import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Alert } from 'react-native';
import { COLORS, ROUTES } from '../constants';
import { Wallet, Notifications, Chat, ChatBot } from '../screens';
import BottomTabNavigator from './BottomTabNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomDrawer from '../components/CustomDrawer';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {

  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [type, setType] = useState(null);

  const [chat, setChat] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const navigation = useNavigation();

  const latestChat = useRef(null);
  latestChat.current = chat;
  const { i18n } = useTranslation()

  useEffect(() => {
    const fetchLang = async() => {
      const lang = await AsyncStorage.getItem('LANG');          
      i18n.changeLanguage(lang);
    }
    
    fetchLang()
  }, [])

  useEffect(() => {

    const connection = new HubConnectionBuilder()
      .withUrl(`https://vcoretestapi.azurewebsites.net/hubs/chat`)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(result => {
        console.log('Connected!');
        connection.on('ReceiveMessage', m => {
          // const updatedChat = [...latestChat.current];         
          // updatedChat.push(m);
          setChat(m.message);
          setShowAlert(true)
        });
      })
      .catch(e => console.log('Connection failed: ', e));

    getData();
    // onAlert();

  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@userName');
      const userId = await AsyncStorage.getItem('@userId');
      const type = await AsyncStorage.getItem('@type');
      if (value !== null) {
        setUserName(value)
      }
      if (userId !== null) {
        setUserId(userId)
      }
      if (type !== null) {
        setType(type)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onJoinConferencePress = () => {
    setShowAlert(false)
    navigation.navigate('VideoConferencePage', {
      userID: userId,
      userName: userName,
      conferenceID: chat,
    });
    hideAlert()
  };

  const hideAlert = () => {
    setShowAlert(false)
  }

  return (
    <>
      {type !== '1' && <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="You get a call from Doctor"
        message=""
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Decline"
        confirmText="Accecpt"
        confirmButtonColor="#007C00"
        cancelButtonColor='#EE4B2B'
        onCancelPressed={() => {
          hideAlert();
        }}
        onConfirmPressed={() => onJoinConferencePress()}
      />
      }

      <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: COLORS.primary,
          drawerActiveTintColor: COLORS.white,
          drawerLabelStyle: {
            marginLeft: -20,
          },
        }}>
        <Drawer.Screen
          name={ROUTES.HOME_DRAWER}
          component={BottomTabNavigator}
          options={{
            title: 'Home',
            drawerIcon: ({ focused, color, size }) => (
              <Icon name="home-sharp" size={18} color={color} />
            ),
          }}
        />

        {/* <Drawer.Screen
          name={ROUTES.CHAT_DRAWER}
          component={Chat}
          options={{
            title: 'Chat',
            drawerIcon: ({ focused, color, size }) => (
              <Icon name="chatbox" size={18} color={color} />
            ),
          }}
        /> */}

        <Drawer.Screen
          name={ROUTES.CHATBOT_DRAWER}
          component={ChatBot}
          options={{
            title: 'ET Bot',
            headerShown: true,
            drawerIcon: ({ focused, color, size }) => (
              <Icon name="chatbox" size={18} color={color} />
            ),
          }}
        />

      </Drawer.Navigator>
    </>
  );
}

export default DrawerNavigator;
