class FireyFirebase {
    constructor() {
        if(!FireyFirebase.instance) {
            this.firey_firebase = require("firebase");
            this.firey_firebase_config = {
                apiKey: "AIzaSyBpR1bwkKU_0uuvNgKQSSZNaugGsJoVlJs",
                authDomain: "chat-e6aab.firebaseapp.com",
                databaseURL: "https://chat-e6aab.firebaseio.com",
                storageBucket: "chat-e6aab.appspot.com",
                messagingSenderId: "113210889715"
            };
            this.firey_firebase.initializeApp(this.firey_firebase_config);
        }
        return FireyFirebase.instance;
    }
}

const instance = new FireyFirebase();
Object.freeze(instance);

export default instance;