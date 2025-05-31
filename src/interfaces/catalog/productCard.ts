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
      value?: I_Prices;
    };
    value?: I_Prices;
  }[];
}

interface I_Prices {
  centAmount: number;
  currencyCode: string;
  fractionDigits: number;
}
