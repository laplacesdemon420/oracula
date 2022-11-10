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
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ThemeProvider } from 'styled-components';
import Layout from '../components/Layout';
import { darkTheme, GlobalStyle } from '../design/themes';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

const bittorrent: Chain = {
  id: 199,
  name: 'BitTorrent',
  network: 'bittorrent',
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/16086.png',
  nativeCurrency: {
    decimals: 18,
    name: 'BTT',
    symbol: 'BTT',
  },
  rpcUrls: {
    default: 'https://rpc.bittorrentchain.io',
  },
  blockExplorers: {
    default: { name: 'BttcScan', url: 'https://bttcscan.com/' },
  },
  testnet: false,
};

const bittorrentTestnet: Chain = {
  id: 1029,
  name: 'BitTorrent Testnet',
  network: 'bittorrentTestnet',
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/16086.png',
  nativeCurrency: {
    decimals: 18,
    name: 'BTT',
    symbol: 'BTT',
  },
  rpcUrls: {
    default: 'https://pre-rpc.bt.io/',
  },
  blockExplorers: {
    default: {
      name: 'BttcScan Testnet',
      url: 'https://testscan.bt.io',
    },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [bittorrent, bittorrentTestnet],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'oracula',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <Head>
        <title>Oracula</title>
        <meta name="Oracula" content="The Everything Oracle" />
        <link rel="icon" href="/react.webp" />
      </Head>
      <GlobalStyle />
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={darkThemeRainbowKit({
            accentColor: darkTheme.colors.secondary,
            accentColorForeground: 'white',
            borderRadius: 'small',
            fontStack: 'system',
          })}
        >
          <QueryClientProvider client={queryClient}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </QueryClientProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default MyApp;
