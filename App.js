/**
 * Created by seungjinjung on 2017. 1. 2..
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Platform,
} from 'react-native';
import FCM from 'react-native-fcm';
import SplashScreen from 'react-native-splash-screen'

import MessengerContainer from './src/MessengerContainer'
import FireyFirebase from "./src/FirebaseConfig";


export default class firey_chat extends Component {

    constructor(props) {
        super(props);

        this.dbRepo = FireyFirebase.firey_firebase.database();
        this.dbUsersRepo = this.dbRepo.ref('users');
    }

    componentDidMount() {
        this._initialSettings().done();

        FCM.getInitialNotification().then(notification => console.log(notification));

        this.notificationListener = FCM.on('notification', (notif) => {
            // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
            if(notif.local_notification){
                console.log('local_notification');
                //this is a local notification
            }
            if(notif.opened_from_tray){
                console.log('opened_from_tray');
                //app is open/resumed because user clicked banner
            }
        });
        this.refreshTokenListener = FCM.on('refreshToken', (token) => {
            console.log("here", token);
            // fcm token may not be available on first load, catch it here
        });
    }

    _initialSettings = async () => {
        let _this = this;
        try {
            console.log('=====0');
            let uuid = await AsyncStorage.getItem('uuid');
            console.log('=====', uuid);
            await FCM.getFCMToken().then(token => {
                _this.fcm_token = token;
                console.log('=====1', token);
            });
            console.log('=====2');
            await FCM.requestPermissions(); // for iOS
            if (uuid == null ){
                console.log('=====3');
                FireyFirebase.firey_firebase.auth().signInAnonymously()
                    .then(function() {
                        console.log('=====4', _this.fcm_token);
                        return FireyFirebase.firey_firebase.auth().onAuthStateChanged(function(user){
                            _this.dbUsersRepo.push({
                                id: user.uid,
                                created: new Date().getTime(),
                                platform: Platform.OS,
                                fcm_token: _this.fcm_token
                            });
                            AsyncStorage.setItem(uuid, user.uid)
                        });
                    });
            } else {
                _this.uuid = uuid;
            }
            console.log('=====5');
            await SplashScreen.hide();
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    };

    componentWillUnmount() {
        // stop listening for events
        this.notificationListener.remove();
        this.refreshTokenListener.remove();
    }

    render() {
        return (
            <View style={styles.container}>
                <MessengerContainer/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
//
// <Text style={styles.welcome}>
//     Welcome to React Native!
// </Text>
// <Text style={styles.instructions}>
// To get started, edit index.ios.js
// </Text>
// <Text style={styles.instructions}>
//     Press Cmd+R to reload,{'\n'}
//     Cmd+D or shake for dev menu
// </Text>
