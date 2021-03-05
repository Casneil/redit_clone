import { AppProps } from "next/app";
import Axios from "axios";
import { useRouter } from "next/router";
import { SWRConfig } from "swr";

import "../styles/tailwind.css";
import "../styles/icons.css";

import Navbar from "../components/Navbar";
//Context
import { AuthProvider } from "../context/auth";

Axios.defaults.baseURL = "http://localhost:5000/api";
Axios.defaults.withCredentials = true;

const fetcher = async (url: string) => {
  try {
    const res = await Axios.get(url);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};
const MyApp = ({ Component, pageProps }: AppProps) => {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  return (
    <SWRConfig
      value={{
        fetcher: (url) => fetcher(url),
        dedupingInterval: 4000,
        revalidateOnFocus: true,
      }}
    >
      <AuthProvider>
        {!authRoute && <Navbar />}
        <div className={authRoute ? "" : "pt-12"}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
};

export default MyApp;
