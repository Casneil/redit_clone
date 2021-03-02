import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

import ReaditLogo from "../../public/images/logo.svg";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>readit: the frontpage of the internet</title>
      </Head>
      {/* Navbar */}
      <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 bg-white">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <a>
              <ReaditLogo className="w-8 h-8 mr-2" />
            </a>
          </Link>
          <span className="text-2xl font-semibold">
            <Link href="/">readit</Link>
          </span>
        </div>
        {/* Searchbar */}
        <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
          <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
          <input
            type="text"
            className="py-1 bg-transparent pr-3-rounded focus:outline-none w-160"
          />
        </div>
        {/* Login Sign Up buttons */}
      </div>
    </div>
  );
}
