import { useParams } from 'react-router-dom';

function Product() {
  const params = useParams();
  const id = params.id;
  console.log(id);
  return <section>product - {params.id}</section>;
}

export default Product;
