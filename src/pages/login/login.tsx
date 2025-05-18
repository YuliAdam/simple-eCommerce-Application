import { shop } from '@/config/localStorageConfig';
import { Path } from '@/config/routesConfig';
import { withPasswordFlow } from '@/services/flow/passwordFlow';
import type { JSX } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/** TODO: LIST

SINGLE
 1. clientside validate {email,password}
 2. display errors in clientside UI
 3. globalState(redux) - clientData(token,id, etc)
 4. private routing for isAuth
 5. add styling for LoginForm, (may be <Form/> to @component/)
 6. provide specific password_scope for passwordFlow
 7. withRefreshToken for client with anonymousCart

TEAM
 1. спросить про название магазина и поля в localStorage? предлагаю simple:

*/

export function Login(): JSX.Element {
  const navigate = useNavigate();
  // const isAuth = localStorage.getItem(shop.client_token) && localStorage.getItem(shop.client_id); // TODO: how to check that token is valid?

  // useEffect(() => {
  //   // FIX: change for protected react-router
  //   if (isAuth) navigate(Path.user);
  // });

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

      // TODO: add credentials data from response to redux global state
      console.log('ok login', response);
      // localStorage.setItem();

      localStorage.setItem(shop.client_id, response.body.customer.id);
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
      <h2>Login</h2>
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
        <button
          type="button"
          onClick={() => {
            navigate(Path.registration);
          }}
        >
          Create an account
        </button>
      </div>
    </div>
  );
}
