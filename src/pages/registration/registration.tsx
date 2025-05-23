import { RegistrationForm } from '@components/registration/RegistrationForm';
import type { ReactElement } from 'react';
import styles from './registration.module.scss';
import { Link } from 'react-router-dom';
import { Path } from '@config/routesConfig';

export function Registration(): ReactElement {
  return (
    <section className={styles.registration}>
      <h2 className={styles.registration_title}>Register</h2>
      <RegistrationForm />
      <div className={styles.registration_go_to_login}>
        <div>
          <span>OR</span>
        </div>
        <span>Already a member? </span>
        <Link className={styles.registration_go_to_login_link} to={Path.login}>
          Login
        </Link>
      </div>
    </section>
  );
}

export default Registration;
