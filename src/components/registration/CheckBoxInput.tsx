import { InputTypes } from '@/interfaces/types';

export function CheckBox({
  checked,
  onChange,
  text,
}: {
  checked: boolean;
  onChange: () => void;
  text: string;
}) {
  return (
    <p>
      <input type={InputTypes.checkbox} checked={checked} onChange={onChange} />
      <label>{text}</label>
    </p>
  );
}
