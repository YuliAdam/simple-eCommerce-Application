import { UserAddress } from './UserAddress';
import { UserState } from './UserState';

export function UserForm() {
  return (
    <form>
      <UserState />
      <UserAddress />
    </form>
  );
}
