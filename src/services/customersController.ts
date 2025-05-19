import type {
  ClientResponse,
  CustomerSignInResult,
  MyCustomerDraft,
} from '@commercetools/platform-sdk';
import { apiRoot } from './client';
import type { ILoginParams } from '@/interfaces/types';

export async function createCustomer(
  body: MyCustomerDraft,
): Promise<Error | ClientResponse<CustomerSignInResult>> {
  console.log('Create customer', body);
  return await apiRoot
    .me()
    .signup()
    .post({
      body: body,
    })
    .execute()
    .catch((err: Error) => err);
}

export async function loginCustomer(
  body: ILoginParams,
): Promise<Error | ClientResponse<CustomerSignInResult>> {
  console.log('Login customer', body);
  return apiRoot
    .me()
    .login()
    .post({
      body: body,
    })
    .execute()
    .catch((err: Error) => err);
}
