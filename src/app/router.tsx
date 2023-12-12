import { createBrowserRouter } from 'react-router-dom';
import { Builder } from '~/pages/builder';

export const router = createBrowserRouter([
  {
    path: '/constructor',
    element: <Builder />,
  },
]);
