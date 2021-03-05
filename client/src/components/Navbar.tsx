import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Axios from "axios";
import { useRouter } from "next/router";
//Context
import { useAuthState, useAuthDispatch } from "../context/auth";
//Interfaces and Enuns
import { ISub } from "../interfaces";
import { REDUCER_ENUM } from "../emums";
import ReaditLogo from "../../public/images/logo.svg";

const Navbar: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [subs, setSubs] = useState<Array<ISub>>([]);
  const [timer, setTimer] = useState(null);

  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();
  const router = useRouter();

  const logout = () => {
    Axios.get("/auth/logout")
      .then((_) => {
        dispatch(REDUCER_ENUM.LOGOUT);
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (name.trim().length === 0) {
      setSubs([]);
      return;
    }
    searchSubs();
  }, [name]);

  const searchSubs = async () => {
    clearTimeout(timer);
    setTimer(
      setTimeout(async () => {
        try {
          const { data } = await Axios.get(`/subs/search/${name}`);
          setSubs(data);
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      }, 250)
    );
  };

  const goToSub = (subName: string) => {
    router.push(`/r/${subName}`);
    setName("");
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
      <div className="flex items-center">
        <Link href="/">
          <a>
            <ReaditLogo className="w-8 h-8 mr-2" />
          </a>
        </Link>
        <span className="hidden text-2xl font-semibold lg:block">
          <Link href="/">readdit</Link>
        </span>
      </div>

      <div className="relative flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
        <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
        <input
          type="text"
          className="py-1 bg-transparent pr-3-rounded focus:outline-none w-160"
          placeholder="Search"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        {/* Search dropdown */}
        <div
          className="absolute left-0 right-0 bg-white"
          style={{ top: "100%" }}
        >
          {subs?.map((sub) => (
            <div
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
              onClick={() => goToSub(sub.name)}
            >
              <Image
                src={sub.imageUrl}
                alt="Sub"
                height={(6 * 16) / 4}
                width={(6 * 16) / 4}
                className="rounded-full"
              />
              <div className="ml-4 text-sm">
                <p className="font-medium">{sub.name}</p>
                <p className="text-gray-600">{sub.title}</p>
              </div>
            </div>
          ))}
        </div>
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
