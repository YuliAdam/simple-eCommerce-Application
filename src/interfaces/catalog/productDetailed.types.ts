import type I_Product from './product';

type AttributeName = 'brand' | 'size' | 'color';

type AttributeValue = {
  key: string;
  label: string;
};

type Attribute = {
  name: AttributeName;
  value: AttributeValue;
};

export default interface I_ProductDetailed extends I_Product {
  masterData: {
    current: {
      description?: {
        [key: string]: string;
      };
      name?: {
        [key: string]: string;
      };
      masterVariant: {
        prices: [
          {
            value: {
              currencyCode: 'string';
              centAmount: number;
            };
          },
        ];
        images: {
          url: string;
          label?: string;
        }[];
        attributes: Attribute[];
      };
    };
  };
}
