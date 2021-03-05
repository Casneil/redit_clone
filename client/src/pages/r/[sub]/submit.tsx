import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import useSWR from "swr";
import Axios from "axios";

import SideBar from "../../../components/Sidebar";
//Interfaces
import { IPost } from "../../../interfaces";

const Submit = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const router = useRouter();
  const { sub: subName } = router.query;
  const { data: sub, error } = useSWR(subName ? `/subs/${subName}` : null);
  if (error) router.push("/");

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();
    if (title.trim() === "") return;

    try {
      const { data: post } = await Axios.post<IPost>("/posts", {
        title: title.trim(),
        body,
        sub: sub.name,
      });
      setTitle("");
      setBody("");
      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to Readdit</title>
      </Head>
      <div className="w-160">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                placeholder="Title"
                maxLength={300}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <div
                className="absolute mb-2 ml-2 text-sm text-gray-500 select-none"
                style={{ top: -35, right: 10 }}
              >
                {/* e.g. 150/300  */}
                {title.trim().length}/300
              </div>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
              value={body}
              placeholder="Text (optional)"
              rows={4}
              onChange={(event) => setBody(event.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-3 py-1 blue button"
                type="submit"
                disabled={title.trim().length < 2}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {sub && <SideBar sub={sub} />}
    </div>
  );
};

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

export default Submit;
