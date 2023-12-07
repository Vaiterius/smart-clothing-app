package com.arcs.smartclothingapp

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
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
    private val PERMISSIONS = setOf(
        HealthPermission.getReadPermission(HeartRateRecord::class),
        HealthPermission.getWritePermission(HeartRateRecord::class),
        HealthPermission.getReadPermission(StepsRecord::class),
        HealthPermission.getWritePermission(StepsRecord::class)
    )
    private lateinit var requestPermissionLauncher: ActivityResultLauncher<String>

    override fun onCreate(savedInstanceState: Bundle?) {
        // Set the theme to AppTheme BEFORE onCreate to support 
        // coloring the background, status bar, and navigation bar.
        // This is required for expo-splash-screen.
        setTheme(R.style.AppTheme)
        super.onCreate(savedInstanceState)
        Log.println(Log.DEBUG, "debug", "made it to oncreate")
        requestPermissionLauncher =
            registerForActivityResult(ActivityResultContracts.RequestPermission()) {
                if (it) {

                }
        /*val healthConnectManager = checkIfHealthConnectIsInstalled()
        if (healthConnectManager == null)
        {
            Toast.makeText(this, "no health connect installed", Toast.LENGTH_LONG)
        } else {
            myFun(healthConnectManager)
        }*/
    }

    private fun checkIfHealthConnectIsInstalled(): HealthConnectClient {
        val providerPackageName = "com.google.android.apps.healthdata"
        val availabilityStatus = HealthConnectClient.getSdkStatus(this, providerPackageName)
        if (availabilityStatus == HealthConnectClient.SDK_UNAVAILABLE) {
            return HealthConnectClient.getOrCreate(this)// early return as there is no viable integration
            //may be a bad thing to get on a non existing SDK
            //I did this because I need a HealthConnectClient type and cant use a nullable
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
            return HealthConnectClient.getOrCreate(this)
        }
        return HealthConnectClient.getOrCreate(this)
        // Issue operations with healthConnectClient
    }

    private fun myFun(healthConnectionClient: HealthConnectClient) {
        val requestPermissionActivityContract = PermissionController.createRequestPermissionResultContract()
        val requestPermissions = registerForActivityResult(requestPermissionActivityContract) { granted ->
            if (granted.containsAll(PERMISSIONS)) {
                // Permissions successfully granted

            } else {
                // Lack of required permissions
                Toast.makeText(this, "please enable permissions", Toast.LENGTH_LONG).show()
            }
        }

    }

    suspend fun checkPermissionsAndRun(healthConnectClient: HealthConnectClient) {
        val granted = healthConnectClient.permissionController.getGrantedPermissions()
        if (granted.containsAll(PERMISSIONS)) {
            // Permissions already granted; proceed with inserting or reading data
        } else {
            requestPermissions.launch(PERMISSIONS)
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