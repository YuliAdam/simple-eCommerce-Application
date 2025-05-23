import { SHOP } from '@/config/localStorageConfig';
import { Path } from '@/config/routesConfig';
import { withPasswordFlow } from '@/services/flow/passwordFlow';
import { login } from '@/store/slices/authSlice';
import { PATTERNS, VALIDATION_MESSAGES } from '@/utils/validation/registrationValidation';
import type { JSX } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.scss';
import { Eye } from '@/assets/img/eye';
import { EyeOff } from '@/assets/img/eyeoff';

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
  const [typePasswordForm, setTypePasswordForm] = useState('password');
  const passwordRegex: RegExp = new RegExp(PATTERNS.password);
  const loginRegex: RegExp = new RegExp(PATTERNS.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [stateFormData, setStateFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loginResponse, setLoginResponse] = useState<React.ReactNode | null>(null);
  const [disabledButton, setDisabledButton] = useState(true);
  function validateForm(): boolean {
    const newErrors: FormErrors = {};
    let isValid = true;
    if (!stateFormData.email) {
      newErrors.email = VALIDATION_MESSAGES.login;
      isValid = false;
    } else if (!loginRegex.test(stateFormData.email)) {
      newErrors.email = VALIDATION_MESSAGES.login;
      isValid = false;
    }

    if (!stateFormData.password) {
      newErrors.password = VALIDATION_MESSAGES.password;
      isValid = false;
    } else if (!passwordRegex.test(stateFormData.password)) {
      newErrors.password = VALIDATION_MESSAGES.password;
      isValid = false;
    }
    setErrors(newErrors);
    setDisabledButton(!isValid);
    return isValid;
  }
  async function handleForm(data: FormData) {
    const email = data.get('email');
    const password = data.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
      setLoginResponse(<div className={styles.error}>Missing fields</div>);
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
      navigate(Path.empty);

      // TODO: add credentials data from response to redux global state
      localStorage.setItem(SHOP.client_id, response.body.customer.id);

      dispatch(login(response.body.customer.id));
    } catch (error) {
      if (error instanceof Error) {
        setLoginResponse(<div className={styles.error}>Login failed: {error.message}</div>);
        return;
      }
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    name === 'email'
      ? setStateFormData((stateFormData = { email: value, password: stateFormData.password }))
      : setStateFormData((stateFormData = { email: stateFormData.email, password: value }));
    validateForm();
  }

  function handleTogglePassword() {
    if (typePasswordForm === 'password') {
      setTypePasswordForm('text');
    } else {
      setTypePasswordForm('password');
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>

      {loginResponse}

      <form action={handleForm} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            required
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
          <div className={styles.inputWrapper}>
            <input
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              required
              name="password"
              value={stateFormData.password}
              onChange={onChange}
              type={typePasswordForm}
            />
            <span className={styles.spanEye} onClick={handleTogglePassword}>
              {typePasswordForm === 'password' ? (
                <Eye className={styles.eye} />
              ) : (
                <EyeOff className={styles.eye} />
              )}
            </span>
          </div>
          {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
        </div>

        <button
          type="submit"
          className={`${styles.button} ${disabledButton ? styles.disabled : ''}`}
          disabled={disabledButton}
        >
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
