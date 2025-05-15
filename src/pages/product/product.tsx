import { useParams } from 'react-router-dom';

function Product() {
  const params = useParams();
  console.log(params);
  return <section>product - {params.id}</section>;
}

export default Product;
