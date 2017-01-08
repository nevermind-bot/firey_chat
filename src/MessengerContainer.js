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
    Button,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen'


var GiftedMessenger = require('react-native-gifted-messenger');

if (Platform.OS == 'ios') {
    var STATUS_BAR_HEIGHT = 0;
    var CONTAINER_MARGIN = 20;
    var UserName = 'ios';
    var AvatarUrl = 'https://source.unsplash.com/sseiVD2XsOk/100x100';
} else {
    var STATUS_BAR_HEIGHT = 100;
    var CONTAINER_MARGIN = 0;
    var UserName = 'android';
    var AvatarUrl = 'https://source.unsplash.com/2Ts5HnA67k8/100x100';
}


class MessengerContainer extends Component {

    constructor(props) {
        super(props);

        this.uuid = '정승진3';
        this._ref = new Firebase("https://chat-e6aab.firebaseio.com/");

        this._messagesRef = '';
        this._messages = [];

        this.state = {
            messages: this._messages,
            typingMessage: ''
        };
    }

    componentDidMount() {
        this.registerUser();
        this.requestNewMatch();
    }

    registerUser() {
        let userRef = this._ref.child('users');
        userRef.push({
            _id: this.uuid,
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
        });
    }

    requestNewMatch() {
        let _this = this;
        this._roomsRef = this._ref.child('rooms');
        let roomKey = null;
        this._roomsRef.orderByChild("userB").endAt("").limitToLast(1).once("value", function (snapshot) {
            if (snapshot.hasChildren()) {
                roomKey = Object.keys(snapshot.val())[0];
                let roomKeyRef = new Firebase("https://chat-e6aab.firebaseio.com/rooms/" + roomKey);
                let updates = {
                    'userB': _this.uuid,
                    'matchedAt': new Date().getTime()
                };
                roomKeyRef.update(updates);
                _this._messagesRef = _this._ref.child('messages/' + roomKey);
                _this.getMessagesFromRef();
            }
            else {
                let roomsRef = new Firebase("https://chat-e6aab.firebaseio.com/rooms");
                let roomsKeyRef = roomsRef.push({
                    userA: _this.uuid,
                    userB: null,
                    createdAt: new Date().getTime(),
                    matchedAt: null,
                    endedAt: null,
                });
                roomKey = roomsKeyRef.key();
                _this._messagesRef = _this._ref.child('messages/' + roomKey);
                _this.getMessagesFromRef();
            }
        });
    }

    getMessagesFromRef() {
        this._messagesRef.on('child_added', (child) => {
            this.handleReceive({
                text: child.val().text,
                name: child.val().name,
                image: {uri: child.val().avatarUrl || 'https://facebook.github.io/react/img/logo_og.png'},
                position: child.val().name == this.uuid && 'right' || 'left',
                date: new Date(child.val().date),
                uniqueId: child.key()
            });
        });
    }

    handleReceive(message = {}) {
        this._messages = this._messages.concat(message);
        this.setState({
            messages: this._messages,
        })
    }

    handleSend(message = {}) {
        this._messagesRef.push({
            text: message.text,
            name: this.uuid,
            avatarUrl: AvatarUrl,
            date: new Date().getTime()
        })
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


    findNewMatch() {
        this.setState({
            messages: [],
        });
        this.requestNewMatch();

    }

    render() {
        return (
            <View style={{marginTop: CONTAINER_MARGIN}}>
                <View style={{height:45, backgroundColor: 'powderblue'}}>
                    <Button
                        onPress={() => this.findNewMatch()}
                        title="다른 상대 찾기"
                        color="black"
                    />
                </View>
                <GiftedMessenger
                    styles={{bubbleRight: {marginLeft: 70, backgroundColor: '#007aff',},}}
                    messages={this.state.messages}
                    handleSend={this.handleSend.bind(this)}
                    maxHeight={Dimensions.get('window').height - STATUS_BAR_HEIGHT - CONTAINER_MARGIN -50}
                />
            </View>
        );
    }
}


module.exports = MessengerContainer;
