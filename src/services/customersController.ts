import type { ClientResponse, CustomerSignInResult } from '@commercetools/platform-sdk';
import { apiRoot } from './client';

export interface customerLoginRequestBody {
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
