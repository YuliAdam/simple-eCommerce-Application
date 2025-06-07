import type I_Product from './product';

//Interface I_ProductDetailed don't used. Can we delete it?

type AttributeName = 'brand' | 'size' | 'color';
type AttributeValue = { key: string; label: string };
type Attribute = { name: AttributeName; value: AttributeValue };

type Prices = {
  centAmount: number;
  currencyCode: string;
  fractionDigits: number;
};

export default interface I_ProductDetailed extends I_Product {
  id: string;
  masterData: {
    current: {
      description: {
        ['en-GB']?: string;
      };
      name: {
        ['en-GB']?: string;
      };
      masterVariant: {
        images: {
          url: string;
          label?: string;
        }[];
        prices: {
          discounted?: {
            value: Prices;
          };
          value: Prices;
        }[];
        attributes: Attribute[];
      };
    };
  };
}
