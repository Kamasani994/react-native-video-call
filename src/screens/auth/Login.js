import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, ROUTES } from '../../constants';
import Logo from '../../assets/icons/LOGO.svg';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageModal from '../../components/LangaugeModal';
import { useTranslation } from 'react-i18next';

const Login = props => {
  // const {navigation} = props;
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { t, i18n } = useTranslation();
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const fetchLang = async() => {
      const lang = await AsyncStorage.getItem('LANG');
      setCurrentLang(lang)
      i18n.changeLanguage(lang);
    }
    
    fetchLang()
  }, [])

  const saveSelectedLang = async index => {
    await AsyncStorage.setItem('LANG', index + '');
  };

  const onChangeText = (name, value) => {
    setUserData({ ...userData, [name]: value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    if (userData.username !== '' && userData.password !== '') {
      await axios.post('https://vcoretestapi.azurewebsites.net/api/Auth', userData).then(res => {
        console.log("res", res)
        if (res.data && res.data.jwtToken) {
          AsyncStorage.setItem('@type', res.data.type.toString())
          AsyncStorage.setItem('@token', res.data.jwtToken)
          AsyncStorage.setItem('@userName', res.data.name)
          AsyncStorage.setItem('@userId', res.data.userId);
          setError('Invalid username and password')
          setLoading(false)
          navigation.navigate(ROUTES.HOME)
        }
      }).catch(e => {
        setLoading(false)
        setError('Invalid username and password')
      })

    }
  }
  return (
    // <SafeAreaView style={styles.main}>
    <View style={styles.container}>

      <View style={styles.wFull}>
        <View style={styles.row}>
          {/* <Logo width={55} height={55} style={styles.mr7} /> */}
          <Text style={styles.brandName}>vC@re</Text>
        </View>

        <Text style={styles.loginContinueTxt}>{t("loginTitle")}</Text>
        <TextInput
          style={styles.input}
          placeholder="username"
          onChangeText={(e) => onChangeText('username', e)}
          value={userData.username}
          autoFocus={false}
        />
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={(e) => onChangeText('password', e)}
          value={userData.password}
          autoFocus={false}
        />

        <View style={styles.loginBtnWrapper}>
          <LinearGradient
            colors={[COLORS.gradientForm, COLORS.primary]}
            style={styles.linearGradient}
            start={{ y: 0.0, x: 0.0 }}
            end={{ y: 1.0, x: 0.0 }}>
            {/******************** LOGIN BUTTON *********************/}
            <TouchableOpacity
              onPress={() => handleSubmit()}
              activeOpacity={0.7}
              style={styles.loginBtn}>
              <Text style={styles.loginText}>{loading ? t("waitText") : t("loginBtnText")}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {error && (
          <View style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>
            <Text style={{ color: COLORS.danger, fontSize: 16 }}>{error}</Text>
          </View>
        )}

        {/***************** FORGOT PASSWORD BUTTON *****************/}
        {/* <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.FORGOT_PASSWORD, {
                userId: 'X0001',
              })
            }
            style={styles.forgotPassBtn}>
            <Text style={styles.forgotPassText}>Forgot Password?</Text>
          </TouchableOpacity> */}
      </View>

      {/* <View style={styles.footer}>
          <Text style={styles.footerText}> Don't have an account? </Text>
         
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.REGISTER)}>
            <Text style={styles.signupBtn}>Sign Up</Text>
          </TouchableOpacity>
        </View> */}
      <TouchableOpacity
        style={styles.selectLangbtn}
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

    </View>
    // </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    padding: 15,
    width: '100%',
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 42,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.green,
    opacity: 0.9,
  },
  loginContinueTxt: {
    fontSize: 21,
    textAlign: 'center',
    color: COLORS.gray,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    height: 55,
    paddingVertical: 0,
  },
  // Login Btn Styles
  loginBtnWrapper: {
    height: 55,
    marginTop: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  linearGradient: {
    width: '100%',
    borderRadius: 50,
  },
  loginBtn: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 55,
  },
  loginText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '400',
  },
  forgotPassText: {
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 15,
  },
  // footer
  footer: {
    position: 'absolute',
    bottom: 20,
    textAlign: 'center',
    flexDirection: 'row',
  },
  footerText: {
    color: COLORS.gray,
    fontWeight: 'bold',
  },
  signupBtn: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  // utils
  wFull: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mr7: {
    marginRight: 7,
  },
  selectLangbtn: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    padding: 15,
    marginVertical: 10,
    width: '100%',
    // position: 'absolute',
    // bottom: 0,
    borderRadius: 100,
    display: 'flex',
    alignItems: "center",

  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark
  }
});
