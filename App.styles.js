import {Dimensions, StyleSheet} from 'react-native';

const {height, width} = Dimensions.get('screen');
const FORM_HEIGHT = 250;
const widthPad = width - 40;
export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: FORM_HEIGHT,
    width: width,
    // marginTop: height / 2 - FORM_HEIGHT,
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
  },
  notificationWrapper: {
    flexDirection: 'column',
    width: width,
    backgroundColor: '#f2f2f2',
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
    backgroundColor: '#aaa',
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
