import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import styles from '@pages/user/user.module.scss';
import { Pencil } from '@/assets/img/pencil';
import { InputName } from '@/interfaces/types';
import Trash from '@/assets/img/trash';

//const UPDATE_MESSAGE = 'Your address was updated successfully!';

export function UserAddress() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const dataArr = [
    { name: 'Street:', input: InputName.street },
    {
      name: 'City:',
      input: InputName.city,
    },
    {
      name: 'Postal Code::',
      input: InputName.postalCode,
    },
    {
      name: 'Country:',
      input: InputName.country,
    },
  ];
  dispatch;
  dataArr;
  return (
    <section className={styles.user_section}>
      <div className={styles.user_section_title}>
        <h5>Addresses</h5>
      </div>
      {user.userAddresses.map(item => {
        return (
          <div className={styles.user_section} key={item.id}>
            <div className={styles.address}>
              <p>{`${item.streetName.value} ${item.city.value} ${item.country.value}, ${item.postalCode.value}`}</p>
              <div className={styles.address_redact}>
                <Pencil className={styles.user_pencil} onClick={() => {}} />
                <Trash className={styles.user_pencil} onClick={() => {}} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
