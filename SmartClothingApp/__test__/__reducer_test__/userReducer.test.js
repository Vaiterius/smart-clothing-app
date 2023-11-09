import {userReducer} from '../../src/reducers/userReducer.js';
import {
  LOGIN_WITH_EMAIL,
  SIGNUP_WITH_EMAIL,
  LOGOUT,
  UPDATE_PROFILE,
  UPDATE_USER_METRICS_DATA,
  UPDATE_EMAIL_SUCCESS,
} from '../../src/actions/types';


jest.mock('../../src/reducers/userReducer.js', () => ({
  userReducer: jest.fn().mockImplementationOnce(() => Promise.resolve({
    initialState: {
      uuid: null,
      firstName: null,
      lastName: null,
      email: null,
      authError: null,
      userMetricsData: {
        gender: 'No Data',
        dob: new Date(),
        height: 'No Data',
        weight: 'No Data',
        sports: 'No Data',
      },
    }
  })),
  // initialState: {
  //   uuid: null,
  //   firstName: null,
  //   lastName: null,
  //   email: null,
  //   authError: null,
  //   userMetricsData: {
  //     gender: 'No Data',
  //     dob: new Date(),
  //     height: 'No Data',
  //     weight: 'No Data',
  //     sports: 'No Data',
  //   },
  // }
}));

// jest.mock('../../src/actions/types', () => ({
//   LOGIN_WITH_EMAIL: jest.fn(() => Promise.resolve()),
//   SIGNUP_WITH_EMAIL: jest.fn(() => Promise.resolve()),
//   LOGOUT: jest.fn(() => Promise.resolve()),
//   UPDATE_PROFILE: jest.fn(() => Promise.resolve()),
//   UPDATE_USER_METRICS_DATA: jest.fn(() => Promise.resolve()),
//   UPDATE_EMAIL_SUCCESS: jest.fn(() => Promise.resolve()),
// }))

jest.mock('../../src/actions/types', () => ({
  LOGIN_WITH_EMAIL: 'LOGIN_WITH_EMAIL',
  SIGNUP_WITH_EMAIL: 'SIGNUP_WITH_EMAIL',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  UPDATE_USER_METRICS_DATA: 'UPDATE_USER_METRICS_DATA',
  UPDATE_EMAIL_SUCCESS: 'UPDATE_EMAIL_SUCCESS',
}));

describe('userReducer', () => {

  const getInitialState = (newState = {}) => {
    return {
      uuid: null,
      firstName: null,
      lastName: null,
      email: null,
      authError: null,
      userMetricsData: {
        gender: "No Data",
        dob: new Date(),
        height: "No Data",
        weight: "No Data",
        sports: "No Data",
      },
      ...newState,
    };
  };

    it('should return the initial state', () => {
      const action = {
        type: {},
      };
      
      expect(userReducer(undefined, action)).toEqual(getInitialState());
    });

    it('handles LOGIN_WITH_EMAIL', () => {
      const action = {
        type: LOGIN_WITH_EMAIL,
        payload: {
          uuid: '123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
        },
      };
      expect(userReducer(getInitialState(), action)).toEqual({
        ...getInitialState(),
        ...action.payload,
      });
    });

    // it('handles SIGNUP_WITH_EMAIL', () => {
    //   const action = {
    //     type: SIGNUP_WITH_EMAIL,
    //     payload: {
    //       uuid: '456',
    //       firstName: 'Jane',
    //       lastName: 'Smith',
    //       email: 'janesmith@example.com',
    //     },
    //   };
    //   expect(userReducer(initialState, action)).toEqual({
    //     ...initialState,
    //     ...action.payload,
    //   });
    // });

    // it('handles LOGOUT', () => {
    //   const action = {
    //     type: LOGOUT,
    //   };
    //   expect(userReducer(initialState, action)).toEqual(initialState);
    // });

    // it('handles UPDATE_PROFILE', () => {
    //   const action = {
    //     type: UPDATE_PROFILE,
    //     payload: ['Jane', 'Doe'],
    //   };
    //   expect(userReducer(initialState, action)).toEqual({
    //     ...initialState,
    //     firstName: action.payload[0],
    //     lastName: action.payload[1],
    //   });
    // });

    // it('handles UPDATE_USER_METRICS_DATA', () => {
    //   const action = {
    //     type: UPDATE_USER_METRICS_DATA,
    //     payload: {
    //       gender: 'Female',
    //       dob: new Date('1990-01-01'),
    //       height: '170cm',
    //       weight: '60kg',
    //       sports: 'Running',
    //     },
    //   };
    //   expect(userReducer(initialState, action)).toEqual({
    //     ...initialState,
    //     userMetricsData: action.payload,
    //   });
    // });

    // it('handles UPDATE_EMAIL_SUCCESS', () => {
    //   const action = {
    //     type: UPDATE_EMAIL_SUCCESS,
    //     payload: 'newemail@example.com',
    //   };
    //   expect(userReducer(initialState, action)).toEqual({
    //     ...initialState,
    //     email: action.payload,
    //   });
    // });
});
