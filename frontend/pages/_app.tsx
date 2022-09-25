import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';
import Layout from '../components/Layout';
import { lightTheme, GlobalStyle } from '../design/themes';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={lightTheme}>
      <Head>
        <title>opti.xyz</title>
        <meta name="optimistic oracle" content="a fun thing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalStyle />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
