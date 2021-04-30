/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {RNAndroidNotificationListenerHeadlessJsName} from 'react-native-android-notification-listener';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite from 'react-native-sqlite-storage';
import DB from './SQLite';
global.db = SQLite.openDatabase(
  {
    name: 'SQLite',
    location: 'default',
    createFromLocation: '~SQLite.db',
  },
  () => {
    console.log('db connected');
  },
  error => {
    console.log('ERROR: ' + error);
  },
);

import App from './App';
import {name as appName} from './app.json';

console.disableYellowBox = true;
/**
 * Note that this method MUST return a Promise.
 * Is that why I'm using a async function here.
 */
const headlessNotificationListener = async ({notification}) => {
  /**
   * This notification is a JSON string in the follow format:
   *  {
   *      "time": string,
   *      "app": string,
   *      "title": string,
   *      "titleBig": string,
   *      "text": string,
   *      "subText": string,
   *      "summaryText": string,
   *      "bigText": string,
   *      "audioContentsURI": string,
   *      "imageBackgroundURI": string,
   *      "extraInfoText": string,
   *      "groupedMessages": Array<Object> [
   *          {
   *              "title": string,
   *              "text": string
   *          }
   *      ],
   *      "icon": string (base64),
   *      "image": string (base64), // WARNING! THIS MAY NOT WORK FOR SOME APPLICATIONS SUCH TELEGRAM AND WHATSAPP
   *  }
   *
   * Note that this properties depends on the sender configuration
   * so many times a lot of them will be empty
   */

  if (notification) {
    /**
     * Here you could store the notifications in a external API.
     * I'm using AsyncStorage here as an example.
     */
    console.log('notification', notification);
    await DB.CreateTable();
    await DB.Insertdata([notification]);
  }
};

AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => headlessNotificationListener,
);

AppRegistry.registerComponent(appName, () => App);
