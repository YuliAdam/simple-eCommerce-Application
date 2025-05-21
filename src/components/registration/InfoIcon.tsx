import type { AddressInputName, AddressType, InputName } from '@/interfaces/types';
import { setInfoActive, setInfoInactive } from '@store/slices/registrationSlice';
import type { RootState } from '@store/store';
import InfoSvg from '@assets/img/info';
import type { JSX } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function InfoIcon({
  name,
}: {
  name: InputName | { addressType: AddressType; inputName: AddressInputName };
}): JSX.Element {
  const registration = useSelector((state: RootState) => state.registration.values);
  const dispatch = useDispatch();
  const isAddedAddress = typeof name !== 'string';

  const onClickHandler = () => {
    (
      isAddedAddress
        ? registration[name.addressType][name.inputName].infoIsActive
        : registration[name].infoIsActive
    )
      ? dispatch(setInfoInactive(name))
      : dispatch(setInfoActive(name));
  };

  return (
    <div onClick={onClickHandler}>
      <InfoSvg name={name} />
    </div>
  );
}
