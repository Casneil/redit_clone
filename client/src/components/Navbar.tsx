import React, { Fragment } from "react";

import Link from "next/link";
import Axios from "axios";
//Context
import { useAuthState, useAuthDispatch } from "../context/auth";
//Interfaces and Enuns
import { REDUCER_ENUM } from "../emums";
import ReaditLogo from "../../public/images/logo.svg";

const Navbar: React.FC = () => {
  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();

  const logout = () => {
    Axios.get("/auth/logout")
      .then((_) => {
        dispatch(REDUCER_ENUM.LOGOUT);
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
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

      <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
        <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
        <input
          type="text"
          className="py-1 bg-transparent pr-3-rounded focus:outline-none w-160"
          placeholder="Search"
        />
      </div>
      {/* Auth buttons */}

      <div className="flex">
        {!loading &&
          (authenticated ? (
            <Fragment>
              <button
                className="w-32 py-1 mr-4 leading-5 hallow blue button"
                onClick={logout}
              >
                Log Out
              </button>
            </Fragment>
          ) : (
            <Fragment>
              <Link href="/login">
                <a className="w-32 py-1 mr-4 leading-5 hallow blue button">
                  Log in
                </a>
              </Link>
              <Link href="/register">
                <a className="w-32 py-1 leading-5 blue button">Sign Up</a>
              </Link>
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
