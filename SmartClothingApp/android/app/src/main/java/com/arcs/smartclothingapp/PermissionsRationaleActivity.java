package com.arcs.smartclothingapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import androidx.health.connect.client.HealthConnectClient;

/*public class PermissionsRationaleActivity extends Activity {

    private Context context;

    public void onCreate() {
        super.onCreate();
        PermissionsRationaleActivity.context = getApplicationContext();
    }

    public static Context getAppContext() {
        return PermissionsRationaleActivity.context;
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (intent.getAction().equals("ACTION_SHOW_PERMISSIONS_RATIONALE")) {
            // Show your privacy policy here
            System.out.print("privacy matters");
        }
    }

    protected void checkHealthConnectStatus(){
        int availabilityStatus = HealthConnectClient.getSdkStatus(context, providerPackageName);
        if (availabilityStatus == HealthConnectClient.SDK_AVAILABLE) {
            // Health Connect is installed, obtain a HealthConnectClient instance
            HealthConnectClient healthConnectClient = new HealthConnectClient(context, providerPackageName);
        }
    }
}*/
