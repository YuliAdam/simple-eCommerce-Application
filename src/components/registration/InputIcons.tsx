import type { AddressInputName, AddressType } from '@/interfaces/types';
import { InputName } from '@/interfaces/types';
import {
  setInfoActive,
  setInfoInactive,
  togglePasswordVisible,
} from '@store/slices/registrationSlice';
import type { RootState } from '@store/store';
import InfoSvg from '@assets/img/info';
import { useCallback, type JSX } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye } from '@/assets/img/eye';
import styles from '@pages/registration/registration.module.scss';

export default function Icons({
  name,
}: {
  name: InputName | { addressType: AddressType; inputName: AddressInputName };
}): JSX.Element {
  const registration = useSelector((state: RootState) => state.registration.values);
  const dispatch = useDispatch();
  const isAddedAddress = typeof name !== 'string';

  function getClassIfActiveInfo(): string {
    return (
      typeof name === 'string'
        ? registration[name].infoIsActive
        : registration[name.addressType][name.inputName].infoIsActive
    )
      ? ' ' + styles.active
      : '';
  }

  function getClassIfActiveEye(): string {
    return name === InputName.password && registration.password.isVisible
      ? ' ' + styles.active
      : '';
  }

  const eyeHandler = useCallback(() => {
    dispatch(togglePasswordVisible());
  }, []);

  const infoHandler = () => {
    (
      isAddedAddress
        ? registration[name.addressType][name.inputName].infoIsActive
        : registration[name].infoIsActive
    )
      ? dispatch(setInfoInactive(name))
      : dispatch(setInfoActive(name));
  };

  function addEyeIfPasswordInput() {
    return name === InputName.password ? <Eye className={getClassIfActiveEye()} /> : '';
  }

  return (
    <div className={styles.registration_form_input_icon}>
      <div onClick={eyeHandler}>{addEyeIfPasswordInput()}</div>
      <div onClick={infoHandler}>
        <InfoSvg className={getClassIfActiveInfo()} />
      </div>
    </div>
  );
}
