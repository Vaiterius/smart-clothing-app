package com.arcs.smartclothingapp

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.StepsRecord
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.concurrentReactEnabled
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import expo.modules.BuildConfig
import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {



    override fun onCreate(savedInstanceState: Bundle?) {
        // Set the theme to AppTheme BEFORE onCreate to support 
        // coloring the background, status bar, and navigation bar.
        // This is required for expo-splash-screen.
        setTheme(R.style.AppTheme)
        super.onCreate(null)

        val healthConnClient = checkIfHealthConnectIsInstalled()
        if (healthConnClient == null) {
            Toast.makeText(this, "health connect must be installed", Toast.LENGTH_LONG).show()
        }
    }

    private fun checkIfHealthConnectIsInstalled(): HealthConnectClient? {
        val providerPackageName = "com.google.android.apps.healthdata"
        val availabilityStatus = HealthConnectClient.getSdkStatus(this, providerPackageName)
        if (availabilityStatus == HealthConnectClient.SDK_UNAVAILABLE) {
            return null// early return as there is no viable integration
        }
        if (availabilityStatus == HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
            // Optionally redirect to package installer to find a provider, for example:
            val uriString =
                "market://details?id=$providerPackageName&url=healthconnect%3A%2F%2Fonboarding"
            this.startActivity(
                Intent(Intent.ACTION_VIEW).apply {
                    setPackage("com.android.vending")
                    data = Uri.parse(uriString)
                    putExtra("overlay", true)
                    putExtra("callerId", this@MainActivity.packageName)
                }
            )
            return null
        }
        return HealthConnectClient.getOrCreate(this)
        // Issue operations with healthConnectClient
    }

private fun checkPermissionsAndRun(healthConnectClient: HealthConnectClient) {
    val PERMISSIONS = setOf(
        HealthPermission.getReadPermission(HeartRateRecord::class),
        HealthPermission.getWritePermission(HeartRateRecord::class),
        HealthPermission.getReadPermission(StepsRecord::class),
        HealthPermission.getWritePermission(StepsRecord::class)
    )
    try {
        // Create the permissions launcher
        val requestPermissionActivityContract =
            PermissionController.createRequestPermissionResultContract()

        val requestPermissions =
            registerForActivityResult(requestPermissionActivityContract) { granted ->
                if (granted.containsAll(PERMISSIONS)) {
                    Toast.makeText(this, "success", Toast.LENGTH_SHORT).show()
                    //checkPermissionsAndRun(healthConnectClient: HealthConnectClient)
                } else {
                    Toast.makeText(this, "fail", Toast.LENGTH_SHORT).show()
                }
            }
    } catch (e: Exception) {
        Toast.makeText(this, "fail", Toast.LENGTH_SHORT).show()
    }
}

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    override fun getMainComponentName(): String? {
        return "main"
    }

    /**
     * Returns the instance of the [ReactActivityDelegate]. Here we use a util class [ ] which allows you to easily enable Fabric and Concurrent React
     * (aka React 18) with two boolean flags.
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return ReactActivityDelegateWrapper(
            this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, DefaultReactActivityDelegate(
                this,
                mainComponentName!!,  // If you opted-in for the New Architecture, we enable the Fabric Renderer.
                fabricEnabled,  // fabricEnabled
                // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
                concurrentReactEnabled // concurrentRootEnabled
            )
        )
    }

    /**
     * Align the back button behavior with Android S
     * where moving root activities to background instead of finishing activities.
     * @see [](https://developer.android.com/reference/android/app/Activity.onBackPressed
    ) */
    override fun invokeDefaultOnBackPressed() {
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
            if (!moveTaskToBack(false)) {
                // For non-root activities, use the default implementation to finish them.
                super.invokeDefaultOnBackPressed()
            }
            return
        }

        // Use the default back button implementation on Android S
        // because it's doing more than {@link Activity#moveTaskToBack} in fact.
        super.invokeDefaultOnBackPressed()
    }

    // Handle the result of permission requests
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == READ_EXTERNAL_STORAGE_REQUEST_CODE) {
            if (grantResults.size > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted, you can now access external storage for reading.
            } else {
                // Permission denied, handle accordingly.
            }
        } else if (requestCode == WRITE_EXTERNAL_STORAGE_REQUEST_CODE) {
            if (grantResults.size > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted, you can now access external storage for writing.
            } else {
                // Permission denied, handle accordingly.
            }
        }
    }

    companion object {
        // Request codes for permission requests
        private const val READ_EXTERNAL_STORAGE_REQUEST_CODE = 2
        private const val WRITE_EXTERNAL_STORAGE_REQUEST_CODE = 5
        private const val SYSTEM_ALERT_WINDOW_REQUEST_CODE = 3
    }
}