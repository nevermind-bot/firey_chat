/**
 * Created by seungjinjung on 2017. 1. 2..
 */
'use strict';

import React, {
    Component,
} from 'react';
import {
    Linking,
    Platform,
    ActionSheetIOS,
    Dimensions,
    View,
    Text,
    Navigator,
} from 'react-native';

var GiftedMessenger = require('react-native-gifted-messenger');

if (Platform.OS == 'ios') {
    var STATUS_BAR_HEIGHT = 0;
    var CONTAINER_MARGIN = 20;
    var UserName = 'ios';
    var AvatarUrl = 'https://source.unsplash.com/sseiVD2XsOk/100x100';
} else {
    var STATUS_BAR_HEIGHT = 27;
    var CONTAINER_MARGIN = 0;
    var UserName = 'android';
    var AvatarUrl = 'https://source.unsplash.com/2Ts5HnA67k8/100x100';
}

class MessengerContainer extends Component {

    constructor(props) {
        super(props);

        let uuid = 'dfdf';

        this._ref = new Firebase("https://chat-e6aab.firebaseio.com/");

        this._userRef = this._ref.child('users');
        // 익명 로그인 authenticatoin
        this._userRef.push({
            _id: uuid,
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
        });

        this._messagesRef = this.requestNewMatch(uuid);
        this._messages = [];

        this.state = {
            messages: this._messages,
            typingMessage: ''
        };
    }

    componentDidMount() {
        this._messagesRef.on('child_added', (child) => {
            this.handleReceive({
                text: child.val().text,
                name: child.val().name,
                image: {uri: child.val().avatarUrl || 'https://facebook.github.io/react/img/logo_og.png'},
                position: child.val().name == UserName && 'right' || 'left',
                date: new Date(child.val().date),
                uniqueId: child.key()
            });
        });
    }

    setMessages(messages) {
        this._messages = messages;

        this.setState({
            messages: messages,
        });
    }

    handleSend(message = {}) {
        this._messagesRef.push({
            text: message.text,
            name: UserName,
            avatarUrl: AvatarUrl,
            date: new Date().getTime()
        })
    }

    handleReceive(message = {}) {
        this.setMessages(this._messages.concat(message));
    }

    handleOutRequest() {
        this._messagesRef.push({
            text: '상대방이 나갔습니다',
            name: UserName,
            avatarUrl: AvatarUrl,
            date: new Date().getTime(),
            isExit: true
        });
    }

    requestNewMatch(uuid) {
        this._roomsRef = this._ref.child('rooms');
        let roomKey = null;
        this._roomsRef.orderByChild("userB").endAt("").limitToLast(1).once("value", function(snapshot) {
            console.log("a");
            if (snapshot.hasChildren()) {
                console.log("b");
                roomKey = Object.keys(snapshot.val())[0];
                let room = snapshot.val()[roomKey];
                let roomRef = new Firebase("https://chat-e6aab.firebaseio.com/users/");
                let roomKeyRef = new Firebase("https://chat-e6aab.firebaseio.com/rooms/" + roomKey);

                console.log(roomKeyRef.key());
                let updates = {
                    'userB':'new',
                    'matchedAt': new Date().getTime()
                };
                roomKeyRef.update(updates);
            }
            else {
                console.log("c");
                let roomsRef = new Firebase("https://chat-e6aab.firebaseio.com/rooms");
                let roomsKeyRef = roomsRef.push({
                    userA: uuid,
                    userB: null,
                    createdAt: new Date().getTime(),
                    matchedAt: null,
                    endedAt: null,
                });
                roomKey = roomsKeyRef.key();
            }

        });

        return this._ref.child('rooms/' + roomKey);

    }

    render() {
        return (
            <View style={{marginTop: CONTAINER_MARGIN}}>
                <GiftedMessenger
                    styles={{
            bubbleRight: {
              marginLeft: 70,
              backgroundColor: '#007aff',
            },
          }}
                    messages={this.state.messages}
                    handleSend={this.handleSend.bind(this)}
                    maxHeight={Dimensions.get('window').height - STATUS_BAR_HEIGHT - CONTAINER_MARGIN}
                />
            </View>
        );
    }
}


module.exports = MessengerContainer;
