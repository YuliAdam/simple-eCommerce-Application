import { apiRoot } from './client';

export const getProducts = async ({ categoryId = null }: { categoryId?: string | null } = {}) => {
  try {
    if (categoryId) {
      return await apiRoot
        .products()
        .get({
          queryArgs: {
            where: `masterData(current(categories(id in ("${categoryId}"))))`,
          },
        })
        .execute();
    } else {
      return await apiRoot.products().get().execute();
    }
  } catch (err) {
    console.log(err);
  }
};

export const getCategories = async () => {
  try {
    return await apiRoot.categories().get().execute();
  } catch (err) {
    console.log(err);
  }
};

export const getSortedProducts = async ({
  categoryId,
  sortByPrice,
  sortByName,
  minPrice = 0,
  maxPrice = 30, // temp
  checkboxFilters,
}: {
  categoryId?: string | null;
  sortByPrice?: string | null;
  sortByName?: string | null;
  minPrice?: number;
  maxPrice?: number;
  checkboxFilters?: { name: string; value: string[] }[];
} = {}) => {
  const filterByCategoryOption = `categories.id:"${categoryId}"`;
  const sortByPriceOptions = `price ${sortByPrice}`;
  const sortByNameOptions = `name.en-GB ${sortByName}`;
  const filterByMinPrice = Number.isFinite(minPrice) ? minPrice : 0;
  const filterByMaxPrice = Number.isFinite(maxPrice) ? maxPrice : 30;

  const options: { [key: string]: string[] } = {};

  const filterOptions = [];

  const sortOptions = [];

  if (categoryId) {
    filterOptions.push(filterByCategoryOption);
  }

  if (sortByPrice) {
    sortOptions.push(sortByPriceOptions);
  }

  if (sortByName) {
    sortOptions.push(sortByNameOptions);
  }

  if (checkboxFilters) {
    checkboxFilters.forEach(checkboxFilter => {
      const options = checkboxFilter.value.map(value => `"${value}"`).join(',');
      const filter = `variants.attributes.${checkboxFilter.name}.key:${options}`;
      filterOptions.push(filter);
    });
  }

  const min = filterByMinPrice * 100;
  const max = filterByMaxPrice * 100;
  filterOptions.push(`variants.price.centAmount:range (${min} to ${max})`);

  if (sortOptions.length > 0) {
    options.sort = sortOptions;
  }

  if (filterOptions.length > 0) {
    options.filter = filterOptions;
  }

  try {
    return await apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: options,
      })
      .execute();
  } catch (err) {
    console.log(err);
  }
};

export const getProductsBySearch = async (text: string) => {
  try {
    return await apiRoot
      .productProjections()
      .suggest()
      .get({
        queryArgs: {
          'searchKeywords.en-GB': text,
          fuzzy: true,
        },
      })
      .execute();
  } catch (err) {
    console.log(err);
  }
};
