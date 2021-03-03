import { useEffect, useState } from "react";
import Head from "next/head";

import Axios from "axios";

//Interfaces
import { IPosts } from "../interfaces";

export default function Home() {
  const [posts, setPosts] = useState<Array<IPosts>>([]);

  useEffect(() => {
    Axios.get("./posts")
      .then((res) => {
        setPosts(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="pt-12">
      <Head>
        <title>readit: the frontpage of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feeds */}
        <div className="w-160">
          {posts.map((post: IPosts) => (
            <div key={post.identifier} className="flex mb-4 bg-white rounded">
              {/* Vote section */}
              <div className="w-10 text-center bg-gray-200 rounded-l">
                <p>V</p>
              </div>
              {/* Post data section */}
              <div className="w-full p-2">
                <p>{post.body}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
}
