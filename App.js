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

const Firebase = require('firebase');
import MessengerContainer from './src/containers/MessengerContainer'


export default class firey_chat extends Component {
    render() {
        return (
            <MessengerContainer/>

            // <View style={styles.container}>
            //     <Text style={styles.welcome}>
            //         Welcome to React Native!
            //     </Text>
            //     <Text style={styles.instructions}>
            //         To get started, edit index.ios.js
            //     </Text>
            //     <Text style={styles.instructions}>
            //         Press Cmd+R to reload,{'\n'}
            //         Cmd+D or shake for dev menu
            //     </Text>
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

