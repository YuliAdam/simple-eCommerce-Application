import type { InputTypes } from '@/interfaces/types';
import type { ChangeEvent } from 'react';

export function Input({
  value,
  readOnly,
  className,
  type,
  placeholder,
  onChange,
  list,
}: {
  value: string;
  readOnly: boolean;
  className: string;
  type: InputTypes;
  placeholder: string;
  onChange?: (e?: ChangeEvent<HTMLInputElement>) => void;
  list?: 'address';
}) {
  const props = {
    onChange,
    readOnly,
    className,
    type,
    placeholder,
    maxLength: 32,
    list,
  };

  return (
    <>
      <input value={value} {...props} />
    </>
  );
}
