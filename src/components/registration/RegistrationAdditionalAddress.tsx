import type { AddressType } from '@/interfaces/types';
import { AddressInputName, InputTypes } from '@/interfaces/types';
import type { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@pages/registration/registration.module.scss';
import { RegistrationData } from './RegistrationData';
import { Datalist } from './Datalist';
import {
  setAddressAsAdditional,
  toggleAdditionalAddressAsDefault,
} from '@/store/slices/registrationSlice';
import { useCallback } from 'react';

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
      <RegistrationData
        name={{ addressType: type, inputName: AddressInputName.street }}
        type={InputTypes.text}
      />
      <RegistrationData
        name={{ addressType: type, inputName: AddressInputName.city }}
        type={InputTypes.text}
      />
      <RegistrationData
        name={{ addressType: type, inputName: AddressInputName.postalCode }}
        type={InputTypes.text}
      />
      <Datalist id={`${type}_postalCode`} dataName="postalCode" />
      <RegistrationData
        name={{ addressType: type, inputName: AddressInputName.country }}
        type={InputTypes.text}
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
