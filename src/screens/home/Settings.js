import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, ROUTES } from '../../constants';
import LanguageModal from '../../components/LangaugeModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({ navigation }) => {
  const [langModalVisible, setLangModalVisible] = useState(false);

  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const fetchLang = async() => {
      const lang = await AsyncStorage.getItem('LANG');     
      setCurrentLang(lang)     
    }
    
    fetchLang()
  }, [])

  const saveSelectedLang = async index => {
    await AsyncStorage.setItem('LANG', index + '');
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bgColor,
      }}>
      <Text>Settings</Text>

      {/* <TouchableOpacity
        onPress={() => navigation.navigate(ROUTES.SETTINGS_DETAIL)}
        style={styles.button}
        activeOpacity={0.8}>
        <Text style={styles.buttonText}>Go To Settings Detail</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => navigation.navigate(ROUTES.LOGIN)}
        style={styles.button}
        activeOpacity={0.8}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setLangModalVisible(!langModalVisible);
        }}>
        <Text style={styles.buttonText}>Select Language</Text>
      </TouchableOpacity>

      <LanguageModal
        langModalVisible={langModalVisible}
        setLangModalVisible={setLangModalVisible}
        currentLang={currentLang}
        onSelectLang={x => {         
          saveSelectedLang(x);
        }}
      />
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    padding: 17,
    margin: 10,
    borderRadius: 5,
    fontSize: 18,
    width: 180,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
