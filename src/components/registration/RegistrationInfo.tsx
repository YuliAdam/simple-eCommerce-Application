import type { AddressInputName, AddressType, InputName } from '@/interfaces/types';
import getValueInObjectByInputName from '@/utils/getValueInObjectByInputName';
import { VALIDATION_MESSAGES } from '@/utils/validation/registrationValidation';
import styles from '@pages/registration/registration.module.scss';
import type { JSX } from 'react';

export default function RegistrationInfo({
  name,
  className,
}: {
  name: InputName | { addressType: AddressType; inputName: AddressInputName };
  className: string;
}): JSX.Element {
  return (
    <p className={styles.registration_form_info + className}>
      {typeof name === 'string'
        ? getValueInObjectByInputName(name, VALIDATION_MESSAGES)
        : getValueInObjectByInputName(name.inputName, VALIDATION_MESSAGES)}
    </p>
  );
}
