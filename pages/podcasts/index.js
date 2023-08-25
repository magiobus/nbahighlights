/* eslint-disable @next/next/no-img-element */
import MainLayout from "@/components/layouts/MainLayout";
import clientPromise from "@/lib/mongodb";
import PodcastList from "@/components/lists/PodcastsList";

//static regeneration...
export async function getStaticProps() {
  //get data from database here...
  const client = await clientPromise;
  const db = client.db();

  const podcasts = await db.collection("podcastsinfo").find({}).toArray();
  const podcastsParsed = JSON.parse(JSON.stringify(podcasts));

  return {
    props: {
      podcasts: podcastsParsed,
    },
    revalidate: 5,
  };
}

export default function PodcastsPage({ podcasts }) {
  return (
    <MainLayout>
      <div className="content flex justify-center items-center w-full my-16">
        <div className="wrapper max-w-7xl">
          <div className="connectioncontainer">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                NBAHighlights.fun
              </h1>
            </div>
          </div>
          <div className="container my-8">
            {/* <PodcastList podcasts={podcasts} /> */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
