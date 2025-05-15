import type { JSX } from 'react';

import styles from '@pages/registration/registration.module.scss';
import { InputTypes, InputName, AddressInputName, AddressType } from '@/interfaces/types';
import { Datalist } from './Datalist';
import { RegistrationData } from './RegistrationData';

export function RegistrationForm(): JSX.Element {
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
        <p>Add different billing address</p>
        <div>
          <h5>Billing Address</h5>
          <RegistrationData
            name={{ addressType: AddressType.billing, inputName: AddressInputName.street }}
            type={InputTypes.text}
          />
          <RegistrationData
            name={{ addressType: AddressType.billing, inputName: AddressInputName.city }}
            type={InputTypes.text}
          />
          <RegistrationData
            name={{ addressType: AddressType.billing, inputName: AddressInputName.posteCode }}
            type={InputTypes.text}
          />
          <Datalist id="code" dataName="code" />
          <RegistrationData
            name={{ addressType: AddressType.billing, inputName: AddressInputName.country }}
            type={InputTypes.text}
          />
          <Datalist id="countries" dataName="name" />
        </div>
        <p>Add different shipping address</p>
        <div>
          <h5>Shipping Address</h5>
          <RegistrationData
            name={{ addressType: AddressType.shipping, inputName: AddressInputName.street }}
            type={InputTypes.text}
          />
          <RegistrationData
            name={{ addressType: AddressType.shipping, inputName: AddressInputName.city }}
            type={InputTypes.text}
          />
          <RegistrationData
            name={{ addressType: AddressType.shipping, inputName: AddressInputName.posteCode }}
            type={InputTypes.text}
          />
          <Datalist id="code" dataName="code" />
          <RegistrationData
            name={{ addressType: AddressType.shipping, inputName: AddressInputName.country }}
            type={InputTypes.text}
          />
          <Datalist id="countries" dataName="name" />
        </div>
      </div>

      <button>Registrate</button>
    </form>
  );
}
