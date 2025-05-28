import type { IUserPageAddress } from '@/interfaces/types';
import { InputName } from '@/interfaces/types';
import { getCountryByCode } from '@/utils/searchInCountryArrayMethods';
import type { Customer } from '@commercetools/platform-sdk';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface IUserState {
  isRedactMood: boolean;
  version: number;
  userParams: {
    login: { value: string; newValue: string };
    password: { value: string; newValue: string };
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

export enum IUserFildNames {
  userParams = 'userParams',
  userAddresses = 'userAddresses',
  billingArr = 'billingArr',
  shippingArr = 'shippingArr',
  billingDefault = 'billingDefault',
  shippingDefault = 'shippingDefault',
}

const initialState: IUserState = {
  isRedactMood: false,
  version: 0,
  userParams: {
    login: { value: '', newValue: '' },
    password: { value: '', newValue: '' },
    firstName: { value: '', newValue: '' },
    lastName: { value: '', newValue: '' },
    birthDay: { value: '', newValue: '' },
  },
  userAddresses: [
    {
      streetName: { value: '', newValue: '' },
      city: { value: '', newValue: '' },
      postalCode: { value: '', newValue: '' },
      country: { value: '', newValue: '' },
    },
  ],
  billingArr: [
    {
      streetName: { value: '', newValue: '' },
      city: { value: '', newValue: '' },
      postalCode: { value: '', newValue: '' },
      country: { value: '', newValue: '' },
    },
  ],
  shippingArr: [
    {
      streetName: { value: '', newValue: '' },
      city: { value: '', newValue: '' },
      postalCode: { value: '', newValue: '' },
      country: { value: '', newValue: '' },
    },
  ],
  billingDefault: {
    streetName: { value: '', newValue: '' },
    city: { value: '', newValue: '' },
    postalCode: { value: '', newValue: '' },
    country: { value: '', newValue: '' },
  },

  shippingDefault: {
    streetName: { value: '', newValue: '' },
    city: { value: '', newValue: '' },
    postalCode: { value: '', newValue: '' },
    country: { value: '', newValue: '' },
  },
};

function addAddress(address: IUserPageAddress, state: IUserPageAddress | IUserPageAddress[]) {
  if (Array.isArray(state)) {
    state.push(address);
  } else {
    state = address;
  }
}

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setVersion(state, action: PayloadAction<number>) {
      state.version = action.payload;
    },
    offRedactMood(state) {
      state.isRedactMood = false;
    },
    onRedactMood(state) {
      state.isRedactMood = true;
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
          : (inputDesc === IUserFildNames.billingDefault ||
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

    setUserState(state, action: PayloadAction<Customer>) {
      const userState = {
        login: { value: action.payload.email, newValue: action.payload.email },
        password: { value: action.payload.password ?? '', newValue: action.payload.password ?? '' },
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

    setAddresses(state, action: PayloadAction<Customer>) {
      action.payload.addresses.forEach(item => {
        const address = {
          streetName: { value: item.streetName ?? '', newValue: item.streetName ?? '' },
          city: { value: item.city ?? '', newValue: item.city ?? '' },
          postalCode: { value: item.postalCode ?? '', newValue: item.postalCode ?? '' },
          country: {
            value: getCountryByCode(item.country),
            newValue: getCountryByCode(item.country),
          },
        };
        let isGenericAddress = true;
        if (item.id === action.payload.defaultBillingAddressId) {
          addAddress(address, state.billingDefault);
          isGenericAddress = false;
        }
        if (item.id === action.payload.defaultShippingAddressId) {
          addAddress(address, state.shippingDefault);
          isGenericAddress = false;
        }
        if (
          action.payload.billingAddressIds &&
          item.id &&
          action.payload.billingAddressIds.includes(item.id)
        ) {
          addAddress(address, state.billingArr);
          isGenericAddress = false;
        }
        if (
          action.payload.shippingAddressIds &&
          item.id &&
          action.payload.shippingAddressIds.includes(item.id)
        ) {
          addAddress(address, state.shippingArr);
          isGenericAddress = false;
        }
        if (isGenericAddress) {
          addAddress(address, state.userAddresses);
        }
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
} = userSlice.actions;
export default userSlice.reducer;
