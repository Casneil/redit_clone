import { Fragment, createRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import useSWR from "swr";
import classNames from "classnames";

//Context
import { useAuthState } from "../../context/auth";

import PostCard from "../../components/PostCard";
import { IPost, ISub } from "../../interfaces";

const Sub = () => {
  const [ownSub, setOwnSub] = useState<boolean>(false);

  const router = useRouter();
  const subName = router.query.sub;
  const { authenticated, user } = useAuthState();

  const fileInputRef = createRef<HTMLInputElement>();

  const { data: sub, error } = useSWR<ISub>(
    subName ? `/subs/${subName}` : null
  );

  useEffect(() => {
    if (!sub) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  let postMarkup;
  if (error) router.push("/");

  if (!sub) {
    postMarkup = <p className="text-lg text-center">Loading...</p>;
  } else if (sub.posts.length === 0) {
    postMarkup = <p className="text-lg text-center">No posts found</p>;
  } else {
    postMarkup = sub.posts.map((post: IPost) => (
      <PostCard key={post.identifier} post={post} />
    ));
  }

  return (
    <Fragment>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {sub && (
        <Fragment>
          <input type="file" hidden={true} ref={fileInputRef} />
          <Fragment>
            {/* Sub info & images */}
            <div>
              {/* Banner image*/}
              <div
                className={classNames("bg-blue-500", {
                  "cursor-pointer": ownSub,
                })}
              >
                {sub.bannerUrl ? (
                  <div
                    className="h-56 bg-blue-600"
                    style={{
                      backgroundImage: `url(${sub.bannerUrl})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                ) : (
                  <div className="h-20 bg-blue-600"></div>
                )}
              </div>
              {/* Sub metadata */}
              <div className="h-20 bg-white">
                <div className="container relative flex">
                  <div
                    className="absolute"
                    style={{
                      top: -15,
                      border: "7px solid white",
                      borderRadius: 50,
                    }}
                  >
                    <Image
                      src={sub.imageUrl}
                      alt="Sub"
                      width={70}
                      height={70}
                      className={classNames("rounded-full", {
                        "cursor-pointer": ownSub,
                      })}
                    />
                  </div>
                  <div className="pt-1 pl-24">
                    <div className="flex items-center">
                      <h1 className="mb-1 text-2xl font-bold">{sub.title}</h1>
                    </div>
                    <p className="text-sm font-bold text-gray-500">
                      /r/{sub.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Posts & Sidebar */}
            <div className="container flex pt-5">
              <div className="w-160">{postMarkup}</div>
            </div>
          </Fragment>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Sub;
