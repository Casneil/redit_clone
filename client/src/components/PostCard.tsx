import React, { Fragment } from "react";

import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import relativeTime from "dayjs/plugin/relativeTime";
import Axios from "axios";
import classNames from "classnames";

import ActionButton from "./ActionButton";
//Context
import { useAuthState } from "../context/auth";
// Interfaces
import { IPost } from "../interfaces";

type PostCardTypes = {
  post: IPost;
  revalidate?: Function;
};

const PostCard = ({
  post: {
    identifier,
    voteScore,
    subName,
    url,
    username,
    title,
    body,
    commentCount,
    createdAt,
    slug,
    userVote,
    sub,
  },
  revalidate,
}: PostCardTypes) => {
  const { authenticated } = useAuthState();

  const router = useRouter();
  const isInSubPage = router.pathname === "/r/[sub]"; //e.g.: /r/reactjs
  dayjs.extend(relativeTime);

  const handleVote = async (value: number) => {
    if (!authenticated) router.push("/login");
    if (value === userVote) value = 0;
    try {
      await Axios.post("/misc/vote", {
        identifier,
        slug,
        value,
      });
      if (revalidate) revalidate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex mb-4 bg-white rounded" id={identifier}>
      {/* Vote section */}
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
        {/* Upvote */}
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
          onClick={() => handleVote(1)}
        >
          <i
            className={classNames("icon-arrow-up", {
              "text-red-500": userVote === 1,
            })}
          ></i>
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        {/* Downvote */}
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
          onClick={() => handleVote(-1)}
        >
          <i
            className={classNames("icon-arrow-down", {
              "text-blue-600": userVote === -1,
            })}
          ></i>
        </div>
      </div>
      {/* Post data section */}
      <div className="w-full p-2">
        <div className="flex items-center">
          {!isInSubPage && (
            <Fragment>
              <Link href={`/r/${subName}`}>
                <img
                  src={sub?.imageUrl}
                  className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                />
              </Link>
              <a
                href={`/r/${subName}`}
                className="text-xs font-bold hover:underline"
              >
                /r/{subName}
              </a>
              <span className="mx-1 text-gray-400">•</span> Posted by
            </Fragment>
          )}
          <p className="text-xs text-gray-500">
            <Link href={username}>
              <a className="mx-1 hover:underline">{username}</a>
            </Link>
            <Link href={url}>
              <a className="mx-1 hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={url}>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text xm">{body}</p>}
        <div className="flex">
          <Link href={url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{commentCount}</span>
              </ActionButton>
            </a>
          </Link>
          <ActionButton>
            <i className="mr-1 fas fa-share fa-xs"></i>
            <span className="font-bold">Share</span>
          </ActionButton>
          <ActionButton>
            <i className="mr-1 fas fa-bookmark fa-xs"></i>
            <span className="font-bold">Save</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
