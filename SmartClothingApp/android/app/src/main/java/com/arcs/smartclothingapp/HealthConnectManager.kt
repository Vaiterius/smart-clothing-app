package com.arcs.smartclothingapp

import android.app.Activity
import android.content.Context
import android.os.Build
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContract
import androidx.activity.result.ActivityResultLauncher
import androidx.compose.runtime.mutableStateOf
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.HealthConnectClient.Companion.SDK_AVAILABLE
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.changes.Change
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.Record
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.WeightRecord
import androidx.health.connect.client.records.metadata.DataOrigin
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import androidx.health.connect.client.units.Mass
import java.time.Instant
import java.time.ZonedDateTime

// The minimum android level that can use Health Connect
const val MIN_SUPPORTED_SDK = Build.VERSION_CODES.O_MR1

/**
 * Demonstrates reading and writing from Health Connect.
 */
class HealthConnectManager(private val context: Context) {
    private val healthConnectClient by lazy { HealthConnectClient.getOrCreate(context) }

    var availability = mutableStateOf(HealthConnectAvailability.NOT_SUPPORTED)
        private set

    init {
        checkAvailability()
    }

    val permissions = setOf(
        HealthPermission.getReadPermission(HeartRateRecord::class),
        HealthPermission.getReadPermission(StepsRecord::class)
    )

    suspend fun hasAllPermissions(permissions: Set<String>): Boolean {
        return healthConnectClient.permissionController.getGrantedPermissions().containsAll(permissions)
    }

    suspend fun requestPermissionsActivityContract(): ActivityResultContract<Set<String>, Set<String>> {
        return PermissionController.createRequestPermissionResultContract()
    }

    private fun checkAvailability() {
        availability.value = when {
            HealthConnectClient.getSdkStatus(context) == SDK_AVAILABLE -> HealthConnectAvailability.INSTALLED
            isSupported() -> HealthConnectAvailability.NOT_INSTALLED
            else -> HealthConnectAvailability.NOT_SUPPORTED
        }
    }

    /**
     * Determines whether all the specified permissions are already granted. It is recommended to
     * call [PermissionController.getGrantedPermissions] first in the permissions flow, as if the
     * permissions are already granted then there is no need to request permissions via
     * [PermissionController.createRequestPermissionResultContract].
     */
/*    fun requestPermissions() {
        val requestPermissions = registerForActivityResult(
            permissionController.createRequestPermissionResultContract()
        ) {
            grantedPermissions ->
            if (grantedPermissions.containsAll(permissions)) {
                //granted
            } else {
                //permission denied
            }
        }
        requestPermissions.launch(permissions)
    }*/

    /**
     * TODO: Reads in existing [WeightRecord]s.
     */
    suspend fun readWeightInputs(start: Instant, end: Instant): List<WeightRecord> {
        // Toast.makeText(context, "TODO: read weight inputs", Toast.LENGTH_SHORT).show()
        return emptyList()
    }

    /**
     * TODO: Returns the weekly average of [WeightRecord]s.
     */
    suspend fun computeWeeklyAverage(start: Instant, end: Instant): Mass? {
        // Toast.makeText(context, "TODO: get average weight", Toast.LENGTH_SHORT).show()
        return null
    }

    /**
     * TODO: Build [HeartRateRecord].
     */
    private fun buildHeartRateSeries(
        sessionStartTime: ZonedDateTime,
        sessionEndTime: ZonedDateTime,
    ): HeartRateRecord {
        TODO()
    }

    /**
     * Convenience function to reuse code for reading data.
     */
    private suspend inline fun <reified T : Record> readData(
        timeRangeFilter: TimeRangeFilter,
        dataOriginFilter: Set<DataOrigin> = setOf(),
    ): List<T> {
        val request = ReadRecordsRequest(
            recordType = T::class,
            dataOriginFilter = dataOriginFilter,
            timeRangeFilter = timeRangeFilter
        )
        return healthConnectClient.readRecords(request).records
    }

    private fun isSupported() = Build.VERSION.SDK_INT >= MIN_SUPPORTED_SDK

    // Represents the two types of messages that can be sent in a Changes flow.
    sealed class ChangesMessage {
        data class NoMoreChanges(val nextChangesToken: String) : ChangesMessage()
        data class ChangeList(val changes: List<Change>) : ChangesMessage()
    }
}

/**
 * Health Connect requires that the underlying Health Connect APK is installed on the device.
 * [HealthConnectAvailability] represents whether this APK is indeed installed, whether it is not
 * installed but supported on the device, or whether the device is not supported (based on Android
 * version).
 */
enum class HealthConnectAvailability {
    INSTALLED,
    NOT_INSTALLED,
    NOT_SUPPORTED
}