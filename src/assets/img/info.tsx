import type { AddressInputName, AddressType, InputName } from '@/interfaces/types';
import type { RootState } from '@store/store';
import { useSelector } from 'react-redux';
import styles from '@pages/registration/registration.module.scss';
import type { JSX } from 'react';

export default function Info({
  name,
}: {
  name: InputName | { addressType: AddressType; inputName: AddressInputName };
}): JSX.Element {
  const registration = useSelector((state: RootState) => state.registration.values);
  function getClassIfInfoIsActive(
    name: InputName | { addressType: AddressType; inputName: AddressInputName },
  ): string {
    return (
      typeof name === 'string'
        ? registration[name].infoIsActive
        : registration[name.addressType][name.inputName].infoIsActive
    )
      ? ' ' + styles.active
      : '';
  }
  return (
    <svg
      className={getClassIfInfoIsActive(name)}
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={getClassIfInfoIsActive(name)}
        d="M12 17V11"
        stroke="#0ea5e9"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        className={getClassIfInfoIsActive(name)}
        cx="1"
        cy="1"
        r="1"
        transform="matrix(1 0 0 -1 11 9)"
        fill="#0ea5e9"
      />
      <path
        className={getClassIfInfoIsActive(name)}
        d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
        stroke="#0ea5e9"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
