import {Dimensions, StyleSheet} from 'react-native';

const {height, width} = Dimensions.get('screen');
const FORM_HEIGHT = height - 100;
const widthPad = width - 40;
export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
    width: width,
    backgroundColor: '#000000',
    // marginTop: height / 2 - FORM_HEIGHT,
  },
  buttonWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: height,
    backgroundColor: '#000000',
  },
  permissionStatus: {
    marginBottom: 20,
    fontSize: 18,
  },
  notificationsWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    height: FORM_HEIGHT,
  },
  notificationWrapper: {
    flexDirection: 'column',
    width: width,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 0,
    elevation: 2,
  },
  notification: {
    flexDirection: 'row',
  },
  imagesWrapper: {
    flexDirection: 'column',
  },
  notificationInfoWrapper: {
    flex: 1,
  },
  notificationIconWrapper: {
    backgroundColor: '#0f1724',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 15,
    justifyContent: 'center',
  },
  notificationIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  notificationImageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 15,
    justifyContent: 'center',
  },
  notificationImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  buttomWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
