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
    View
} from 'react-native';

import MessengerContainer from './src/MessengerContainer'
import SplashScreen from 'react-native-splash-screen'

export default class firey_chat extends Component {

    componentDidMount() {
        // do anything while splash screen keeps, use await to wait for an async task.
        SplashScreen.hide();
    }

    render() {
        return (
            <MessengerContainer/>
            // <View style={styles.container}>
            //     <MessengerContainer/>
            // </View>
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
