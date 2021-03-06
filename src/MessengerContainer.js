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

import FireyFirebase from "./FirebaseConfig";
import * as AsyncStorage from "react-native/Libraries/Storage/AsyncStorage";


let GiftedMessenger = require('react-native-gifted-messenger');

if (Platform.OS == 'ios') {
    var STATUS_BAR_HEIGHT = 0;
    var CONTAINER_MARGIN = 20;
    var UserName = 'ios';
    var AvatarUrl = 'https://source.unsplash.com/sseiVD2XsOk/100x100';
} else {
    var STATUS_BAR_HEIGHT = 0;
    var CONTAINER_MARGIN = 20;
    var UserName = 'android';
    var AvatarUrl = 'https://source.unsplash.com/2Ts5HnA67k8/100x100';
}


class MessengerContainer extends Component {

    constructor(props) {
        super(props);

        this.uuid = AsyncStorage.getItem('uuid');
        this.dbRepo = FireyFirebase.firey_firebase.database();
        this.dbBaseMessagesRepo = this.dbRepo.ref('messages');
        this.dbRoomsRepo = this.dbRepo.ref('rooms');
        this.dbUsersRepo = this.dbRepo.ref('users');
        this.dbMessagesRepo = null;

        this._messages = [];

        this.state = {
            messages: this._messages,
            typingMessage: ''
        };
    }

    componentDidMount() {
        this.findLastRoom();
        // this.checkOldUser()
        //     .then(uuid => {
        //         if (uuid) {
        //             this.uuid = uuid;
        //             this.findLastRoom();
        //         } else {
        //             this.makeNewUUID();
        //             this.requestNewMatch();
        //         }
        //     });
    }

    checkOldUser() {
        // 기존에 갖고 있는 UserID를 가져와야한다 LocalStorage 같은 것
        return this.dbUsersRepo.orderByChild('id').equalTo(this.uuid).once('value').then(function(snapshot) {
            if (snapshot.val()) {
                return snapshot.val().id;
            } else {
                return null;
            }
        });
    }

    makeNewUUID() {
        let _this = this;
        FireyFirebase.firey_firebase.auth().signInAnonymously()
            .then(function() {
                return FireyFirebase.firey_firebase.auth().onAuthStateChanged(function(user){
                    _this.dbUsersRepo.push({
                        id: user.uid,
                        avatar: 'https://facebook.github.io/react/img/logo_og.png',
                        lastLogin: new Date().getTime(),
                    });
                    _this.uuid = user.uid;
                });
            });
    }

    findLastRoom() {
        let _this = this;
        AsyncStorage.getItem('roomKey')
            .then(function(roomKey) {
                if (roomKey) {
                    _this.dbMessagesRepo = _this.dbBaseMessagesRepo.child(roomKey);
                    _this.getMessagesFromRef();
                } else {
                    _this.requestNewMatch();
                }
            });
    }

    requestNewMatch() {
        let _this = this;
        let roomKey = null;
        this.dbRoomsRepo.orderByChild("userB").endAt("").limitToLast(1).once("value", function (snapshot) {
            if (snapshot.hasChildren()) {
                roomKey = Object.keys(snapshot.val())[0];
                let roomKeyRef = _this.dbRoomsRepo.child(roomKey);
                let updates = {
                    'userB': _this.uuid,
                    'matchedAt': new Date().getTime()
                };
                roomKeyRef.update(updates);
                _this.dbMessagesRepo = _this.dbBaseMessagesRepo.child(roomKey);
                _this.getMessagesFromRef();
                AsyncStorage.setItem('roomKey', roomKey);
            }
            else {
                let roomsKeyRef = _this.dbRoomsRepo.push({
                    userA: _this.uuid,
                    userB: null,
                    createdAt: new Date().getTime(),
                    matchedAt: null,
                    endedAt: null,
                });
                roomKey = roomsKeyRef.key;
                _this.dbMessagesRepo = _this.dbBaseMessagesRepo.child(roomKey);
                _this.getMessagesFromRef();
                AsyncStorage.setItem('roomKey', roomKey);
            }
        });
    }

    getMessagesFromRef() {
        this.dbMessagesRepo.on('child_added', (child) => {
            this.handleReceive({
                text: child.val().text,
                name: child.val().name,
                image: {uri: child.val().avatarUrl || 'https://facebook.github.io/react/img/logo_og.png'},
                position: child.val().name == this.uuid && 'right' || 'left',
                date: new Date(child.val().date),
                uniqueId: child.key
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
        this.dbMessagesRepo.push({
            text: message.text,
            name: this.uuid,
            avatarUrl: AvatarUrl,
            date: new Date().getTime()
        })
    }

    handleOutRequest() {
        this.dbMessagesRepo.push({
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
