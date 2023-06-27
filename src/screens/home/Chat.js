import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { COLORS } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatBox = () => {
    const [userName, setUserName] = useState('');
    const [text, onChangeText] = React.useState('');
    const [chat, setChat] = useState([]);
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

                connection.on('ReceiveMessage', message => {
                    const updatedChat = [...latestChat.current];
                    updatedChat.push(message);                   
                    setChat(updatedChat);
                });
            })
            .catch(e => console.log('Connection failed: ', e));

        getData();

    }, []);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@userName')
            if (value !== null) {
                setUserName(value)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const sendMessage = async () => {
        const chatMessage = {
            user: userName,
            message: text
        };

        try {
            onChangeText('')
            await fetch(`https://vcoretestapi.azurewebsites.net/chat/messages`, {
                method: 'POST',
                body: JSON.stringify(chatMessage),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        }
        catch (e) {
            console.log('Sending message failed.', e);
        }
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.bgColor,
                padding: 20
            }}>

            {chat.length > 0 && chat.map((m) => (
                <View key={Date.now() * Math.random()} style={m.user === 'patient1' ? styles.patientChat : styles.adminChat}>
                    <View style={styles.container}><Text style={styles.textColor}>{m.message}</Text></View>
                </View>
            ))}

            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
            />
            <Button
                title="Press me"
                color="#f194ff"
                onPress={() => sendMessage()}
            />
        </View>
    );
};

export default ChatBox;

const styles = StyleSheet.create({
    patientChat: {
        display: 'flex',
        flex:1,
        alignItems: 'flex-end',
        marginBottom: 5,
    },
    adminChat: {
        display: 'flex',
        flex: 1,
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    container: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 6
    },
    textColor: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    input: {
        height: 40,
        width: '100%',
        marginBottom: 10,
        borderWidth: 1,        
        padding: 10,
    },
});
