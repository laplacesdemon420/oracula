import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme as darkThemeRainbowKit,
  Chain,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ThemeProvider } from 'styled-components';
import Layout from '../components/Layout';
import { lightTheme, darkTheme, GlobalStyle } from '../design/themes';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

const aurora: Chain = {
  id: 1313161554,
  name: 'Aurora',
  network: 'aurora',
  iconUrl:
    'https://raw.githubusercontent.com/aurora-is-near/bridge-assets/master/tokens/aurora.svg',
  nativeCurrency: {
    decimals: 18,
    name: 'ETHER',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: 'https://mainnet.aurora.dev',
  },
  blockExplorers: {
    default: { name: 'AuroraScan', url: 'https://aurorascan.dev/' },
  },
  testnet: false,
};

const auroraTestnet: Chain = {
  id: 1313161555,
  name: 'Aurora Testnet',
  network: 'auroraTestnet',
  iconUrl:
    'https://raw.githubusercontent.com/aurora-is-near/bridge-assets/master/tokens/aurora.svg',
  nativeCurrency: {
    decimals: 18,
    name: 'ETHER',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: 'https://testnet.aurora.dev',
  },
  blockExplorers: {
    default: {
      name: 'AuroraScan Testnet',
      url: 'https://testnet.aurorascan.dev/',
    },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [chain.goerli, aurora, auroraTestnet],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'optimo',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={lightTheme}>
      <Head>
        <title>opti.xyz</title>
        <meta name="optimistic oracle" content="a fun thing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalStyle />
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={darkThemeRainbowKit({
            accentColor: lightTheme.colors.primary,
            accentColorForeground: 'white',
            borderRadius: 'small',
            fontStack: 'system',
          })}
        >
          <QueryClientProvider client={queryClient}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default MyApp;
