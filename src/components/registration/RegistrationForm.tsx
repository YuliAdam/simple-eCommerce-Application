import type { JSX } from 'react';

import styles from '@pages/registration/registration.module.scss';
import { InputTypes, InputName, AddressType } from '@/interfaces/types';
import { Datalist } from './Datalist';
import { RegistrationData } from './RegistrationData';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAdditionalAddress } from '@/store/slices/registrationSlice';
import RegistrationAdditionalAddress from './RegistrationAdditionalAddress';
import type { RootState } from '@/store/store';

export function RegistrationForm(): JSX.Element {
  const registration = useSelector((state: RootState) => state.registration.values);
  const dispatch = useDispatch();
  function onClickToggleAdditionalAddress(addressType: AddressType) {
    return () => dispatch(toggleAdditionalAddress(addressType));
  }

  return (
    <form className={styles.registration_form}>
      <div>
        <h5>Login Data</h5>
        <RegistrationData name={InputName.login} type={InputTypes.email} />
        <RegistrationData name={InputName.password} type={InputTypes.password} />
      </div>
      <div>
        <h5>Personal Data</h5>
        <RegistrationData name={InputName.firstName} type={InputTypes.text} />
        <RegistrationData name={InputName.lastName} type={InputTypes.text} />
        <RegistrationData name={InputName.bithDay} type={InputTypes.date} />
      </div>
      <div>
        <h5>Address</h5>
        <RegistrationData name={InputName.street} type={InputTypes.text} />
        <RegistrationData name={InputName.city} type={InputTypes.text} />
        <RegistrationData name={InputName.posteCode} type={InputTypes.text} />
        <Datalist id="code" dataName="code" />
        <RegistrationData name={InputName.country} type={InputTypes.text} />
        <Datalist id="countries" dataName="name" />
      </div>
      <div className={styles.registration_form_add_address}>
        <p
          className={styles.registration_form_add_address_text}
          onClick={onClickToggleAdditionalAddress(AddressType.billing)}
        >
          {registration.billing.show ? 'Hide billing address' : 'Add different billing address'}
        </p>
        <RegistrationAdditionalAddress type={AddressType.billing} />
        <p
          className={styles.registration_form_add_address_text}
          onClick={onClickToggleAdditionalAddress(AddressType.shipping)}
        >
          {registration.shipping.show ? 'Hide billing address' : 'Add different shipping address'}
        </p>
        <RegistrationAdditionalAddress type={AddressType.shipping} />
      </div>

      <button>Registrate</button>
    </form>
  );
}
