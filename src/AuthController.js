import Firebase from 'firebase';

class AuthController {
    constructor() {
        this.uuid = '';

        const ref = new Firebase("https://chat-e6aab.firebaseio.com/");
        //noinspection JSUnresolvedFunction
        ref.auth().signInAnonymously().catch(function(error) {
            console.log('Anonymous UUID 발급 실패');
            console.log(error);
        }).then(function() {
            //noinspection JSUnresolvedFunction
            ref.auth().onAuthStateChanged(function(user){
                console.log('User Register Success');
                console.log(user);
                this.uuid = user.uid;
            });
        });
    }

    getUUID() {
        return this.uuid;
    }
}

export default AuthController