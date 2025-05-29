import styles from '@pages/registration/registration.module.scss';
import type { JSX } from 'react';

export default function RegistrationInfo({
  text,
  className,
}: {
  text: string;
  className: string;
}): JSX.Element {
  return <p className={styles.registration_form_info + ' ' + className}>{text}</p>;
}
