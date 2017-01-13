import FireyFirebase from "./FirebaseConfig";


// TODO : 설치 후 한번만 UUID 등록하도록
class AuthController {
    constructor() {
        this.uuid = '';
        this.dbUsersRepo = FireyFirebase.firey_firebase.database().ref('users');
        this.dbRoomsRepo = FireyFirebase.firey_firebase.database().ref('rooms');
        //noinspection JSUnresolvedFunction
        this.checkOldUser()
            .then(uuid => {
                if (uuid) {
                    this.uuid = uuid;
                } else {
                    this.makeNewUUID();
                }
            });
    }

    getUUID() {
        return this.uuid;
    }

    checkOldUser() {
        let tempUserKey = '1a2b3c4d';
        return this.dbUsersRepo.child(tempUserKey).once('value').then(function(snapshot) {
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

    getLastRoom(uuid) {
        this.dbRoomsRepo.orderByChild("");
        return [];
    }
}

export default AuthController

