export default interface I_SubCategory {
  id: string;
  name?: {
    ['en-GB']?: string;
  };
  parent?: {
    id: string;
  };
}
