import MainLayout from "@/components/layouts/MainLayout";
import VideosList from "@/components/lists/VideosList"; // Changed from PodcastList to VideoList
import clientPromise from "@/lib/mongodb";
import Hero from "@/components/common/Hero";
import Link from "next/link"; // Added Link from next.js for navigation

export default function Home({ videos }) {
  // Changed from podcasts to videos
  return (
    <MainLayout>
      <div className="content flex justify-center items-center w-full my-16">
        <div className="wrapper max-w-7xl">
          <div className="connectioncontainer">
            <div className="text-center">
              <Hero>
                {/* <p className="mt-6 text-xl font-bold text-gray-600">
                  Search every word spoken across top youtube podcasts
                </p>
                <p className=" text-xl text-gray-600">
                  Find the exact clip you&apos;re re looking for 🎬
                </p> */}
              </Hero>
            </div>
            <VideosList videos={videos} />{" "}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

//static regeneration...
export async function getStaticProps() {
  //get data from database here...
  const client = await clientPromise;
  const db = client.db();

  const videos = await db
    .collection("videos")
    .find({ status: "succeeded" })
    .toArray(); // Query to get videos with status as succeeded
  const videosParsed = JSON.parse(JSON.stringify(videos)); // Changed from podcasts to videos

  return {
    props: {
      videos: videosParsed, // Changed from podcasts to videos
    },
    revalidate: 5,
  };
}
