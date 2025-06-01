export default interface I_ProductCardData {
  id: string;
  name?: string;
  description?: string;
  images?: {
    url?: string;
    label?: string;
  }[];
  prices?: {
    discounted?: {
      value?: {
        centAmount: number;
        currencyCode: string;
        fractionDigits: number;
      };
    };
    value?: {
      centAmount: number;
      currencyCode: string;
      fractionDigits: number;
    };
  }[];
  variants?: {
    attributes?: {
      name: string;
      value: {
        key: string;
        label: string;
      };
    }[];
  }[];
  attributes?: {
    name: string;
    value: {
      key: string;
      label: string;
    };
  }[];
}
