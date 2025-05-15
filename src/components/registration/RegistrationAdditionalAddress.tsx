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

export default function RegistrationAdditionalAddress({ type }: { type: AddressType }) {
  const registration = useSelector((state: RootState) => state.registration.values);
  const addressName = type[0].toUpperCase() + type.slice(1);
  const dispatch = useDispatch();
  function onChangeSetAddressAsAdditional(type: AddressType) {
    return () => {
      dispatch(setAddressAsAdditional(type));
    };
  }
  function onChangeToggleAdditionalAddressAsDelault(type: AddressType) {
    return () => {
      dispatch(toggleAdditionalAddressAsDefault(type));
    };
  }

  return (
    <div className={registration[type].show ? '' : styles.hide}>
      <h5>{addressName} Address</h5>
      <p>
        <input type={InputTypes.checkbox} onChange={onChangeSetAddressAsAdditional(type)} />
        Use address as {type} address
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
        name={{ addressType: type, inputName: AddressInputName.posteCode }}
        type={InputTypes.text}
      />
      <Datalist id="code" dataName="code" />
      <RegistrationData
        name={{ addressType: type, inputName: AddressInputName.country }}
        type={InputTypes.text}
      />
      <Datalist id="countries" dataName="name" />
      <p>
        <input
          type={InputTypes.checkbox}
          onChange={onChangeToggleAdditionalAddressAsDelault(type)}
        />
        Set as default
      </p>
    </div>
  );
}
