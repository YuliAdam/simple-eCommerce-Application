import { InputName } from '@/interfaces/types';
import { setValid } from '@store/slices/registrationSlice';
import countries from '@assets/countriesList/countries.json';
import type { JSX } from 'react';
import { useDispatch } from 'react-redux';

export function Datalist({
  id,
  dataName,
}: {
  id: string;
  dataName: 'postalCode' | 'name';
}): JSX.Element {
  const dispatch = useDispatch();

  function onChangeValue() {
    dispatch(setValid(InputName.postalCode));
    dispatch(setValid(InputName.country));
  }
  return (
    <datalist id={id}>
      {countries.map(item => {
        return <option value={item[dataName]} key={item.name} onClick={onChangeValue} />;
      })}
    </datalist>
  );
}
