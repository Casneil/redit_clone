import { useState } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import Axios from "axios";

import classNames from "classnames";

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
          <hr />
          {/* Form */}
          <form>
            {/* Name */}
            <div className="my-6">
              <p className="font-medium">Name</p>
              <p className="mb-2 text-xs text-gray-500">
                Community names including capitalization cannot be changed.
              </p>
              <input
                type="text"
                className={classNames(
                  "w-full p-3 border border-gray-200 rounded hover:boder-grey-500",
                  { "border-red-600": errors.name }
                )}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <small className="font-medium text-red-600">{errors.name}</small>
            </div>
            {/* Title */}
            <div className="my-6">
              <p className="font-medium">Title</p>
              <p className="mb-2 text-xs text-gray-500">
                Community title represents the topic and can be changed at any
                time.
              </p>
              <input
                type="text"
                className={classNames(
                  "w-full p-3 border border-gray-200 rounded hover:boder-grey-500",
                  { "border-red-600": errors.title }
                )}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <small className="font-medium text-red-600">{errors.title}</small>
            </div>
            {/* Description */}
            <div className="my-6">
              <p className="font-medium">Description</p>
              <p className="mb-2 text-xs text-gray-500">
                This is how new members come to understand your community
              </p>
              <textarea
                className="w-full p-3 border border-gray-200 rounded hover:boder-grey-500"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              ></textarea>
              <small className="font-medium text-red-600">
                {errors.description}
              </small>
            </div>
          </form>
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
