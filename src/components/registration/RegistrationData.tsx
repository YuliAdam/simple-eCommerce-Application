import type { AddressType, InputTypes } from '@/interfaces/types';
import { AddressInputName } from '@/interfaces/types';
import { InputName } from '@/interfaces/types';
import { setInvalid, setLoginUnique, setValid, setValue } from '@store/slices/registrationSlice';
import type { RootState } from '@store/store';
import styles from '@pages/registration/registration.module.scss';
import type { ChangeEvent, JSX } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfoButton from './InfoButton';
import RegistrationInfo from './RegistrationInfo';
import {
  MAX_DATE,
  MAX_INPUT_LENGTH,
  MIN_DATE,
  PATTERNS,
} from '@/utils/validation/registrationValidation';
import getValueInObjectByInputName from '@/utils/getValueInObjectByInputName';

interface RegistrationData {
  name: InputName | { addressType: AddressType; inputName: AddressInputName };
  type: InputTypes;
}

const PLACEHOLDERS = {
  login: 'example@email.com',
  password: 'password',
  firstName: 'First name',
  lastName: 'Last name',
  birthDay: 'Date of birth',
  street: 'Street',
  city: 'City',
  postalCode: 'Postal code',
  country: 'Country',
};

const LIST_NAMES = {
  postalCode: 'postalCode',
  country: 'countries',
};

export function RegistrationData({ name, type }: RegistrationData): JSX.Element {
  const registration = useSelector((state: RootState) => state.registration.values);
  const dispatch = useDispatch();
  const isAddedAddress = !(typeof name === 'string');

  function onChangeValue(
    name: InputName | { addressType: AddressType; inputName: AddressInputName },
  ) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target && event.target instanceof HTMLInputElement) {
        dispatch(setValue({ name: name, value: event.target.value }));
        dispatch(setValid(name));
      }
      if (name === InputName.login) {
        dispatch(setLoginUnique());
      }
    };
  }

  function onInvalidValue(
    name: InputName | { addressType: AddressType; inputName: AddressInputName },
  ) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      if (event.target && event.target instanceof HTMLInputElement) dispatch(setInvalid(name));
    };
  }

  function getClassIfInvalid(
    name: InputName | { addressType: AddressType; inputName: AddressInputName },
  ): string {
    if (typeof name === 'string') {
      return registration[name].isValid ? '' : ' ' + styles.invalid;
    } else {
      return registration[name.addressType][name.inputName].isValid ? '' : ' ' + styles.invalid;
    }
  }

  function getClassIfInfoIsActive(
    name: InputName | { addressType: AddressType; inputName: AddressInputName },
  ): string {
    if (typeof name === 'string') {
      return registration[name].infoIsActive ? ' ' + styles.active : '';
    } else {
      return registration[name.addressType][name.inputName].infoIsActive ? ' ' + styles.active : '';
    }
  }

  return (
    <>
      <div className={styles.registration_form_wrap + getClassIfInvalid(name)}>
        <input
          value={
            isAddedAddress
              ? registration[name.addressType][name.inputName].value
              : registration[name].value
          }
          maxLength={MAX_INPUT_LENGTH}
          onChange={onChangeValue(name)}
          onInvalid={onInvalidValue(name)}
          type={type}
          placeholder={
            isAddedAddress
              ? getValueInObjectByInputName(name.inputName, PLACEHOLDERS)
              : getValueInObjectByInputName(name, PLACEHOLDERS)
          }
          pattern={
            isAddedAddress
              ? getValueInObjectByInputName(name.inputName, PATTERNS)
              : getValueInObjectByInputName(name, PATTERNS)
          }
          minLength={1}
          max={name === InputName.birthDay ? MAX_DATE : ''}
          min={name === InputName.birthDay ? MIN_DATE : ''}
          list={
            name === InputName.postalCode ||
            (isAddedAddress && name.inputName === AddressInputName.postalCode)
              ? LIST_NAMES.postalCode
              : (isAddedAddress && name.inputName === AddressInputName.country) ||
                  name === InputName.country
                ? LIST_NAMES.country
                : ''
          }
          required={typeof name === 'string' || registration[name.addressType].isPresent}
        />
        {name === InputName.birthDay ||
        name === InputName.postalCode ||
        name === InputName.country ||
        (isAddedAddress && name.inputName === AddressInputName.postalCode) ||
        (isAddedAddress && name.inputName === AddressInputName.country) ? (
          <></>
        ) : (
          <InfoButton name={name} />
        )}
      </div>
      <RegistrationInfo className={getClassIfInfoIsActive(name)} name={name} />
    </>
  );
}
