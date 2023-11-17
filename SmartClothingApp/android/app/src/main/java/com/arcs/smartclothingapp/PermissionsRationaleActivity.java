package com.arcs.smartclothingapp;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;

import androidx.activity.result.contract.ActivityResultContract;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.health.connect.client.HealthConnectClient;
import androidx.health.connect.client.PermissionController;
import androidx.health.connect.client.request.HeartRateRecord;

import java.util.Set;

// Define the activity class
public class PermissionsRationaleActivity extends Activity {

    // The request code for the permissions request
    private static final int READ_HEALTH_PERMISSION_CODE = 30;

    // The permissions that your app needs
    private static final String[] READ_HEALTH_PERMISSIONS = {
            "android.permission.health.READ_HEART_RATE",
            "android.permission.health.READ_STEP_COUNT"
    };

    // A flag to indicate whether the user has agreed to the privacy policy
    private boolean mUserAgreed = false;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_permission_explanation);

        int availabilityStatus = HealthConnectClient.sdkStatus(PermissionsRationaleActivity.this, "com.google.android.apps.healthdata");
        if (availabilityStatus == HealthConnectClient.SDK_UNAVAILABLE)
        {
            //don't have the Health Client, cant record data
            return;
        }
        HealthConnectClient healthClient = HealthConnectClient.getOrCreate(PermissionsRationaleActivity.this);

        ActivityResultContract<Set<String>, Set<String>> requestPermissionActivityContract = PermissionController.createRequestPermissionResultContract();
        int requestPermissions = registerForActivityResult(requestPermissionActivityContract) {
            granted ->
            if (granted.containsAll(READ_HEALTH_PERMISSIONS)) {
                //permission granted
            } else {
                //permission denied
            }
        }

        // Set up the button to accept the privacy policy and request permissions
        Button acceptButton = findViewById(R.id.terms_accept_button);
        acceptButton.setOnClickListener(v -> {
            if (ContextCompat.checkSelfPermission(PermissionsRationaleActivity.this,
                    Manifest.permission.READ_HEART_RATE) == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(PermissionsRationaleActivity.this, "you have granted this permission", Toast.LENGTH_SHORT).show();
            } else {

            }
        });
    }

    private void checkPermissionsAndRun(HealthConnectClient healthConnectClient) {
        int granted = healthConnectClient.permissionController.get
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        //if request code is the all perms code
        if (requestCode == READ_HEALTH_PERMISSION_CODE) {
            // mark all granted flag, then loop the permissions to verify
            boolean allGranted = true;
            for (int grantResult : grantResults) {
                if (grantResult != PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }

            if (allGranted) {
                // All permissions are granted, proceed to the next activity
                Intent intent = new Intent(this, HealthConnectClient.class);
                startActivity(intent);
                finish();
            } else {
                // Some permissions are denied, show a toast message and finish the activity
                Toast.makeText(this, "Please grant all permissions to use Health Connect", Toast.LENGTH_SHORT).show();
                finish();
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (mUserAgreed) {
            finish();
        } else {
            // The user has not agreed to the privacy policy, finish the activity
            finish();
        }
    }
}
