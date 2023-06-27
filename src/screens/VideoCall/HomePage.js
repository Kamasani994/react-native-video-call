import React, { useEffect, useState } from 'react';
import { Button, View, StyleSheet, Text, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomePage(props) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const [userID, setUserID] = useState('');
  const [conferenceID, setConferenceID] = useState('');
  const [userName, setUserName] = useState('');

  const onJoinConferencePress = () => {
    navigation.navigate('VideoConferencePage', {
      userID: userID,
      userName: userName,
      conferenceID: conferenceID,
    });
  };

  const getData = async () => {
    try {
      setLoading(true)
      const user = await AsyncStorage.getItem('@userName');
      if (user !== null) {       
        setUserName(user);
      }
    } catch (e) {
      console.log("error at Homepage")
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getData();
      setUserID(String(Math.floor(Math.random() * 100000)));
      setConferenceID(String(Math.floor(Math.random() * 10000)));
      setLoading(false)
    };
    fetchData()
  }, []);

  const insets = useSafeAreaInsets();

  return (
    <View style={{ height: '100%' }}>
      {loading ? <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} ><ActivityIndicator size={'large'} color='#0000ff' /></View> : (
        <View
          style={[
            styles.container,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
          ]}>

          <Text style={styles.userID}>Your User ID: {userID}</Text>
          <Text style={[styles.conferenceID, styles.leftPadding]}>Your User name: {userName}</Text>
          <Text style={[styles.conferenceID, styles.leftPadding]}>
            Conference ID:
          </Text>
          <TextInput
            placeholder="Enter the Conference ID. e.g. 6666"
            style={[styles.input]}
            onChangeText={text =>
              setConferenceID(text.replace(/[^0-9A-Za-z_]/g, ''))
            }
            maxLength={4}
            value={conferenceID}
          />
          <View style={[styles.buttonLine, styles.leftPadding]}>
           
            <Button
              disabled={conferenceID.length === 0}
              style={styles.button}
              title="Start a conference"
              onPress={() => {
                onJoinConferencePress();
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  buttonLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 42,
  },
  buttonSpacing: {
    width: 13,
  },
  input: {
    height: 42,
    width: 305,
    borderWidth: 1,
    borderRadius: 9,
    borderColor: '#333333',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 35,
    marginBottom: 20,
  },
  userID: {
    fontSize: 14,
    color: '#2A2A2A',
    marginBottom: 27,
    paddingBottom: 12,
    paddingTop: 12,
    paddingLeft: 20,
  },
  conferenceID: {
    fontSize: 14,
    color: '#2A2A2A',
    marginBottom: 5,
  },
  simpleCallTitle: {
    color: '#2A2A2A',
    fontSize: 21,
    width: 330,
    fontWeight: 'bold',
    marginBottom: 27,
  },
  button: {
    height: 42,
    borderRadius: 9,
    backgroundColor: '#F4F7FB',
  },
  leftPadding: {
    paddingLeft: 35,
  },
});