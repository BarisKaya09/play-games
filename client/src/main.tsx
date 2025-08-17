import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RouterProvider } from 'react-router'
import router from './router/router.tsx'

createRoot(document.getElementById('root')!).render(
  <App>
    <RouterProvider router={router}></RouterProvider>
  </App>
)
