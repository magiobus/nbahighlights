//SEARCH PODCAST PAGE
/* eslint-disable @next/next/no-img-element */
import MainLayout from "@/components/layouts/MainLayout";
import clientPromise from "@/lib/mongodb";
import SearchForm from "@/components/search/SearchForm";

export default function VideoPage({ video }) {
  return (
    <MainLayout>
      <div className="content flex justify-center items-center w-full my-16">
        <div className="wrapper max-w-7xl w-full">
          <div className="connectioncontainer flex justify-center">
            <div className="text-center  w-1/2 ">
              <div className="container">
                <a
                  className="flex justify-center items-center
                  "
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="w-[240px] flex-shrink-0 mx-auto bg-black"
                    src={video.thumbnail}
                    alt=""
                  />
                  <p className="text-xl font-bold text-black m-2 hover:text-gray-600">
                    {" "}
                    {video.videoTitle}
                  </p>
                </a>
              </div>

              <div className="searchcontainer w-full flex justify-center items-center ">
                <div className="wrapper w-full w-10/12">
                  <SearchForm video={video} youtubeId={video.youtubeId} />
                </div>
              </div>

              <div className="summary my-8">
                <h3 className="mt-2 text-black text-4xl font-medium">
                  Summary
                </h3>
                <div className="summarymap">
                  {video.summary && (
                    <ul className="text-md text-gray-600 mt-2">
                      {video.summary && (
                        <ul className="text-md text-gray-600 mt-2">
                          {video.summary.map(
                            (bulletPoint, index) =>
                              bulletPoint.text && (
                                <li
                                  key={index}
                                  className=" list-disc list-inside text-gray-600 my-2"
                                >
                                  {bulletPoint.text}
                                </li>
                              )
                          )}
                        </ul>
                      )}
                    </ul>
                  )}
                </div>
              </div>
              {/* Insertion Start */}
              <div className="highlights my-8">
                <h3 className="mt-2 text-black text-4xl font-medium">
                  Highlights
                </h3>
                <div className="highlight-list">
                  {video.highlights && (
                    <ul className="text-md text-gray-600 mt-2">
                      {video.highlights.map((highlight, index) => (
                        <li
                          key={index}
                          className="text-blue-500 underline cursor-pointer my-2"
                          onClick={() =>
                            window.open(
                              `https://youtube.com/watch?v=${
                                video.youtubeId
                              }&t=${highlight.ts.toFixed(0) - 11}`,
                              "_blank"
                            )
                          }
                        >
                          {highlight.text}
                        </li>
                      ))}
                    </ul>
                  )}
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

  //get youtubeId from router context
  const youtubeId = params.youtubeId;

  try {
    //get video info from database
    const video = await db.collection("videos").findOne({
      youtubeId: youtubeId,
    });

    if (!video) {
      return {
        notFound: true,
      };
    }

    const videoParsed = JSON.parse(JSON.stringify(video));
    return {
      props: {
        video: videoParsed,
      },
      revalidate: 5,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

//STATIC PATHS
export async function getStaticPaths() {
  const client = await clientPromise;
  const db = client.db();

  const videosData = await db.collection("videos").find({}).toArray();

  const paths = videosData.map((video) => {
    return {
      params: {
        youtubeId: video.youtubeId,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}
