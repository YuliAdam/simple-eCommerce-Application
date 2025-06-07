import type { ChangeEvent } from 'react';

export default function RadioSortInput({
  wrapClassName,
  inputClassName,
  labelClassName,
  onChange,
  checked,
  id,
  value,
  text,
  name,
}: {
  wrapClassName: string;
  inputClassName: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  id: string;
  value: string;
  labelClassName: string;
  text: string;
  name: string;
}) {
  const props = {
    className: inputClassName,
    onChange,
    checked,
    id,
    name,
    value,
  };
  return (
    <div className={wrapClassName}>
      <input type="radio" {...props} />
      <label className={labelClassName} htmlFor={id}>
        {text}
      </label>
    </div>
  );
}
