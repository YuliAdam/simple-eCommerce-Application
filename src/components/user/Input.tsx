import type { InputTypes } from '@/interfaces/types';
import type { ChangeEvent } from 'react';

export function Input({
  value,
  readonly,
  className,
  type,
  placeholder,
  onChange,
  list,
}: {
  value: string;
  readonly: boolean;
  className: string;
  type: InputTypes;
  placeholder: string;
  onChange: (e?: ChangeEvent<HTMLInputElement>) => void;
  list?: 'address';
}) {
  const props = {
    onChange: onChange,
    readOnly: readonly,
    className: className,
    type: type,
    placeholder: placeholder,
    maxLength: 32,
    list: list,
  };

  return (
    <>
      <input value={value} {...props} />
    </>
  );
}
