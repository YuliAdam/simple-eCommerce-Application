import type { IAddress } from '@/interfaces/types';
import { getCountryByCode } from '@/utils/searchInCountryArrayMethods';
import type { Customer } from '@commercetools/platform-sdk';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRedactMood: false,
  userParams: {
    login: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDay: '',
  },
  userAddresses: [
    {
      streetName: '',
      city: '',
      postalCode: '',
      country: '',
    },
  ],
  billingArr: [
    {
      streetName: '',
      city: '',
      postalCode: '',
      country: '',
    },
  ],
  shippingArr: [
    {
      streetName: '',
      city: '',
      postalCode: '',
      country: '',
    },
  ],
  billingDefault: {
    streetName: '',
    city: '',
    postalCode: '',
    country: '',
  },

  shippingDefault: {
    streetName: '',
    city: '',
    postalCode: '',
    country: '',
  },
};

function addAddress(address: IAddress, state: IAddress | IAddress[]) {
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
    offRedactMood(state) {
      state.isRedactMood = false;
    },
    onRedactMood(state) {
      state.isRedactMood = true;
    },
    setUserState(state, action: PayloadAction<Customer>) {
      const userState = {
        login: action.payload.email,
        password: action.payload.password ?? '',
        firstName: action.payload.firstName ?? '',
        lastName: action.payload.lastName ?? '',
        birthDay: action.payload.dateOfBirth ?? '',
      };
      state.userParams = userState;
    },

    setAddresses(state, action: PayloadAction<Customer>) {
      action.payload.addresses.forEach(item => {
        const address = {
          streetName: item.streetName ?? '',
          city: item.city ?? '',
          postalCode: item.postalCode ?? '',
          country: getCountryByCode(item.country),
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

export const { onRedactMood, offRedactMood, setUserState, setAddresses } = userSlice.actions;
export default userSlice.reducer;
