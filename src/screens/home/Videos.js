import React, { useState, useCallback, useRef } from "react";
import { Button, View, Alert, StyleSheet, FlatList, SafeAreaView, ScrollView } from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";

function Videos() {
    const [playing, setPlaying] = useState(false);

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
            Alert.alert("video has finished playing!");
        }
    }, []);

    const togglePlaying = useCallback(() => {
        setPlaying((prev) => !prev);
    }, []);

    const VIDEOS_DATA = [
        {
            id: '1',
            videoId: 'XOZ-Yco3Ykw'
        },
        {
            id: '2',
            videoId: '0zJUe_IkUvQ'
        },        
    ]
    return (
        <>
            <View style={styles.videoContainer}>
                <ScrollView>
                    {VIDEOS_DATA.map(({ id, videoId }) => (
                        <View style={styles.video} key={id}>
                            <YoutubeIframe
                                height={250}
                                play={false}
                                videoId={videoId}

                            />
                        </View>
                    ))}

                </ScrollView>
            </View>
        </>
    )
}

export default Videos;

const styles = StyleSheet.create({
    videoContainer: {
        padding: 5,
        flex: 1
    },
    backgroundVideo: {
        position: 'absolute',
        height: 250,
        top: 10,
        left: 0,
        bottom: 0,
        right: 0,
    },
})