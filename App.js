import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  Button,
  AppState,
  View,
  FlatList,
} from 'react-native';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DB from './SQLite';

import styles from './App.styles.js';

let interval = null;

const STATUS = {
  AUTHORIZED: 'authorized',
  DENIED: 'denied',
  UNKNOWN: 'unknown',
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      hasPermission: false,
      notification: {},
    };
  }

  async componentDidMount() {
    const status = await RNAndroidNotificationListener.getPermissionStatus();
    console.log(status); // Result can be 'authorized', 'denied' or 'unknown'
    if (status === STATUS.AUTHORIZED) {
      this.setState({
        hasPermission: true,
      });
    }
    AppState.addEventListener('change', e => {
      this.handleAppStateChange(e);
    });
    this.onStart();
    const notifications = await DB.SelectQuery();
    console.log('notifications', notifications);
    this.setState({
      notifications: notifications,
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', e => {
      this.handleAppStateChange(e);
    });
    this.onPause();
  }

  Notification({
    time,
    app,
    title,
    titleBig,
    text,
    subText,
    summaryText,
    bigText,
    audioContentsURI,
    imageBackgroundURI,
    extraInfoText,
    icon,
    image,
  }) {
    return (
      <View style={styles.notificationWrapper}>
        <View style={styles.notification}>
          <View style={styles.imagesWrapper}>
            {!!icon && (
              <View style={styles.notificationIconWrapper}>
                <Image source={{uri: icon}} style={styles.notificationIcon} />
              </View>
            )}
            {!!image && (
              <View style={styles.notificationImageWrapper}>
                <Image source={{uri: image}} style={styles.notificationImage} />
              </View>
            )}
          </View>
          <View style={styles.notificationInfoWrapper}>
            {/* <Text>{`app: ${app}`}</Text> */}
            <Text>
              <Text>Title</Text> <Text>{`${title}`}</Text>
            </Text>
            <Text>{`Text: ${text}`}</Text>
            {!!time && (
              <Text style={{fontSize: 12}}>{`${new Date(time / 1000)}`}</Text>
            )}
            {!!titleBig && <Text>{`TitleBig: ${titleBig}`}</Text>}
            {!!subText && <Text>{`SubText: ${subText}`}</Text>}
            {!!summaryText && <Text>{`SummaryText: ${summaryText}`}</Text>}
            {!!bigText && <Text>{`BigText: ${bigText}`}</Text>}
            {!!audioContentsURI && (
              <Text>{`AudioContentsURI: ${audioContentsURI}`}</Text>
            )}
            {!!imageBackgroundURI && (
              <Text>{`ImageBackgroundURI: ${imageBackgroundURI}`}</Text>
            )}
            {!!extraInfoText && (
              <Text>{`ExtraInfoText: ${extraInfoText}`}</Text>
            )}
          </View>
        </View>
      </View>
    );
  }
  render() {
    const hasGroupedMessages =
      this.state.lastNotification &&
      this.state.lastNotification.groupedMessages &&
      this.state.lastNotification.groupedMessages.length > 0;
    return (
      <SafeAreaView style={styles.container}>
        {!this.state.hasPermission && (
          <View style={styles.buttonWrapper}>
            <Text
              style={[
                styles.permissionStatus,
                {color: this.state.hasPermission ? 'green' : 'red'},
              ]}>
              {this.state.hasPermission
                ? 'Allowed to handle notifications'
                : 'NOT allowed to handle notifications'}
            </Text>
            <Button
              title="Open Configuration"
              onPress={this.handleOnPressPermissionButton}
              disabled={this.state.hasPermission}
            />
          </View>
        )}
        <View style={styles.notificationsWrapper}>
          {this.state.notification &&
            this.state.notification.app &&
            !hasGroupedMessages &&
            this.Notification(this.state.notification)}
          {this.state.notification &&
            this.state.notification.app &&
            hasGroupedMessages && (
              <FlatList
                data={this.state.notification.groupedMessages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item}) => {
                  this.Notification({
                    app: this.state.notification.app,
                    ...item,
                  });
                }}
              />
            )}
        </View>
      </SafeAreaView>
    );
  }

  async handleOnPressPermissionButton() {
    RNAndroidNotificationListener.requestPermission();
  }

  onStart() {
    this.interval = setInterval(() => {
      this.handleCheckNotificationInterval();
    }, 1000);
  }
  onPause() {
    clearInterval(this.interval);
  }

  async handleAppStateChange(nextAppState) {
    if (nextAppState === 'active') {
      console.log('nextAppState', nextAppState);
      /**
       * Check the user current notification permission status
       */
      RNAndroidNotificationListener.getPermissionStatus().then(status => {
        if (status === STATUS.AUTHORIZED) {
          this.setState({
            hasPermission: true,
          });
        } else {
          this.setState({
            hasPermission: false,
          });
        }
      });
    }
    return nextAppState;
  }

  async handleCheckNotificationInterval() {
    const lastStoredNotification = await AsyncStorage.getItem(
      '@lastNotification',
    );
    if (lastStoredNotification) {
      this.setState({
        notification: JSON.parse(lastStoredNotification),
      });
    }
  }
}
export default App;
