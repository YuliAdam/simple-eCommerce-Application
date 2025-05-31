export default interface I_SortedProduct {
  description?: {
    ['en-GB']?: string;
  };
  id: string;
  name?: {
    ['en-GB']?: string;
  };
  masterVariant: {
    images?: {
      url?: string;
      label?: string;
    }[];
    prices?: {
      discounted?: {
        value?: I_Prices;
      };
      value?: I_Prices;
    }[];
  };
}

interface I_Prices {
  centAmount: number;
  currencyCode: string;
  fractionDigits: number;
}
