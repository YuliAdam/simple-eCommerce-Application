import type { AddressInputName, InputName } from '@/interfaces/types';

export default function getValueInObjectByInputName(
  name: InputName | AddressInputName,
  obj: Object,
): string {
  let text = '';
  Object.entries(obj).forEach(([key, value]) => {
    if (key === name) {
      text = value;
    }
  });
  return text;
}
