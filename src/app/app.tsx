import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/authslice';

export function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(login(token));
    }
  }, [dispatch]);

  return <RouterProvider router={router} />;
}
