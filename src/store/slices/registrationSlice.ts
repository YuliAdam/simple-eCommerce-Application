import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
  AddressType,
  IAdditionalAddres,
  IRegistrationFieldState,
  IRegistrationState,
  AddressInputName,
} from '@/interfaces/types';
import { InputName } from '@/interfaces/types';
import {
  getCountryByPostalCode,
  getPostalCodeByCountry,
} from '@/utils/searchInCountryArrayMethods';

function setFieldInvalid(field: IRegistrationFieldState) {
  field.isValid = false;
  field.infoIsActive = true;
}
function setFieldValid(field: IRegistrationFieldState) {
  field.isValid = true;
  field.infoIsActive = false;
}

function invalidateAddressFieldIfEmpty(field: IRegistrationState | IAdditionalAddres) {
  if (field.postalCode.value === '') {
    setFieldInvalid(field.postalCode);
  }
  if (field.country.value === '') {
    setFieldInvalid(field.country);
  }
}

function setValueIfIsCountryOrPostalCode(
  field: IRegistrationState | IAdditionalAddres,
  name: InputName | AddressInputName,
  value: string,
) {
  if (name === InputName.postalCode) {
    field.country.value = getCountryByPostalCode(value);
    setFieldValid(field.country);
  } else if (name === InputName.country) {
    field.postalCode.value = getPostalCodeByCountry(value);
    setFieldValid(field.postalCode);
  }
}

const initialState: { values: IRegistrationState } = {
  values: {
    login: {
      isUnique: true,
      isValid: true,
      value: '',
      infoIsActive: false,
    },
    password: {
      isVisible: false,
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
        setFieldValid(state.values[action.payload]);
      } else {
        const data = action.payload.inputName;
        const addressType = action.payload.addressType;
        setFieldValid(state.values[addressType][data]);
      }
    },
    setInvalid: (
      state,
      action: PayloadAction<InputName | { addressType: AddressType; inputName: AddressInputName }>,
    ) => {
      if (typeof action.payload === 'string') {
        invalidateAddressFieldIfEmpty(state.values);
        setFieldInvalid(state.values[action.payload]);
      } else {
        const data = action.payload.inputName;
        const addressType = action.payload.addressType;
        invalidateAddressFieldIfEmpty(state.values[addressType]);
        setFieldInvalid(state.values[addressType][data]);
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
        setValueIfIsCountryOrPostalCode(state.values, action.payload.name, action.payload.value);
        state.values[action.payload.name].value = action.payload.value;
      } else {
        const data = action.payload.name.inputName;
        const addressType = action.payload.name.addressType;
        setValueIfIsCountryOrPostalCode(state.values[addressType], data, action.payload.value);
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
        setFieldValid(state.values[action.payload]);
      } else {
        setFieldValid(state.values[action.payload.addressType][action.payload.inputName]);
      }
    },
    toggleAdditionalAddress(state, action: PayloadAction<AddressType>) {
      if (state.values[action.payload].isPresent) {
        Object.assign(state.values[action.payload], initialState.values[action.payload]);
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
    togglePasswordVisible(state) {
      state.values.password.isVisible = !state.values.password.isVisible;
    },
    resetState(state) {
      state.values.billing.city.infoIsActive = false;
      Object.assign(state, initialState);
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
  togglePasswordVisible,
  resetState,
} = registrationSlice.actions;

export default registrationSlice.reducer;
