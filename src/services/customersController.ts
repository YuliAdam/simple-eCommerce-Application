import type {
  ClientResponse,
  CustomerSignInResult,
  MyCustomerDraft,
} from '@commercetools/platform-sdk';
import { apiRoot } from './client';

interface customerLoginRequestBody {
  email: string;
  password: string;
}

export async function createCustomer(
  body: MyCustomerDraft,
): Promise<Error | ClientResponse<CustomerSignInResult>> {
  console.log(body);
  return await apiRoot
    .me()
    .signup()
    .post({
      body: body,
    })
    .execute()
    .catch((err: Error) => err);
}

const loginParams: customerLoginRequestBody = {
  email: 'yuli3@example.com',
  password: 'secret123',
};

export async function loginCustomer(): Promise<Error | ClientResponse<CustomerSignInResult>> {
  return apiRoot
    .me()
    .login()
    .post({
      body: loginParams,
    })
    .execute()
    .catch((err: Error) => err);
}
