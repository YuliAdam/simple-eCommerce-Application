import type { ClientResponse, ProductPagedQueryResponse } from '@commercetools/platform-sdk';
import { apiRoot } from './client';

export const getProducts = (): Promise<Error | ClientResponse<ProductPagedQueryResponse>> => {
  console.log();
  return apiRoot
    .products()
    .get()
    .execute()
    .catch((err: Error) => err);
};
