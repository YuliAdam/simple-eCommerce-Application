import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import countries from '@assets/countriesList/countries.json';
import type { AddressType } from '@/interfaces/types';
import { AddressInputName, InputName } from '@/interfaces/types';

const initialState = {
  values: {
    login: {
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
    bithDay: {
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
    posteCode: {
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
      posteCode: {
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
      posteCode: {
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
        if (state.values.posteCode.value === '') {
          state.values.posteCode.isValid = false;
          state.values.posteCode.infoIsActive = true;
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
        if (state.values[addressType].posteCode.value === '') {
          state.values[addressType].posteCode.isValid = false;
          state.values[addressType].posteCode.infoIsActive = true;
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
        if (action.payload.name === InputName.posteCode) {
          state.values.country.value = getCountryByCode(action.payload.value);
          state.values.country.isValid = true;
          state.values.country.infoIsActive = false;
        } else if (action.payload.name === InputName.country) {
          state.values.posteCode.value = getCodeByCountry(action.payload.value);
          state.values.posteCode.isValid = true;
          state.values.posteCode.infoIsActive = false;
        }
        state.values[action.payload.name].value = action.payload.value;
      } else {
        const data = action.payload.name.inputName;
        const addressType = action.payload.name.addressType;
        if (data === AddressInputName.posteCode) {
          state.values[addressType].country.value = getCountryByCode(action.payload.value);
          state.values[addressType].country.isValid = true;
          state.values[addressType].country.infoIsActive = false;
        } else if (data === AddressInputName.country) {
          state.values[addressType].posteCode.value = getCodeByCountry(action.payload.value);
          state.values[addressType].posteCode.isValid = true;
          state.values[addressType].posteCode.infoIsActive = false;
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
  },
});

function getCountryByCode(code: string): string {
  let result = '';
  countries.forEach(item => {
    if (item.code === code) {
      result = item.name;
    }
  });
  return result;
}

function getCodeByCountry(name: string): string {
  let result = '';
  countries.forEach(item => {
    if (item.name === name) {
      result = item.code;
    }
  });
  return result;
}

export const { setValid, setInvalid, setValue, setInfoActive, setInfoInactive } =
  registrationSlice.actions;

export default registrationSlice.reducer;
