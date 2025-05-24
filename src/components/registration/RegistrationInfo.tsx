import type { AddressInputName, AddressType, InputName } from '@/interfaces/types';
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
    <p className={styles.registration_form_info + ' ' + className}>
      {typeof name === 'string' ? VALIDATION_MESSAGES[name] : VALIDATION_MESSAGES[name.inputName]}
    </p>
  );
}
