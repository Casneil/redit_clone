import { Fragment } from "react";
import useSWR from "swr";
import Head from "next/head";

import PostCard from "../components/PostCard";
//Interfaces
import { IPost } from "../interfaces";

const Home = () => {
  const { data: posts } = useSWR("/posts");

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
