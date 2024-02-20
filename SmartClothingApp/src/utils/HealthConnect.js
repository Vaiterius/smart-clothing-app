import { 
    initialize,
    getSdkStatus,
    SdkAvailabilityStatus,
    requestPermission,
    getGrantedPermissions,
    readRecords
 } from "react-native-health-connect";

export class HealthConnect {
    initalizeHealthConnect = async () => {
        const isInitialized = await initialize();
        console.log({ isInitialized });
    }

    checkAvailability = async () => {
        var status = await getSdkStatus();
        if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
            console.log("SDK is available");
        }
        if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
            console.log("SDK is not available");
        }
        if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
            console.log("SDk is unavailable, provider update required");
        }
    }

    requestPermission = () => {
        requestPermission([
            {
                accessType: "read",
                recordType: "HeartRate",
            },
            {
                accessType: "read",
                recordType: "Steps",
            },
        ]).then((permissions) => {
            console.log("Granted permissions", { permissions });
        });
    }

    readGrantedPermissions = () => {
        getGrantedPermissions().then((permissions) => {
          console.log('Granted permissions ', { permissions });
        });
    }

    insertSampleData = () => {
        let date = new Date();
        insertRecords([
        {
            heartRate: 80,
            startDate: date.toISOString(),
            endDate: date.toISOString(),
            metadata: {
              someKey: 'Test',
            },
        }
        ]).then((ids) => {
          console.log('Records inserted ', { ids }); // Records inserted  {"ids": ["06bef46e-9383-4cc1-94b6-07a5045b764a", "a7bdea65-86ce-4eb2-a9ef-a87e6a7d9df2"]}
        });
    }

    readHeartData = (startTime, endTime) => {
        readRecords('HeartRate', {
            timeRangeFilter: {
            operator: "before",
            startTime: "${startTime}",
            endTime: "${endTime}"
            }
        }).then((result) => {
            console.log('Retrieved records: ', JSON.stringify({ result }, null, 2)); // Retrieved records:  {"result":[{"startTime":"2023-01-09T12:00:00.405Z","endTime":"2023-01-09T23:53:15.405Z","energy":{"inCalories":15000000,"inJoules":62760000.00989097,"inKilojoules":62760.00000989097,"inKilocalories":15000},"metadata":{"id":"239a8cfd-990d-42fc-bffc-c494b829e8e1","lastModifiedTime":"2023-01-17T21:06:23.335Z","clientRecordId":null,"dataOrigin":"com.healthconnectexample","clientRecordVersion":0,"device":0}}]}
        });
    }
}