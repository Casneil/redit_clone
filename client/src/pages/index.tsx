import { useEffect, useState } from "react";

import Head from "next/head";
import Axios from "axios";
import PostCard from "../components/PostCard";

//Interfaces
import { IPosts } from "../interfaces";

const Home = () => {
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
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
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
