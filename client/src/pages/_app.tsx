import { Fragment } from "react";

import { AppProps } from "next/app";
import Axios from "axios";
import { useRouter } from "next/router";

import "../styles/tailwind.css";

import Navbar from "../components/Navbar";

Axios.defaults.baseURL = "http://localhost:5000/api";
Axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  return (
    <Fragment>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </Fragment>
  );
}

export default MyApp;
