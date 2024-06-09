import { ChakraProvider } from '@chakra-ui/react'
import { ContextProvider } from '@/context/userContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/styles.css'

export default function App({ Component, pageProps }) {

  return (
    <ChakraProvider>
      <ContextProvider>
        <ToastContainer autoClose={2000} />
        <Component {...pageProps} />
      </ContextProvider>
    </ChakraProvider>
  )
}
