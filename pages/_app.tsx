import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import AppStore from '../store/state'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppStore>
        <Navbar />
        <hr />
        <Component {...pageProps} />
      </AppStore>
    </>
  )
}

export default MyApp
