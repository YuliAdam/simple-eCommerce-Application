import { InputName } from '@/interfaces/types';
import { setValid, setValue } from '@store/slices/registrationSlice';
import countries from '@assets/countriesList/countries.json';
import type { JSX } from 'react';
import { useDispatch } from 'react-redux';

export function Datalist({ id, dataName }: { id: string; dataName: 'code' | 'name' }): JSX.Element {
  const dispatch = useDispatch();

  function onChangeValue(value: string) {
    return () => {
      const inputName = dataName === 'code' ? InputName.posteCode : InputName.country;
      dispatch(setValue({ name: inputName, value: value }));
      dispatch(setValid(InputName.posteCode));
      dispatch(setValid(InputName.country));
    };
  }
  return (
    <datalist id={id}>
      {countries.map(item => {
        return (
          <option value={item[dataName]} key={item.name} onClick={onChangeValue(item[dataName])} />
        );
      })}
    </datalist>
  );
}
