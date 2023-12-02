// Import the function to test
import { getHeartRateData, checkHealthKitAvailability, requestHealthKitAuthorization, getActivityRingsData, getActiveEnergyData, getSleepData, getRestingHeartRateData, getHeartRateVariabilityData } from '../src/utils/AppleHealthKit/AppleHealthKitUtils.js';
import { NativeModules } from 'react-native';



describe('AppleHealthKitUtils', () => {
  beforeEach(() => {
    // Reset and set up the mock for MyHealthKitModule before each test
    NativeModules.MyHealthKitModule = {
      readHeartRateData: jest.fn(),
      isHealthDataAvailable: jest.fn(),
      requestHealthKitAuthorization: jest.fn(),
      fillActivityRings: jest.fn(),
      readActiveEnergyData: jest.fn(),
      readSleepData: jest.fn(),
      readRestingHeartRateData: jest.fn(),
      readHeartRateVariabilityData: jest.fn(),
    };
    consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore the original implementation of console.log after each test
    consoleLogMock.mockRestore();
  });

  describe('checkHealthKitAvailability', () => {
    it('returns true when HealthKit is available', async () => {
      NativeModules.MyHealthKitModule.isHealthDataAvailable.mockResolvedValue(true);
  
      const result = await checkHealthKitAvailability();
  
      expect(result).toBe(true);
    });
  
    it('returns false when HealthKit is not available', async () => {
      NativeModules.MyHealthKitModule.isHealthDataAvailable.mockResolvedValue(false);
  
      const result = await checkHealthKitAvailability();
  
      expect(result).toBe(false);
    });
  
    it('returns false and logs error when there is an exception', async () => {
      const errorMessage = 'MyHealthKitModule is not available.';
      NativeModules.MyHealthKitModule.isHealthDataAvailable.mockRejectedValue(new Error(errorMessage));
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      const result = await checkHealthKitAvailability();
  
      expect(consoleErrorMock).toHaveBeenCalledWith(new Error(errorMessage));
      expect(result).toBe(false);
    });
  });

  describe('requestHealthKitAuthorization', () => {
    it('returns true when authorization is granted', async () => {
      NativeModules.MyHealthKitModule.requestHealthKitAuthorization.mockResolvedValue(true);

      const result = await requestHealthKitAuthorization();

      expect(result).toBe(true);
    });

    it('returns false when authorization fails', async () => {
      NativeModules.MyHealthKitModule.requestHealthKitAuthorization.mockResolvedValue(false);

      const result = await requestHealthKitAuthorization();

      expect(result).toBe(false);
    });

    it('returns false and logs error when there is an exception in requestHealthKitAuthorization', async () => {
      const errorMessage = 'MyHealthKitModule is not available.';
      NativeModules.MyHealthKitModule = undefined;
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    
      const result = await requestHealthKitAuthorization();

      expect(consoleErrorMock).toHaveBeenCalledWith(errorMessage);
      expect(result).toBe(false);
    });
  });

  describe('getHeartRateData', () => {
    it('retrieves heart rate data successfully', async () => {
      // Mock the implementation of readHeartRateData to return sample data
      const sampleData = [{ heartRate: 60, date: '2023-01-01T00:00:00Z' }];
      NativeModules.MyHealthKitModule.readHeartRateData.mockResolvedValue(sampleData);

      const result = await getHeartRateData();

      // Test that the data is returned correctly
      expect(result.heartRates).toEqual([60]);
      expect(result.dateTimes).toEqual(['2023-01-01T00:00:00Z']);
    });

    it('handles errors when retrieving heart rate data', async () => {
      // Mock the implementation to reject with an error
      const errorMessage = 'Error retrieving heart rate data';
      NativeModules.MyHealthKitModule.readHeartRateData.mockRejectedValue(new Error(errorMessage));

      await expect(getHeartRateData()).rejects.toThrow(errorMessage);
    });
  });

  // fillActivityRings() is commented out in MyHealthKitModule.m file
  describe('getActivityRingsData', () => {
    // it('retrieves activity rings data successfully', async () => {
    //   const sampleData = { Move: 500 }; // Example data
    //   NativeModules.MyHealthKitModule.fillActivityRings.mockResolvedValue(sampleData);
    
    //   const result = await getActivityRingsData();
    
    //   expect(result).toEqual({ Move: 500 });
    //   expect(console.log).toHaveBeenCalledWith('Activity Rings Data:', sampleData);
    //   expect(console.log).toHaveBeenCalledWith('Move:', 500);
    // });

    it('handles errors when retrieving activity rings data', async () => {
      const errorMessage = 'Error retrieving activity rings data';
      NativeModules.MyHealthKitModule.fillActivityRings.mockRejectedValue(new Error(errorMessage));
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    
      await getActivityRingsData();
    
      expect(consoleErrorMock).toHaveBeenCalledWith(' Error retrieving activity rings data:', new Error(errorMessage));
    });
    
    it('handles unexpected data format', async () => {
      NativeModules.MyHealthKitModule.fillActivityRings.mockResolvedValue({ unexpectedKey: 123 });
    
      const result = await getActivityRingsData();
    
      // You can check for specific behavior here, depending on how getActivityRingsData should handle unexpected data
      // For example, check if it returns undefined or a default value
      expect(result).toBeUndefined(); // or any other expected behavior
    });
  });

  describe('getActiveEnergyData', () => {
    it('retrieves active energy data successfully', async () => {
      const sampleData = [{ activeEnergy: 100, date: '2023-01-01T00:00:00Z' }]; // Example data
      NativeModules.MyHealthKitModule.readActiveEnergyData.mockResolvedValue(sampleData);
    
      const result = await getActiveEnergyData();
    
      expect(result.activeEnergies).toEqual([100]);
      expect(result.dateTimes).toEqual(['2023-01-01T00:00:00Z']);
      expect(console.log).toHaveBeenCalledWith('Active Energy Data:', sampleData);
      expect(console.log).toHaveBeenCalledWith('Active Energies:', [100]);
      expect(console.log).toHaveBeenCalledWith('Date/Times:', ['2023-01-01T00:00:00Z']);
    });
    
    it('handles errors when retrieving active energy data', async () => {
      const errorMessage = 'Error retrieving active energy data';
      NativeModules.MyHealthKitModule.readActiveEnergyData.mockRejectedValue(new Error(errorMessage));
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    
      await getActiveEnergyData();
    
      expect(consoleErrorMock).toHaveBeenCalledWith('Error retrieving active energy data:', new Error(errorMessage));
    });
  });

  describe('getSleepData', () => {
    it('retrieves sleep data successfully', async () => {
      const mockSleepData = [
        { startDate: '2023-01-01T22:00:00Z', endDate: '2023-01-02T06:00:00Z' },
        { startDate: '2023-01-02T00:00:00Z', endDate: '2023-01-02T06:00:00Z' }
        // ... add more mock data points as needed ...
      ];
      NativeModules.MyHealthKitModule.readSleepData.mockResolvedValue(mockSleepData);
    
      const result = await getSleepData();
    
      expect(result.sleepLabels).toEqual(['Deep', 'Core']); 
      expect(result.startTimes).toEqual(['2023-01-01T22:00:00Z', '2023-01-02T00:00:00Z']);
      expect(result.endTimes).toEqual(['2023-01-02T06:00:00Z', '2023-01-02T06:00:00Z']);
    });
    
    it('handles errors when retrieving sleep data', async () => {
      const errorMessage = 'Error retrieving sleep data';
      NativeModules.MyHealthKitModule.readSleepData.mockRejectedValue(new Error(errorMessage));
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    
      await getSleepData();
    
      expect(consoleErrorMock).toHaveBeenCalledWith('Error retrieving sleep data:', new Error(errorMessage));
    });
  });

  describe('getRestingHeartRateData', () => {
    it('retrieves resting heart rate data successfully', async () => {
      const mockRestingHeartRateData = [
        { heartRateValue: 60, date: '2023-01-01T00:00:00Z' },
        // ... add more mock data points as needed ...
      ];
      NativeModules.MyHealthKitModule.readRestingHeartRateData.mockResolvedValue(mockRestingHeartRateData);
    
      const result = await getRestingHeartRateData();
    
      // Example assertions
      expect(result.heartRates).toEqual([60]); // Based on mock data
      expect(result.dateTimes).toEqual(['2023-01-01T00:00:00Z']); // Based on mock data
      expect(console.log).toHaveBeenCalledWith('Resting Heart Rate Data:', mockRestingHeartRateData);
      expect(console.log).toHaveBeenCalledWith('Resting Heart Rates:', [60]);
      expect(console.log).toHaveBeenCalledWith('Date/Times:', ['2023-01-01T00:00:00Z']);
    });
    
    it('handles errors when retrieving resting heart rate data', async () => {
      const errorMessage = 'Error retrieving resting heart rate data';
      NativeModules.MyHealthKitModule.readRestingHeartRateData.mockRejectedValue(new Error(errorMessage));
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    
      await getRestingHeartRateData();
    
      expect(consoleErrorMock).toHaveBeenCalledWith('Error retrieving resting heart rate data:', new Error(errorMessage));
    });
  })

  describe('getHeartRateVariabilityData', () => {
    it('retrieves heart rate variability data successfully', async () => {
      const mockHRVData = [
        { hrvValue: 25, date: '2023-01-01T00:00:00Z' },
        // ... additional mock data points ...
      ];
      NativeModules.MyHealthKitModule.readHeartRateVariabilityData.mockResolvedValue(mockHRVData);
    
      const result = await getHeartRateVariabilityData();
    
      expect(result.hrvValues).toEqual([25]); // Adjust based on mock data
      expect(result.dateTimes).toEqual(['2023-01-01T00:00:00Z']); // Adjust based on mock data
      expect(console.log).toHaveBeenCalledWith('Heart Rate Variability Data:', mockHRVData);
      expect(console.log).toHaveBeenCalledWith('HRV Values:', [25]);
      expect(console.log).toHaveBeenCalledWith('Date/Times:', ['2023-01-01T00:00:00Z']);
    });
    
    it('handles errors when retrieving heart rate variability data', async () => {
      const errorMessage = 'Error retrieving heart rate variability data';
      NativeModules.MyHealthKitModule.readHeartRateVariabilityData.mockRejectedValue(new Error(errorMessage));

      await expect(getHeartRateVariabilityData()).rejects.toThrow(errorMessage);
    });    
  });
});