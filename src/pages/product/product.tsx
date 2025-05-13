import { useParams } from 'react-router-dom';

export function Product() {
  const params = useParams();
  return <section>product - {params.id}</section>;
}
