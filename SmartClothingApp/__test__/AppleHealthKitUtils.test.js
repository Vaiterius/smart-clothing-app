// Import the function to test
import { getHeartRateData } from '../src/utils/AppleHealthKit/AppleHealthKitUtils.js';
import { NativeModules } from 'react-native';

// Mock the MyHealthKitModule
NativeModules.MyHealthKitModule = {
  readHeartRateData: jest.fn(),
};

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