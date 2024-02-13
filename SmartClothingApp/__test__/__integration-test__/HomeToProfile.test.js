import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../src/screens/HomeScreen/index.jsx';
import ProfileScreen from '../../src/screens/Profile/index.jsx';
import configureStore from '../../src/store.js';
import {Provider as StoreProvider } from 'react-redux'; 
import {PaperProvider}  from "react-native-paper";
import { render } from '@testing-library/react-native';
import {fireEvent } from '@testing-library/react-native';
import {waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';



const Stack = createStackNavigator();

// Mock Firebase Authentication
jest.mock('../../firebaseConfig.js', () => ({
    auth: {
      loginWithEmail: jest.fn(() => Promise.resolve()),
      startLoginWithEmail: jest.fn(() => Promise.resolve()),
      startLoadUserData: jest.fn(() => Promise.resolve()),
      startUpdateUserData: jest.fn(() => Promise.resolve()),
      updateUserMetricsData: jest.fn(() => Promise.resolve()),
      currentUser: {
        uid: {
          "email": "test1@gmail.com", 
          "firstName": "MisterTest",
          "lastName": "Johnson", 
          "uuid": "nvQpwMHj7eUKfsyEhVloGM7hvji2"
        },
        email: 'test1@gmail.com',
        password: 'password123'
      },
    },
  }));

jest.mock('firebase/auth', () => ({
    initializeApp: jest.fn(),
    registerVersion: jest.fn(),
    getAuth: jest.fn(),
    getDatabase: jest.fn(),
  }))

jest.mock('../../src/utils/localStorage.js', () => ({
    AsyncStorage: jest.fn(),
    storeUID: jest.fn(),
    getUID: jest.fn(),
  }));

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(() => ({ add: jest.fn() })),
    addDoc: jest.fn(),
    setDoc: jest.fn(),
    doc: jest.fn(() => ({ setDoc: jest.fn() })),
    updateDoc: jest.fn(),
    getDoc: jest.fn().mockReturnValue({
      exists: jest.fn().mockReturnValue(true), // Mock 'exists' as a function
      data: jest.fn().mockReturnValue({
        height: "1111",
        weight: "11",
        age: "111",
        gender: "male",
        sports: "running",
      }), // Mock 'data' as a function
    }),
  }))

jest.mock('react-native-vector-icons/MaterialIcons', () => require('../__mocks__/react-native-vector-icons').MaterialIcons);
  jest.mock('react-native-vector-icons/FontAwesome5', () => require('../__mocks__/react-native-vector-icons').FontAwesome5);
  jest.mock('@shopify/react-native-skia', () => require('../__mocks__/@shopify__react-native-skia'));
  jest.mock('../../src/components/visualizations/ActivityRings/Ring.jsx', () => {
    return jest.fn(({ ring, center, strokeWidth, scale }) => (
      <div>
        Mock Ring Component - {ring.size}, {center.x}, {center.y}, {strokeWidth}, {scale}
      </div>
    ));
  });
  jest.mock('victory-native', () => {
    // Mock the specific components and functionalities you use
    const MockBar = () => <div>Mock Bar</div>;
    const MockCartesianChart = () => <div>Mock CartesianChart</div>;
    const MockUseChartPressState = () => ({ /* Mock return value */ });
  
    return {
      Bar: MockBar,
      CartesianChart: MockCartesianChart,
      useChartPressState: MockUseChartPressState,
    };
  });




  const TestComponent1 = () => (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );


describe('Home to Profile Navigation', () => {
  let store;

  it('navigates from Home to Profile screen', async () => {
    store = configureStore();

    const { getAllByTestId, getByText } = render(
        <StoreProvider store={store}>
        <PaperProvider> 
            <TestComponent1 />
        </PaperProvider>
        </StoreProvider>
    );

    const dropDownMenu = getAllByTestId('icon-button');
    await act(() => {
        fireEvent.press(dropDownMenu[0])
    });

    const menuItem = getAllByTestId('menu-item');
    await act(() => {
        fireEvent.press(menuItem[0])
    });

    await waitFor(() => {
        expect(getByText('Profile')).toBeTruthy();
    });

    // // Replace 'Profile' with the actual text or identifier triggering the navigation
    // const profileButton = await findByText('Profile');
    // fireEvent.press(profileButton);

    // // Check if the Profile screen is rendered after navigation
    // await waitFor(() => {
    //   expect(findByText('Edit Profile')).toBeTruthy();
    // });
  });

});