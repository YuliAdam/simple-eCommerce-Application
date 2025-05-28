import type { AddressType } from '@/interfaces/types';
import { AddressInputName, InputTypes } from '@/interfaces/types';
import type { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@pages/registration/registration.module.scss';
import { RegistrationInput } from './RegistrationInput';
import { Datalist } from './Datalist';
import {
  setAddressAsAdditional,
  setInvalid,
  setValid,
  setValue,
  toggleAdditionalAddressAsDefault,
} from '@/store/slices/registrationSlice';
import type { ChangeEvent } from 'react';
import { useCallback } from 'react';
import { PATTERNS } from '@/utils/validation/registrationValidation';

export default function RegistrationAdditionalAddress({ type }: { type: AddressType }) {
  const registration = useSelector((state: RootState) => state.registration.values);
  const addressName = type[0].toUpperCase() + type.slice(1);
  const dispatch = useDispatch();

  const callbackSetAddressAsAdditional = useCallback(
    () => dispatch(setAddressAsAdditional(type)),
    [type],
  );

  const callbackToggleAdditionalAddressAsDefault = useCallback(
    () => dispatch(toggleAdditionalAddressAsDefault(type)),
    [type],
  );

  function onChangeValue(name: { addressType: AddressType; inputName: AddressInputName }) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target && event.target instanceof HTMLInputElement) {
        const value = event.target.value;
        dispatch(setValue({ name: name, value: value }));
        new RegExp(PATTERNS[name.inputName]).test(value)
          ? dispatch(setValid(name))
          : dispatch(setInvalid(name));
      }
    };
  }

  return (
    <div className={registration[type].isPresent ? '' : styles.hide}>
      <h5>{addressName} Address</h5>
      <p>
        <input
          type={InputTypes.checkbox}
          checked={registration[type].isCopy}
          onChange={callbackSetAddressAsAdditional}
        />
        <label>Use main address as {type} address</label>
      </p>
      <RegistrationInput
        className={''}
        onChangeInput={onChangeValue({ addressType: type, inputName: AddressInputName.street })}
        name={{ addressType: type, inputName: AddressInputName.street }}
        type={InputTypes.text}
        value={registration[type].street.value}
      />
      <RegistrationInput
        className={''}
        onChangeInput={onChangeValue({ addressType: type, inputName: AddressInputName.city })}
        name={{ addressType: type, inputName: AddressInputName.city }}
        type={InputTypes.text}
        value={registration[type].city.value}
      />
      <RegistrationInput
        className={''}
        onChangeInput={onChangeValue({ addressType: type, inputName: AddressInputName.postalCode })}
        name={{ addressType: type, inputName: AddressInputName.postalCode }}
        type={InputTypes.text}
        value={registration[type].postalCode.value}
      />
      <Datalist id={`${type}_postalCode`} dataName="postalCode" />
      <RegistrationInput
        className={''}
        onChangeInput={onChangeValue({ addressType: type, inputName: AddressInputName.country })}
        name={{ addressType: type, inputName: AddressInputName.country }}
        type={InputTypes.text}
        value={registration[type].country.value}
      />
      <Datalist id={`${type}_countries`} dataName="name" />
      <p>
        <input
          type={InputTypes.checkbox}
          checked={registration[type].isDefault}
          onChange={callbackToggleAdditionalAddressAsDefault}
        />
        <label>Set as default</label>
      </p>
    </div>
  );
}
