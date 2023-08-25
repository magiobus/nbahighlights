import MainLayout from "@/components/layouts/MainLayout";
import PodcastList from "@/components/lists/PodcastsList";
import clientPromise from "@/lib/mongodb";
import Hero from "@/components/common/Hero";
export default function Home({ podcasts }) {
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
            {/* <PodcastList podcasts={podcasts} /> */}
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

  const podcasts = await db.collection("podcastsinfo").find({}).toArray();
  const podcastsParsed = JSON.parse(JSON.stringify(podcasts));

  return {
    props: {
      podcasts: podcastsParsed,
    },
    revalidate: 5,
  };
}
