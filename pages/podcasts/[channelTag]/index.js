//SEARCH PODCAST PAGE
/* eslint-disable @next/next/no-img-element */
import MainLayout from "@/components/layouts/MainLayout";
import clientPromise from "@/lib/mongodb";
import SearchForm from "@/components/search/SearchForm";

export default function PodcastsPage({ podcast }) {
  return (
    <MainLayout
      title={podcast.youtubeChannelName}
      description={`Search anything on ${podcast.youtubeChannelName} podcast. Hosted by ${podcast.host}. Results Brought to you by nbahighlights.fun`}
    >
      <div className="content flex justify-center items-center w-full my-16">
        <div className="wrapper max-w-7xl w-full">
          <div className="connectioncontainer">
            <div className="text-center">
              <div className="container flex flex-col items-center">
                <img
                  className="md:w-32 md:h-32 flex-shrink-0 mx-auto bg-black rounded-full"
                  src={podcast.channelProfileUrl}
                  alt=""
                />
                <div className="inner">
                  <p className=" text-md font-bold text-gray-600 mt-2">
                    You are searching in:
                  </p>
                  <p className=" text-2xl font-bold text-black mb-2">
                    {podcast.youtubeChannelName}
                  </p>
                </div>
              </div>
              <div className="searchcontainer w-full flex justify-center items-center ">
                <div className="wrapper w-full md:w-1/2">
                  <SearchForm podcast={podcast} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

//static regeneration...
export async function getStaticProps({ params }) {
  //get data from database here...
  const client = await clientPromise;
  const db = client.db();

  //get channeltag from router context
  const channelTag = params.channelTag;

  try {
    //get podcast info from database
    const podcast = await db.collection("podcastsinfo").findOne({
      channel_tag: channelTag,
    });

    if (!podcast) {
      return {
        notFound: true,
      };
    }

    const podcastParsed = JSON.parse(JSON.stringify(podcast));
    return {
      props: {
        podcast: podcastParsed,
      },
      revalidate: 5,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      podcasts: podcastsParsed,
    },
    revalidate: 5,
  };
}
//STATIC PATHS
export async function getStaticPaths() {
  const client = await clientPromise;
  const db = client.db();

  const podcastsData = await db.collection("podcastsinfo").find({}).toArray();

  const paths = podcastsData.map((podcast) => {
    return {
      params: {
        channelTag: podcast.channel_tag,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}
