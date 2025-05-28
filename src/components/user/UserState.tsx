import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Input } from './Input';
import styles from '@pages/user/user.module.scss';
import { Pencil } from '@/assets/img/pencil';
import { offRedactMood, onRedactMood } from '@/store/slices/userSlice';

export function UserState() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const dataArr = [
    { name: 'Email:', value: user.userParams.login },
    { name: 'First name:', value: user.userParams.firstName },
    { name: 'Last name:', value: user.userParams.lastName },
    { name: 'Bith day:', value: user.userParams.birthDay.split('-').reverse().join('-') },
  ];

  function setRedactMood() {
    user.isRedactMood ? dispatch(offRedactMood()) : dispatch(onRedactMood());
  }

  return (
    <section className={styles.user_section}>
      <div className={styles.user_section_title}>
        <h5>Personal Data</h5>
        <Pencil
          className={`${styles.user_pencil} ${user.isRedactMood ? styles.redact : ''}`}
          onClick={setRedactMood}
        />
      </div>
      {dataArr.map(item => {
        return (
          <div className={styles.user_wrap} key={item.name}>
            <Input
              value={`${item.name} ${item.value}`}
              readonly={!user.isRedactMood}
              className={styles.user_input}
            />
          </div>
        );
      })}
    </section>
  );
}
