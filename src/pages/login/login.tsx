import { shop } from '@/config/localStorageConfig';
import { Path } from '@/config/routesConfig';
import { withPasswordFlow } from '@/services/flow/passwordFlow';
import type { JSX } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.scss';

/** TODO: LIST

SINGLE
 3. globalState(redux) - clientData(token,id, etc)
 6. provide specific password_scope for passwordFlow
 7. withRefreshToken for client with anonymousCart

*/

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}
export function LoginForm(): JSX.Element {
  const navigate = useNavigate();
  const [stateFormData, setStateFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoginResponse, setIsLoginResponse] = useState<React.ReactNode | null>(null);
  function validateForm(): boolean {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!stateFormData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(stateFormData.email)) {
      newErrors.email = 'Email must include @ and domain';
      isValid = false;
    }

    if (!stateFormData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (stateFormData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }
  async function handleForm(data: FormData) {
    const email = data.get('email');
    const password = data.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
      setIsLoginResponse(<div className={styles.error}>Missing fields</div>);
      return;
    }

    try {
      const response = await withPasswordFlow(email, password)
        .me()
        .login()
        .post({
          body: {
            email,
            password,
          },
        })
        .execute();
      navigate(Path.user);

      // TODO: add credentials data from response to redux global state
      localStorage.setItem(shop.client_id, response.body.customer.id);
    } catch (error) {
      if (error instanceof Error) {
        setIsLoginResponse(<div className={styles.error}>Login failed: {error.message}</div>);
        return;
      }
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setStateFormData({
      ...stateFormData,
      [name]: value,
    });
    validateForm();
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>

      {isLoginResponse}

      <form action={handleForm} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            required
            autoComplete="email"
            value={stateFormData.email}
            onChange={onChange}
            type="email"
            name="email"
            placeholder="example@example.com"
          />
          {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            required
            autoComplete="current-password"
            name="password"
            value={stateFormData.password}
            onChange={onChange}
            type="password"
          />
          {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
        </div>

        <button type="submit" className={styles.button}>
          Continue
        </button>
      </form>

      <div className={styles.divider}>
        <span className={styles.dividerText}>OR</span>
      </div>

      <div className={styles.createAccount}>
        <span className={styles.newUser}>
          New user?{' '}
          <Link to={Path.registration} className={styles.link}>
            Create an account
          </Link>
        </span>
      </div>
    </div>
  );
}
export default LoginForm;
