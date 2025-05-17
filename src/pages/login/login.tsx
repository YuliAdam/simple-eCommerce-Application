import { Path } from '@/config/routesConfig';
import { withPasswordFlow } from '@/services/flow/passwordFlow';
import type { JSX } from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Login(): JSX.Element {
  const navigate = useNavigate();
  const isAuth =
    localStorage.getItem('[simple]client_token') && localStorage.getItem('[simple]client_id'); // TODO: how to check that token is valid?

  useEffect(() => {
    // FIX: change for protected react-router
    if (isAuth) navigate(Path.user);
  });

  const [isLoginResponse, setIsLoginResponse] = useState('');
  async function handleForm(formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
      console.log('email or password TypeError');

      // TODO: add client UI notify about error
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

      // TODO: add credentials data from response to State
      console.log('ok login', response);
      // localStorage.setItem();

      localStorage.setItem('[simple]client_id', response.body.customer.id);
    } catch (error) {
      console.log('error login', error);
      if (error instanceof Error) setIsLoginResponse(error.message);

      // TODO: add client UI notify about error
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    return e.target;
  }

  return (
    <div>
      <h2>Login </h2>
      {isLoginResponse}
      <form action={handleForm}>
        <div>
          <label>Email</label>
          <input
            required
            autoComplete="email"
            onInput={onChange}
            // value="yuli3@example.com"
            type="email"
            name="email"
            placeholder="example@example.com"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            required
            autoComplete="password"
            name="password"
            // value="secret123"
            onInput={onChange}
            type="password"
          />
        </div>
        <button type="submit">Continue</button>
      </form>
      <span>OR</span>
      <div>
        <p>New user?</p>
        <Link to={Path.registration}>Create an account</Link>
      </div>
    </div>
  );
}
