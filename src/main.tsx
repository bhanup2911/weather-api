import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PerCity from './components/PerCity.tsx'
import theme from "./theme/theme.ts";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/city",
    element: <PerCity />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
    <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
)
