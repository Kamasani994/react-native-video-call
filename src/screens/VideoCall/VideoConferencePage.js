import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Text } from 'react-native';
import ZegoUIKitPrebuiltVideoConference from '@zegocloud/zego-uikit-prebuilt-video-conference-rn';
import { ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { ZegoLayoutMode } from '@zegocloud/zego-uikit-rn'
import KeepAwake from 'react-native-keep-awake';
import { ROUTES } from '../../constants';

export default function VideoConferencePage(props) {
  const { route } = props;
  const { params } = route;
  const { userID, userName, conferenceID } = params;
  const [openModal, setOpenModal] = useState(true);
 
  useEffect(() => {
    KeepAwake.activate();
  }, [])

  return (
    <Modal visible={openModal}>
      <View style={styles.container}>        
        <ZegoUIKitPrebuiltVideoConference
          appID={1556470435}
          appSign='f7ae1185814ff6e373c049e14aee7880ff41cdddaf8bacbca43f6a42835f42cc'
          userID={userID}
          userName={userName}
          conferenceID={conferenceID}
          config={{
            onLeave: () => {
              setOpenModal(false)
              props.navigation.navigate(ROUTES.HOME_DRAWER);
              KeepAwake.deactivate();

            },
            layout: {
              mode: ZegoLayoutMode.pictureInPicture,
              config: {
                smallViewBackgroundColor: "#333437",
                largeViewBackgroundColor: "#4A4B4D",
                showMyViewWithVideoOnly: false,
                isSmallViewDraggable: true,
                switchLargeOrSmallViewByClick: true,
              }
            },
            bottomMenuBarConfig: {
              maxCount: 5,
            }
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
});