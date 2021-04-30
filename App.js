import React, {useState, useEffect} from 'react';
import DeviceInfo from 'react-native-device-info';

import {
  SafeAreaView,
  Text,
  Image,
  Button,
  AppState,
  View,
  FlatList,
  TouchableWithoutFeedback,
  BackHandler,
  Alert,
  TouchableOpacity,
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

const Notification = ({item, index}) => {
  return (
    <View style={styles.notificationWrapper}>
      <View style={styles.notification}>
        <View style={styles.imagesWrapper}>
          {!!item.icon && (
            <View style={styles.notificationIconWrapper}>
              <Image
                source={{uri: item.icon}}
                style={styles.notificationIcon}
              />
            </View>
          )}
          {!!item.image && (
            <View style={styles.notificationImageWrapper}>
              <Image
                source={{uri: item.image}}
                style={styles.notificationImage}
              />
            </View>
          )}
        </View>
        <View style={styles.notificationInfoWrapper}>
          {/* <Text>{`app: ${app}`}</Text> */}
          <Text>
            <Text
              style={[
                styles.colorWhite,
                {fontSize: 18},
              ]}>{`${item.title}`}</Text>
          </Text>
          <Text
            style={[styles.colorWhite, {fontSize: 15}]}>{`${item.text}`}</Text>
          {!!item.time && (
            <Text style={[styles.colorWhite, {fontSize: 12}]}>{`${new Date(
              item.time / 1000,
            )}`}</Text>
          )}
          {!!item.titleBig && <Text>{`TitleBig: ${item.titleBig}`}</Text>}
          {!!item.subText && <Text>{`SubText: ${item.subText}`}</Text>}
          {!!item.summaryText && (
            <Text>{`SummaryText: ${item.summaryText}`}</Text>
          )}
          {!!item.bigText && <Text>{`BigText: ${item.bigText}`}</Text>}
          {!!item.audioContentsURI && (
            <Text>{`AudioContentsURI: ${item.audioContentsURI}`}</Text>
          )}
          {!!item.imageBackgroundURI && (
            <Text>{`ImageBackgroundURI: ${item.imageBackgroundURI}`}</Text>
          )}
          {!!item.extraInfoText && (
            <Text>{`ExtraInfoText: ${item.extraInfoText}`}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

class App extends React.Component {
  AppItem = ({item, index}) => {
    return (
      <TouchableWithoutFeedback onPress={() => this.actionOnRow(item)}>
        <View style={styles.notificationWrapper}>
          <View style={styles.notification}>
            <View style={styles.imagesWrapper}>
              {!!item.icon && (
                <View style={styles.notificationIconWrapper}>
                  <Image
                    source={{uri: item.icon}}
                    style={styles.notificationIcon}
                  />
                </View>
              )}
              {!!item.image && (
                <View style={styles.notificationImageWrapper}>
                  <Image
                    source={{uri: item.image}}
                    style={styles.notificationImage}
                  />
                </View>
              )}
            </View>
            <View style={styles.notificationInfoWrapper}>
              {/* <Text>{`app: ${app}`}</Text> */}
              <Text lineBreakMode="middle" numberOfLines={1}>
                <Text
                  lineBreakMode="middle"
                  numberOfLines={1}
                  style={[
                    styles.colorWhite,
                    {fontSize: 20},
                  ]}>{`${this.getAppName(item.app)}`}</Text>
                <Text>{item.count}</Text>
              </Text>
              {!!item.count && (
                <Text style={[styles.colorWhite, {fontSize: 14}]}>
                  Count: {item.count}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  changeLisner;
  backLisner;
  constructor(props) {
    super(props);
    this.state = {
      appId: '',
      showDetails: false,
      apps: [],
      notifications: [],
      hasPermission: false,
      notification: {},
    };
  }

  async componentDidMount() {
    const status = await RNAndroidNotificationListener.getPermissionStatus();
    //console.log(status); // Result can be 'authorized', 'denied' or 'unknown'
    if (status === STATUS.AUTHORIZED) {
      this.setState({
        hasPermission: true,
      });
      const apps = await DB.getAllApps();
      this.setState({
        apps: apps,
      });
    }
    this.changeLisner = AppState.addEventListener('change', e => {
      this.handleAppStateChange(e);
    });
    this.backLisner = BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackPress.bind(this),
    );
    this.onStart();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', e => {
      this.handleAppStateChange(e);
    });
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onBackPress.bind(this),
    );
    this.onPause();
  }

  onBackPress(e) {
    if (this.state.showDetails) {
      this.setState({
        appId: '',
        showDetails: false,
        notifications: [],
      });
      return true;
    } else {
      Alert.alert('Exit App', '', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ]);
      return true;
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        {!this.state.hasPermission && (
          <View style={styles.buttonWrapper}>
            <Text
              style={[
                {
                  color: 'white',
                  alignSelf: 'center',
                  marginBottom: 10,
                  fontSize: 25,
                },
              ]}>
              SkyNotify
            </Text>
            <Text
              style={[
                {
                  color: 'white',
                  alignSelf: 'center',
                  marginBottom: 50,
                  fontSize: 18,
                },
              ]}>
              Notification History
            </Text>
            <Button
              title="Enable Permission"
              borderColor="#2b60f6"
              borderWidth={1}
              color="#0f1724"
              onPress={this.handleOnPressPermissionButton}
              disabled={this.state.hasPermission}
            />
          </View>
        )}

        {this.state.hasPermission && this.state.apps.length === 0 && (
          <View style={styles.notificationsWrapper}>
            <Text>No result found</Text>
          </View>
        )}

        {!this.state.showDetails && (
          <View style={styles.notificationsWrapper}>
            {
              <FlatList
                style={styles.flatlist}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={this.state.apps}
                keyExtractor={(_, index) => index.toString()}
                renderItem={this.AppItem}
              />
            }
            {/* <View style={{height: 10 }}></View> */}
          </View>
        )}

        {this.state.showDetails && this.state.notifications && (
          <View style={styles.notificationsWrapper}>
            {
              <FlatList
                style={styles.flatlist}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={this.state.notifications}
                keyExtractor={(_, index) => index.toString()}
                renderItem={Notification}
              />
            }
            <View style={{height: 80}} />
          </View>
        )}
        {this.state.showDetails && this.state.notifications && (
          <TouchableOpacity
            onPress={() => {
              this.clearAll();
            }}
            style={{
              borderWidth: 1,
              borderColor: '#0f1724',
              alignItems: 'center',
              justifyContent: 'center',
              width: 70,
              position: 'absolute',
              bottom: 100,
              right: 10,
              height: 70,
              elevation: 3,
              backgroundColor: '#92abcf',
              borderRadius: 100,
            }}>
            <Image
              source={require('./images/trash.png')}
              style={{height: 30, width: 30}}
            />
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  async handleOnPressPermissionButton() {
    RNAndroidNotificationListener.requestPermission();
  }

  onStart() {
    this.interval = setInterval(() => {
      this.handleCheckNotificationInterval();
    }, 5000);
  }
  onPause() {
    clearInterval(this.interval);
  }

  async handleAppStateChange(nextAppState) {
    if (nextAppState === 'active') {
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
    if (this.state.showDetails && this.state.appId) {
      const nots = await DB.SelectQuery(this.state.appId);
      this.setState({
        notifications: nots,
      });
    } else {
      const apps = await DB.getAllApps();
      this.setState({
        apps: apps,
      });
    }
  }
  async actionOnRow(item) {
    //console.log('item', item);
    this.setState({
      showDetails: true,
      appId: item.app,
    });
    const nots = await DB.SelectQuery(item.app);
    this.setState({
      notifications: nots,
    });
  }
  async clearAll() {
    //console.log('clearAll');
    if (this.state.appId) {
      Alert.alert('Clear Messages', '', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await DB.DeleteQuery(this.state.appId);
            this.setState({
              showDetails: false,
              appId: '',
            });
          },
        },
      ]);
    }
  }
  getAppName(name) {
    if (name) {
      const arr = name.split('.');
      return arr[arr.length - 1];
    }
    return 'App';
  }
}
export default App;
