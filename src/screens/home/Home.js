import { StyleSheet, Text, View, TextInput, Modal, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { COLORS } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useNavigation } from '@react-navigation/native';
import LanguageModal from '../../components/LangaugeModal';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [type, setType] = useState(null);

  const [chat, setChat] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const { t } = useTranslation()
  const navigation = useNavigation();

  const latestChat = useRef(null);
  latestChat.current = chat;


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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bgColor,
        padding: 20
      }}>
        <Text>{t("welcomeText")}</Text>
     
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1
  },
  input: {
    height: 40,
    width: '100%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
