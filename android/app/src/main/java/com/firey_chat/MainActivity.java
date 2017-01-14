package com.firey_chat;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.cboy.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, true);  // here
        super.onCreate(savedInstanceState);
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "firey_chat";
    }
}
