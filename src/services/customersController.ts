import type { ClientResponse, CustomerSignInResult } from '@commercetools/platform-sdk';
import { apiRoot } from './client';

interface customerLoginRequestBody {
  email: string;
  password: string;
}

const customerDraft = {
  email: 'yuli3@example.com',
  firstName: 'Yuli',
  lastName: 'Adam',
  password: 'secret123',
};

export async function createCustomers(): Promise<Error | ClientResponse<CustomerSignInResult>> {
  return apiRoot
    .me()
    .signup()
    .post({
      body: customerDraft,
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
