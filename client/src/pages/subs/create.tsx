import { useState } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import Axios from "axios";

const create = () => {
  const [name, setName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [errors, setErrors] = useState<Partial<any>>({});

  return (
    <div className="flex bg-white">
      <Head>
        <title>Create a Community</title>
      </Head>
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/bg_image.png')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-98">
          <h1 className="mb-2 text-lg font-medium">Create a Communit</h1>
        </div>
      </div>
    </div>
  );
};

export default create;

export const getServerSiteProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error("Missing auth token cookie");
    await Axios.get("/auth/me", { headers: { cookie } });

    return { props: {} };
  } catch (error) {
    res.writeHead(307, { Location: "/login" }).end();
  }
};
