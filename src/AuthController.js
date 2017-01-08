import FireyFirebase from "./FirebaseConfig";


// TODO : 설치 후 한번만 UUID 등록하도록
class AuthController {
    constructor() {
        this.uuid = '';
        //noinspection JSUnresolvedFunction
        FireyFirebase.firey_firebase.auth().signInAnonymously().catch(function(error) {
            console.log('Anonymous UUID 발급 실패');
            console.log(error);
        }).then(function() {
            //noinspection JSUnresolvedFunction
            FireyFirebase.firey_firebase.auth().onAuthStateChanged(function(user){
                console.log('User Register Success');
                console.log(user.uid);
                this.uuid = user.uid;
            });
        });
    }
    getUUID() {
        return this.uuid;
    }
}

export default AuthController

