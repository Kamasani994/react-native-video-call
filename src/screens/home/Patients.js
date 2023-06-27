import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, Pressable, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function Patients() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [patientsList, setPatientsList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();       
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true)
        await axios.get(`https://vcoretestapi.azurewebsites.net/api/Consultation/Paginate?page=0&size=10`).then((res) => {
            setPatientsList(res.data.items);
            setLoading(false);
            setRefreshing(false);
        })
        await getData();
    }

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@userName');
            const userId = await AsyncStorage.getItem('@userId')
            if (value !== null) {
                setUserName(value)
            }
            if (userId !== null) {
                setUserId(userId)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleVideoCall = async () => {
        try {

            await axios.put('https://vcoretestapi.azurewebsites.net/api/Consultation/CallToPatient', {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.data && res.data.roomId) {
                    navigation.navigate('VideoConferencePage', {
                        userID: userId,
                        userName: userName,
                        conferenceID: res.data.roomId.toString(),
                    });
                }
            })
        }
        catch (e) {
            console.log('Sending message failed.', e);
        }
    }

    return (
        <View style={styles.patientsContainer}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={onRefresh} />
                }
            >
                {loading ? <ActivityIndicator /> : <>
                    {patientsList.length > 0 ? patientsList.map((pat) => (
                        <View style={styles.patientDetails} key={pat.id}>
                            <View>
                                <Text style={styles.font18}>{pat.patientName}</Text>
                                <Text style={styles.font14}>Age : {pat.age}</Text>
                                <Text>Booked At : {pat.requestedOn}</Text>
                            </View>
                            <View>
                                <Pressable onPress={handleVideoCall}><Icon name='videocam' size={30} color='green' /></Pressable>
                            </View>
                        </View>
                    )) : <View style={styles.patientDetails}><Text>No records</Text></View>}
                </>}

            </ScrollView>
        </View>
    )
}

export default Patients;

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
    },
    patientsContainer: {
        flex: 1,
        backgroundColor: COLORS.bgColor,
        padding: 10,
        paddingBottom: 60
    },
    patientDetails: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: 15,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        marginBottom: 8
    },
    font18: {
        fontSize: 18,
        fontFamily: 'sans-serif',
        color: COLORS.gray,
        fontWeight: 'bold',
        marginBottom: 5
    },
    font14: {
        fontSize: 14,
        fontFamily: 'sans-serif',
        color: '#333',
        fontWeight: '500'
    }
})