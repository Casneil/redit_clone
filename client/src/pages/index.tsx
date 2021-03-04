import { Fragment } from "react";
import useSWR from "swr";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import PostCard from "../components/PostCard";
//Interfaces
import { IPost, ISub } from "../interfaces";

const Home = () => {
  const { data: posts } = useSWR("/posts");
  const { data: topSubs } = useSWR("/misc/top-subs");

  return (
    <Fragment>
      <Head>
        <title>readit: the frontpage of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feeds */}
        <div className="w-160">
          {posts?.map((post: IPost) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* Sidebar */}
        <div className="ml-6 w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-center text-lg-font-semibold">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub: ISub) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <div className="mr-2 overflow-hidden rounded-full cursor-pointer">
                    <Link href={`/r/${sub.name}`}>
                      <Image
                        src={sub.imageUrl}
                        alt="Sub"
                        width={(6 * 16) / 4}
                        height={(6 * 16) / 4}
                      />
                    </Link>
                  </div>
                  <Link href={`/r/${sub.name}`}>
                    <a className="font-bold hover:cursor-pointer">
                      /r/{sub.name}
                    </a>
                  </Link>
                  <p className="ml-auto font-md">{sub.postCount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

// Server side rendering
// export const getStaticProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await Axios.get("/posts");
//     return { props: { posts: res.data } };
//   } catch (error) {
//     return { props: { error: "Somethign went wrong" } };
//   }
// };

export default Home;
