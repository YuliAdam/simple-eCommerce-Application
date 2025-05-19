import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { AddressType } from '@/interfaces/types';
import { AddressInputName, InputName } from '@/interfaces/types';
import { getCountryByPostalCode, getPostalCodeByCountry } from '@/utils/searchInCountryArrayMetods';

const initialState = {
  values: {
    login: {
      isUnique: true,
      isValid: true,
      value: '',
      infoIsActive: false,
    },
    password: {
      isValid: true,
      value: '',
      infoIsActive: false,
    },
    firstName: {
      isValid: true,
      value: '',
      infoIsActive: false,
    },
    lastName: {
      isValid: true,
      value: '',
      infoIsActive: false,
    },
    birthDay: {
      isValid: true,
      value: '',
      infoIsActive: false,
    },
    street: {
      isValid: true,
      value: '',
      infoIsActive: false,
    },
    city: {
      isValid: true,
      value: '',
      infoIsActive: false,
    },
    postalCode: {
      isValid: true,
      value: '',
      infoIsActive: false,
    },
    country: {
      isValid: true,
      value: '',
      infoIsActive: false,
    },
    billing: {
      isCopy: false,
      isDefault: false,
      isPresent: false,
      street: {
        isValid: true,
        value: '',
        infoIsActive: false,
      },
      city: {
        isValid: true,
        value: '',
        infoIsActive: false,
      },
      postalCode: {
        isValid: true,
        value: '',
        infoIsActive: false,
      },
      country: {
        isValid: true,
        value: '',
        infoIsActive: false,
      },
    },
    shipping: {
      isCopy: false,
      isDefault: false,
      isPresent: false,
      street: {
        isValid: true,
        value: '',
        infoIsActive: false,
      },
      city: {
        isValid: true,
        value: '',
        infoIsActive: false,
      },
      postalCode: {
        isValid: true,
        value: '',
        infoIsActive: false,
      },
      country: {
        isValid: true,
        value: '',
        infoIsActive: false,
      },
    },
  },
};

export const registrationSlice = createSlice({
  name: 'registration',
  initialState: initialState,
  reducers: {
    setValid: (
      state,
      action: PayloadAction<InputName | { addressType: AddressType; inputName: AddressInputName }>,
    ) => {
      if (typeof action.payload === 'string') {
        state.values[action.payload].isValid = true;
        state.values[action.payload].infoIsActive = false;
      } else {
        const data = action.payload.inputName;
        const addressType = action.payload.addressType;
        state.values[addressType][data].isValid = true;
        state.values[addressType][data].infoIsActive = false;
      }
    },
    setInvalid: (
      state,
      action: PayloadAction<InputName | { addressType: AddressType; inputName: AddressInputName }>,
    ) => {
      if (typeof action.payload === 'string') {
        if (state.values.postalCode.value === '') {
          state.values.postalCode.isValid = false;
          state.values.postalCode.infoIsActive = true;
        }
        if (state.values.country.value === '') {
          state.values.country.isValid = false;
          state.values.country.infoIsActive = true;
        }
        state.values[action.payload].isValid = false;
        state.values[action.payload].infoIsActive = true;
      } else {
        const data = action.payload.inputName;
        const addressType = action.payload.addressType;
        if (state.values[addressType].postalCode.value === '') {
          state.values[addressType].postalCode.isValid = false;
          state.values[addressType].postalCode.infoIsActive = true;
        }
        if (state.values[addressType].country.value === '') {
          state.values[addressType].country.isValid = false;
          state.values[addressType].country.infoIsActive = true;
        }
        state.values[addressType][data].isValid = false;
        state.values[addressType][data].infoIsActive = true;
      }
    },
    setValue: (
      state,
      action: PayloadAction<{
        name: InputName | { addressType: AddressType; inputName: AddressInputName };
        value: string;
      }>,
    ) => {
      if (typeof action.payload.name === 'string') {
        if (action.payload.name === InputName.postalCode) {
          state.values.country.value = getCountryByPostalCode(action.payload.value);
          state.values.country.isValid = true;
          state.values.country.infoIsActive = false;
        } else if (action.payload.name === InputName.country) {
          state.values.postalCode.value = getPostalCodeByCountry(action.payload.value);
          state.values.postalCode.isValid = true;
          state.values.postalCode.infoIsActive = false;
        }
        state.values[action.payload.name].value = action.payload.value;
      } else {
        const data = action.payload.name.inputName;
        const addressType = action.payload.name.addressType;
        if (data === AddressInputName.postalCode) {
          state.values[addressType].country.value = getCountryByPostalCode(action.payload.value);
          state.values[addressType].country.isValid = true;
          state.values[addressType].country.infoIsActive = false;
        } else if (data === AddressInputName.country) {
          state.values[addressType].postalCode.value = getPostalCodeByCountry(action.payload.value);
          state.values[addressType].postalCode.isValid = true;
          state.values[addressType].postalCode.infoIsActive = false;
        }
        state.values[addressType][data].value = action.payload.value;
      }
    },
    setInfoActive(
      state,
      action: PayloadAction<InputName | { addressType: AddressType; inputName: AddressInputName }>,
    ) {
      if (typeof action.payload === 'string') {
        state.values[action.payload].infoIsActive = true;
      } else {
        state.values[action.payload.addressType][action.payload.inputName].infoIsActive = true;
      }
    },
    setInfoInactive(
      state,
      action: PayloadAction<InputName | { addressType: AddressType; inputName: AddressInputName }>,
    ) {
      if (typeof action.payload === 'string') {
        state.values[action.payload].isValid = true;
        state.values[action.payload].infoIsActive = false;
      } else {
        state.values[action.payload.addressType][action.payload.inputName].isValid = true;
        state.values[action.payload.addressType][action.payload.inputName].infoIsActive = false;
      }
    },
    toggleAdditionalAddress(state, action: PayloadAction<AddressType>) {
      if (state.values[action.payload].isPresent) {
        state.values[action.payload] = initialState.values[action.payload];
      } else {
        state.values[action.payload].isPresent = true;
      }
    },
    setAddressAsAdditional(state, action: PayloadAction<AddressType>) {
      if (!state.values[action.payload].isCopy) {
        state.values[action.payload].street = state.values.street;
        state.values[action.payload].city = state.values.city;
        state.values[action.payload].country = state.values.country;
        state.values[action.payload].postalCode = state.values.postalCode;
      }
      state.values[action.payload].isCopy = !state.values[action.payload].isCopy;
    },
    toggleAdditionalAddressAsDefault(state, action: PayloadAction<AddressType>) {
      state.values[action.payload].isDefault = !state.values[action.payload].isDefault;
    },
    setLoginUnique(state) {
      state.values.login.isUnique = true;
    },
    setLoginNotUnique(state) {
      state.values.login.isUnique = false;
    },
    resetState(state) {
      state.values.billing.city.infoIsActive = false;
      state = initialState;
    },
  },
});

export const {
  setValid,
  setInvalid,
  setValue,
  setInfoActive,
  setInfoInactive,
  toggleAdditionalAddress,
  setAddressAsAdditional,
  toggleAdditionalAddressAsDefault,
  setLoginUnique,
  setLoginNotUnique,
  resetState,
} = registrationSlice.actions;

export default registrationSlice.reducer;
