import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import ChatBot from 'react-native-chatbot';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ChatBotComponent() {
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        getData()
    }, []);


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const getData = async () => {
        try {
            const userId = await AsyncStorage.getItem('@userId');
            if (userId !== null) {
                setUserId(userId);
                setLoading(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const steps = [
        {
            id: '0',
            message: 'Welcome to vC@re',
            trigger: '1',
        },
        {
            id: '1',
            message: 'Is it an emergency?',
            trigger: '2',
        },
        {
            id: '2',
            options: [
                { value: 'Yes', label: 'Yes', trigger: '3' },
                { value: 'No', label: 'No', trigger: '4' }
            ]
        },
        {
            id: '3',
            message: 'Please call to 911',
            trigger: '0'
        },
        {
            id: '4',
            options: [
                {
                    value: '1', label: 'Schedule an appointment', trigger: ({ value, steps }) => {
                        // axios.post(`https://vcoretestapi.azurewebsites.net/api/Consultation/RaiseRequest/${userId}`)
                        return '5'
                    }
                },
                { value: '2', label: 'Medication refill', trigger: '6' },
                { value: '3', label: 'Lab review', trigger: '7' },
                {
                    value: '4', label: 'callback from doctor', trigger: ({ value, steps }) => {
                        axios.post(`https://vcoretestapi.azurewebsites.net/api/Consultation/RaiseRequest/${userId}`)
                        return '8'
                    }
                }
            ]
        },
        {
            id: '5',
            message: 'Thank you, and one of our staff member will connect you shortly',
            end: true
        },
        {
            id: '6',
            message: 'Thank you, and one of our staff member will connect you shortly',
            end: true
        },
        {
            id: '7',
            message: 'Thank you, and one of our staff member will connect you shortly',
            end: true
        },
        {
            id: '8',
            message: 'Thank you, and the doctor will contact you shortly',
            end: true
        },

    ];

    return (
        <View>
            {(loading) ? <ActivityIndicator /> : <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <ChatBot steps={steps} />
            </ScrollView>
            }
        </View>
    )
}

export default ChatBotComponent