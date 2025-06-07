import { UserAddress } from './UserAddress';
import { UserPassword } from './UserPassword';
import { UserState } from './UserState';
import styles from '@pages/user/user.module.scss';

export function UserRedact() {
  return (
    <div className={styles.user_redact}>
      <UserState />
      <UserPassword />
      <UserAddress />
    </div>
  );
}
