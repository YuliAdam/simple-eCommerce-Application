import { router } from '@/routes/router';
import { login } from '@/store/slices/authSlice';
import { SHOP } from '@config/localStorageConfig';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

export function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const client_id = localStorage.getItem(SHOP.client_id);
    if (client_id) {
      dispatch(login(client_id));
    }
  }, [dispatch]);

  return <RouterProvider router={router} />;
}
