import { FormEvent, useState } from "react";

import Head from "next/head";
import Link from "next/link";
import Axios from "axios";
import { useRouter } from "next/router";

import InputGroup from "../components/InputGroup";

const Home = () => {
  const [email, setEmail] = useState<string>();
  const [username, setUserName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [agreement, setAgreement] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});

  const router = useRouter();

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    if (!agreement) {
      setErrors({
        ...errors,
        agreement: "You must agree to site terms and conditions",
      });
      return;
    }

    try {
      await Axios.post("/auth/register", {
        email,
        password,
        username,
      });
      router.push("/login");
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex">
      <Head>
        <title>Register</title>
      </Head>
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/bg_image.png')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing you agree to our{" "}
            <span className="text-xs text-blue-500 text">User Agreement</span>{" "}
            and <span className="text-blue-500 text xs">Privacy Policy</span>
          </p>
          <form onSubmit={submitForm}>
            <div className="mb-6">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer"
                id="agreement"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get emails about cool stuff on Readit
              </label>
              <small className="block font-medium text-red-600">
                {errors.agreement}
              </small>
            </div>
            <InputGroup
              className="mb-2"
              value={email}
              setValue={setEmail}
              placeholder="EMAIL"
              error={errors.email}
              type="email"
            />
            <InputGroup
              className="mb-2"
              value={username}
              setValue={setUserName}
              placeholder="USERNAME"
              error={errors.username}
              type="text"
            />
            <InputGroup
              className="mb-4"
              value={password}
              setValue={setPassword}
              placeholder="PASSWORD"
              error={errors.password}
              type="password"
            />
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase transition duration-200 bg-blue-500 border border-blue-500 rounded">
              Sign Up
            </button>
          </form>
          <small>
            Already a readitor?
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">Log In</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Home;
