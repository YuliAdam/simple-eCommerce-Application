import { useParams } from 'react-router-dom';

function Product() {
  const params = useParams();
  return <section>product - {params.id}</section>;
}

export default Product;
