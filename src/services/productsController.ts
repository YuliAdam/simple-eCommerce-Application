import { apiRoot } from './client';

export const getProducts = async () => {
  try {
    return await apiRoot.products().get().execute();
  } catch (err) {
    console.log(err);
  }
};
