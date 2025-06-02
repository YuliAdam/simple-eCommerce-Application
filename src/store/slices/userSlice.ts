import type { IUserPageAddress } from '@/interfaces/types';
import { AddressType } from '@/interfaces/types';
import { InputName } from '@/interfaces/types';
import { getCountryByCode } from '@/utils/searchInCountryArrayMethods';
import type { Customer } from '@commercetools/platform-sdk';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface IdState {
  value: string;
  newValue: string;
}

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
  billingArr: { values: string[]; newValue: string };
  shippingArr: { values: string[]; newValue: string };
  billingDefault: IdState;
  shippingDefault: IdState;
  addressType: string;
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
  addressType = 'addressType',
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
  billingArr: { values: [], newValue: '' },
  shippingArr: { values: [], newValue: '' },
  billingDefault: {
    value: '',
    newValue: '',
  },
  shippingDefault: {
    value: '',
    newValue: '',
  },
  addressType: 'address',
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setVersion(state, action: PayloadAction<number>) {
      state.version = action.payload;
    },
    offRedactMood(state, action: PayloadAction<IRedactMoods | number>) {
      if (typeof action.payload === 'number') {
        state.userAddresses[action.payload].isRedactMood = false;
      } else {
        state[action.payload] = false;
      }
    },
    onRedactMood(state, action: PayloadAction<IRedactMoods | number>) {
      if (typeof action.payload === 'number') {
        state.userAddresses[action.payload].isRedactMood = true;
      } else {
        state[action.payload] = true;
      }
    },

    verifyPassword(state, action: PayloadAction<boolean>) {
      state.passwordIsVerify = action.payload;
    },

    setNewUserValue(
      state,
      action: PayloadAction<{
        name: IUserFildNames | { arrayName: IUserFildNames; i: number };
        input?: InputName;
        value: string;
      }>,
    ) {
      const inputDesc = action.payload.name;
      let input: InputName | string | undefined = action.payload.input;
      input = input === InputName.street ? 'streetName' : input;
      if (typeof inputDesc === 'string') {
        if (
          inputDesc === IUserFildNames.userParams &&
          (input === InputName.login ||
            input === InputName.birthDay ||
            input === InputName.lastName ||
            input === InputName.firstName ||
            input === InputName.password)
        ) {
          state.userParams[input].newValue = action.payload.value;
        }
        if (
          state[inputDesc] &&
          (inputDesc === IUserFildNames.billingDefault ||
            inputDesc === IUserFildNames.shippingDefault)
        ) {
          state[inputDesc].newValue = action.payload.value;
        }
        if (
          state[inputDesc] &&
          (inputDesc === IUserFildNames.billingArr || inputDesc === IUserFildNames.shippingArr)
        ) {
          state.billingArr.newValue = '';
          state.shippingArr.newValue = '';
          state[inputDesc].newValue = action.payload.value;
          state.addressType =
            inputDesc === IUserFildNames.billingArr ? AddressType.billing : AddressType.shipping;
          action.payload.value === '' && (state.addressType = 'address');
        }
        if (state[inputDesc] && inputDesc === IUserFildNames.addressType) {
          state.addressType = action.payload.value;
        }
      } else {
        state[inputDesc.arrayName] &&
        inputDesc.arrayName === IUserFildNames.userAddresses &&
        (input === InputName.country ||
          input === InputName.postalCode ||
          input === InputName.city ||
          input === 'streetName')
          ? (state[inputDesc.arrayName][inputDesc.i][input].newValue = action.payload.value)
          : '';
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

    backOldAddressValue(state, action: PayloadAction<number>) {
      state.userAddresses[action.payload].streetName.newValue =
        state.userAddresses[action.payload].streetName.value;
      state.userAddresses[action.payload].city.newValue =
        state.userAddresses[action.payload].city.value;
      state.userAddresses[action.payload].postalCode.newValue =
        state.userAddresses[action.payload].postalCode.value;
      state.userAddresses[action.payload].country.newValue =
        state.userAddresses[action.payload].country.value;
    },

    clearPasswordCamps(state) {
      state.userParams.password.currentValue = '';
      state.userParams.password.newValue = '';
      state.userParams.password.repeatNewValue = '';
    },

    setAddresses(state, action: PayloadAction<Customer>) {
      state.userAddresses = [];
      state.billingArr = { values: [], newValue: '' };
      state.shippingArr = { values: [], newValue: '' };
      state.addressType = 'address';
      state.shippingDefault.value = '';
      state.billingDefault.value = '';
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
        if (
          address.id &&
          action.payload.defaultBillingAddressId &&
          item.id === action.payload.defaultBillingAddressId
        ) {
          state.billingDefault.value = address.id;
        }
        if (
          address.id &&
          action.payload.defaultShippingAddressId &&
          item.id === action.payload.defaultShippingAddressId
        ) {
          state.shippingDefault.value = address.id;
        }
        if (
          address.id &&
          action.payload.billingAddressIds &&
          item.id &&
          action.payload.billingAddressIds.includes(item.id)
        ) {
          state.billingArr.values.push(address.id);
          state.addressType = AddressType.billing;
        }
        if (
          address.id &&
          action.payload.shippingAddressIds &&
          item.id &&
          action.payload.shippingAddressIds.includes(item.id)
        ) {
          state.shippingArr.values.push(address.id);
        }
        state.userAddresses.push(address);
        state.addressType = AddressType.shipping;
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
  backOldAddressValue,
} = userSlice.actions;
export default userSlice.reducer;
