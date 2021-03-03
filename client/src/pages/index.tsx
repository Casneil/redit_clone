import { useEffect, useState, Fragment } from "react";
import Head from "next/head";

import Axios from "axios";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//Interfaces
import { IPosts } from "../interfaces";

dayjs.extend(relativeTime);

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
                <div className="flex items-center">
                  <Fragment>
                    <Link href={`/r/${post.subName}`}>
                      <img
                        src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                        className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                      />
                    </Link>

                    <a
                      href={`/r/${post.subName}`}
                      className="text-xs font-bold hover:underline"
                    >
                      /r/{post.subName}
                    </a>
                  </Fragment>
                  <p className="text-xs text-gray-600">
                    <span className="mx-1 text-gray-500">•</span> Posted by
                    <Link href={post.username}>
                      <a className="mx-1 hover:underline">{post.username}</a>
                    </Link>
                    <Link href={post.url}>
                      <a className="mx-1 hover:underline">
                        {dayjs(post.createdAt).fromNow()}
                      </a>
                    </Link>
                  </p>
                </div>
                <Link href={post.url}>
                  <a className="my-1 text-lg font-medium">{post.title}</a>
                </Link>
                {post.body && <p className="my-1 text xm">{post.body}</p>}
                <div className="flex">
                  <Link href={post.url}>
                    <a>
                      <div className="px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                        <span className="font-bold">20 Comments</span>
                      </div>
                    </a>
                  </Link>
                  <div className="px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                    <i className="mr-1 fas fa-share fa-xs"></i>
                    <span className="font-bold">Share</span>
                  </div>
                  <div className="px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                    <i className="mr-1 fas fa-bookmark fa-xs"></i>
                    <span className="font-bold">Save</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
}
