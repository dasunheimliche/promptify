import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Head from "next/head";

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem("user-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

// const httpLink = createHttpLink({uri: 'http://localhost:4000'})
const httpLink = createHttpLink({ uri: "https://promptify-api.vercel.app" });

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>{"Promptify"}</title>
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
