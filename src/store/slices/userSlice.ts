import type { IUserPageAddress } from '@/interfaces/types';
import { InputName } from '@/interfaces/types';
import { getCountryByCode } from '@/utils/searchInCountryArrayMethods';
import type { Customer } from '@commercetools/platform-sdk';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface IUserState {
  isRedactUserParamsMood: boolean;
  isRedactPasswordMood: boolean;
  version: number;
  passwordIsVerify: boolean;
  repeatPasswordIsCorrect: boolean;
  userParams: {
    login: { value: string; newValue: string };
    password: { value: string; currentValue: string; newValue: string; repeatNewValue: string };
    firstName: { value: string; newValue: string };
    lastName: { value: string; newValue: string };
    birthDay: { value: string; newValue: string };
  };
  userAddresses: IUserPageAddress[];
  billingArr: IUserPageAddress[];
  shippingArr: IUserPageAddress[];
  billingDefault: IUserPageAddress;
  shippingDefault: IUserPageAddress;
}

export enum IRedactMoods {
  userParams = 'isRedactUserParamsMood',
  password = 'isRedactPasswordMood',
}

export enum IUserFildNames {
  userParams = 'userParams',
  userAddresses = 'userAddresses',
  billingArr = 'billingArr',
  shippingArr = 'shippingArr',
  billingDefault = 'billingDefault',
  shippingDefault = 'shippingDefault',
}

export enum IPasswordCamp {
  currentValue = 'currentValue',
  newValue = 'newValue',
  repeatNewValue = 'repeatNewValue',
}

const initialState: IUserState = {
  isRedactUserParamsMood: false,
  isRedactPasswordMood: false,
  version: 0,
  passwordIsVerify: false,
  repeatPasswordIsCorrect: false,
  userParams: {
    login: { value: '', newValue: '' },
    password: { value: '', currentValue: '', newValue: '', repeatNewValue: '' },
    firstName: { value: '', newValue: '' },
    lastName: { value: '', newValue: '' },
    birthDay: { value: '', newValue: '' },
  },
  userAddresses: [],
  billingArr: [],
  shippingArr: [],
  billingDefault: {
    id: '',
    streetName: { value: '', newValue: '' },
    city: { value: '', newValue: '' },
    postalCode: { value: '', newValue: '' },
    country: { value: '', newValue: '' },
    isRedactMood: false,
  },
  shippingDefault: {
    id: '',
    streetName: { value: '', newValue: '' },
    city: { value: '', newValue: '' },
    postalCode: { value: '', newValue: '' },
    country: { value: '', newValue: '' },
    isRedactMood: false,
  },
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setVersion(state, action: PayloadAction<number>) {
      state.version = action.payload;
    },
    offRedactMood(state, action: PayloadAction<IRedactMoods>) {
      state[action.payload] = false;
    },
    onRedactMood(state, action: PayloadAction<IRedactMoods>) {
      state[action.payload] = true;
    },

    verifyPassword(state, action: PayloadAction<boolean>) {
      state.passwordIsVerify = action.payload;
    },

    setNewUserValue(
      state,
      action: PayloadAction<{
        name: IUserFildNames | { arrayName: IUserFildNames; i: number };
        input: InputName;
        value: string;
      }>,
    ) {
      const inputDesc = action.payload.name;
      let input: InputName | string = action.payload.input;
      input = input === InputName.street ? 'streetName' : input;
      if (typeof inputDesc === 'string') {
        inputDesc === IUserFildNames.userParams &&
        (input === InputName.login ||
          input === InputName.birthDay ||
          input === InputName.lastName ||
          input === InputName.firstName ||
          input === InputName.password)
          ? (state.userParams[input].newValue = action.payload.value)
          : state[inputDesc] &&
              (inputDesc === IUserFildNames.billingDefault ||
                inputDesc === IUserFildNames.shippingDefault) &&
              (input === InputName.country ||
                input === InputName.postalCode ||
                input === InputName.city ||
                input === 'streetName')
            ? (state[inputDesc][input].newValue = action.payload.value)
            : '';
      } else {
      }
    },
    setPassword(state, action: PayloadAction<{ passwordCamp: IPasswordCamp; value: string }>) {
      state.userParams.password[action.payload.passwordCamp] = action.payload.value;
    },

    setUserState(state, action: PayloadAction<Customer>) {
      const userState = {
        login: { value: action.payload.email, newValue: action.payload.email },
        password: {
          value: action.payload.password ?? '',
          currentValue: '',
          newValue: '',
          repeatNewValue: '',
        },
        firstName: {
          value: action.payload.firstName ?? '',
          newValue: action.payload.firstName ?? '',
        },
        lastName: { value: action.payload.lastName ?? '', newValue: action.payload.lastName ?? '' },
        birthDay: {
          value: action.payload.dateOfBirth ?? '',
          newValue: action.payload.dateOfBirth ?? '',
        },
      };
      state.userParams = userState;
    },

    backOldStateValue(state) {
      state.userParams.birthDay.newValue = state.userParams.birthDay.value;
      state.userParams.firstName.newValue = state.userParams.firstName.value;
      state.userParams.lastName.newValue = state.userParams.lastName.value;
      state.userParams.login.newValue = state.userParams.login.value;
    },

    clearPasswordCamps(state) {
      state.userParams.password.currentValue = '';
      state.userParams.password.newValue = '';
      state.userParams.password.repeatNewValue = '';
    },

    setAddresses(state, action: PayloadAction<Customer>) {
      state.userAddresses = [];
      state.billingArr = [];
      state.shippingArr = [];
      action.payload.addresses.forEach(item => {
        const address = {
          id: item.id,
          streetName: { value: item.streetName ?? '', newValue: item.streetName ?? '' },
          city: { value: item.city ?? '', newValue: item.city ?? '' },
          postalCode: { value: item.postalCode ?? '', newValue: item.postalCode ?? '' },
          country: {
            value: getCountryByCode(item.country),
            newValue: getCountryByCode(item.country),
          },
          isRedactMood: false,
        };
        console.log(address);
        if (item.id === action.payload.defaultBillingAddressId) {
          state.billingDefault = address;
        }
        if (item.id === action.payload.defaultShippingAddressId) {
          state.shippingDefault = address;
        }
        if (
          action.payload.billingAddressIds &&
          item.id &&
          action.payload.billingAddressIds.includes(item.id)
        ) {
          state.billingArr.push(address);
        }
        if (
          action.payload.shippingAddressIds &&
          item.id &&
          action.payload.shippingAddressIds.includes(item.id)
        ) {
          state.shippingArr.push(address);
        }
        state.userAddresses.push(address);
      });
    },
  },
});

export const {
  onRedactMood,
  offRedactMood,
  setUserState,
  setAddresses,
  setNewUserValue,
  backOldStateValue,
  setVersion,
  setPassword,
  verifyPassword,
  clearPasswordCamps,
} = userSlice.actions;
export default userSlice.reducer;
