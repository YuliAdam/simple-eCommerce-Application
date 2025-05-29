import { SHOP } from '@/config/localStorageConfig';
import { getCustomer } from '@/services/customersController';
import { useEffect } from 'react';
import styles from './user.module.scss';
import { useDispatch } from 'react-redux';
import { UserRedact } from '@/components/user/UserRedact';
import { setAddresses, setUserState, setVersion } from '@/store/slices/userSlice';

function User() {
  const dispatch = useDispatch();
  useEffect(() => {
    const id = localStorage.getItem(SHOP.client_id);
    if (id) {
      getCustomer(id).then(res => {
        if (res && !(res instanceof Error)) {
          const body = res.body;
          console.log(body);
          dispatch(setUserState(body));
          dispatch(setAddresses(body));
          dispatch(setVersion(body.version));
        }
      });
    }
  }, []);
  return (
    <section className={styles.user}>
      <h2 className={styles.user_title}>User Page</h2>
      <UserRedact />
    </section>
  );
}

export default User;
