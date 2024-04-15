import React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeSettings } from "../src/theme/Theme";
import createEmotionCache from "../src/createEmotionCache";
import { Provider } from "react-redux";
import Store from "../src/store/Store";
import RTL from "./../src/layouts/full/shared/customizer/RTL";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useSelector } from "../src/store/Store";
import { AppState } from "../src/store/Store";
import NextNProgress from "nextjs-progressbar";
import BlankLayout from "../src/layouts/blank/BlankLayout";
import FullLayout from "../src/layouts/full/FullLayout";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from '@mantine/core';
import '../styles/globals.css';
import store from "../src/store/Store";

// CSS FILES
import "react-quill/dist/quill.snow.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from '@mantine/modals';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const layouts: any = {
  Blank: BlankLayout,
};

const MyApp = (props: MyAppProps) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    session
  }: any = props;
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);
  const Layout = layouts[Component.layout] || FullLayout;
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setLoading(true), 1000);
  }, []);
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Menzies Aviation</title>
      </Head>
      <NextNProgress color="#00bcc8" />
      <MantineProvider 
        theme={{
          colors: {
            brand: ['#EBFBEE', '#D3F9D8', '#B2F2BB', '#8CE99A', '#69DB7C', '#51CF66', '#40C057', '#37B24D', '#1f3567', '#1f3567'],
          },
          primaryColor: 'brand',
          primaryShade: 8,
        }}
        withGlobalStyles 
        withNormalizeCSS
        >
          <ModalsProvider>
          <Notifications />
      <ThemeProvider theme={theme}>
        <RTL direction={customizer.activeDir}>
          <CssBaseline />
          {loading ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100vh",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </RTL>
      </ThemeProvider>
      </ModalsProvider>
      </MantineProvider>
    </CacheProvider>
    </Provider>
    </SessionProvider>
  );
};
// eslint-disable-next-line react-hooks/exhaustive-deps
const MyAppWrapper = (props: MyAppProps) => (
  <Provider store={Store}>
    <MyApp {...props} />
  </Provider>
);

MyAppWrapper.displayName = 'MyAppWrapper';

export default MyAppWrapper;
