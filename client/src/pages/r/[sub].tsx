import { Fragment } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import useSWR from "swr";

import PostCard from "../../components/PostCard";
import { IPost, ISub } from "../../interfaces";

const Sub = () => {
  const router = useRouter();
  const subName = router.query.sub;

  const { data: sub, error } = useSWR<ISub>(
    subName ? `/subs/${subName}` : null
  );
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
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {sub && (
        <Fragment>
          {/* Sub info & images */}
          <div>
            {/* Banner image*/}
            <div className="bg-blue-500">
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
              <div className="flex containe">
                <Image
                  src={sub.imageUrl}
                  alt="Sub"
                  className="rounded-full"
                  width={80}
                  height={80}
                />
                <div className="pt-2 pl-16">
                  <div className="flex item-center">
                    <h1 className="mb-1 text-2xl font-bold">{sub.title}</h1>
                    <p className="text-sm text-gray-600">/r/{sub.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Posts & Sidebar */}
          <div className="container flex pt-5">
            <div className="w-160">{postMarkup}</div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Sub;
