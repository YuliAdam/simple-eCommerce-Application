export default interface I_Category {
  id: string;
  name?: {
    ['en-GB']?: string;
  };
  parent?: {
    id: string;
  };
}
