/* eslint-disable react-hooks/exhaustive-deps */
import VideoLayout from "@/components/layouts/VideoLayout";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { SearchIcon } from "@heroicons/react/outline";
import { Input } from "@/components/forms/fields";
import SearchLoading from "@/components/search/SearchLoading";
import ShowResults from "@/components/search/ShowResults";
import ResultsLabel from "@/components/search/ResultsLabel";
import Pagination from "@/components/common/Pagination";
import { useSession } from "next-auth/react";
import Link from "next/link";
import clientPromise from "@/lib/mongodb";

const VideoSearchPage = ({ query, podcastData }) => {
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setResults] = useState([]);
  const [queryValue, setQueryValue] = useState(null);
  const [page, setPage] = useState(1);
  const [paginationData, setPaginationData] = useState({});

  const pageSize = 10;
  const sortBy = "upload_date";
  const orderBy = "desc";

  useEffect(() => {
    setPage(1);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const queryWatch = watch("query");

  //get info from query
  useEffect(() => {
    if (podcastData) {
      getQueryResults({
        query: query,
        channelTag: podcastData.channel_tag,
      });
    }
  }, [query, page]);

  //showing toast in row type
  useEffect(() => {
    if (errors.query) {
      toast.error(errors.query.message);
    }
  }, [errors]);

  const cleanData = () => {
    setResults([]);
  };

  const getQueryResults = async ({ query, channelTag }) => {
    setIsLoading(true);
    try {
      cleanData();
      //edit area
      const { data } = await axios.post(`/api/search/${channelTag}`, {
        query: query,
        page: page,
        limit: pageSize,
        sort: sortBy,
        order: orderBy,
      });

      const { results, totalPages, transcriptionsCount, segmentsCount } = data;
      setResults(results);

      //count the total number of segments
      const currentSegmentCount = results.reduce((acc, curr) => {
        return acc + curr.segments.length;
      }, 0);

      setPaginationData({
        page,
        pageSize: results.length,
        totalPages,
        totalCount: transcriptionsCount,
        transcriptionsCount,
        segmentsCount,
        currentSegmentCount,
      });
    } catch (error) {
      console.error("error =>", error);
      toast.error("Error searching on nbahighlights.fun");
    }
    setIsLoading(false);
  };

  return (
    <VideoLayout
      title={podcastData.channel_tag}
      description={`Search anything on @${podcastData.channel_tag} podcast. Results brought to you by nbahighligts.fun`}
      podcast={podcastData}
    >
      <div className="content my-8 flex w-full items-center justify-center">
        <div
          id="videocontainer"
          className="wrapper flex  w-full flex-col items-center justify-center text-center"
        >
          <div className="buttons px-2 py-12">
            <div className="title">
              <div className="videosearchform my-2 text-black">
                {isLoading ? (
                  <div className="loadingcontainer my-12">
                    <SearchLoading color="#000" className="text-lg" />
                  </div>
                ) : session ? (
                  <>
                    <div className="flex flex-col items-center justify-center text-center  ">
                      {searchResults && searchResults.length > 0 && (
                        <>
                          <div className="wrapperresults mt-12">
                            <ResultsLabel
                              paginationData={paginationData}
                              query={query}
                            />
                          </div>
                        </>
                      )}
                      <div className="resultsswrapper my-4 md:px-4">
                        <ShowResults data={searchResults} query={query} />
                      </div>
                      {searchResults && searchResults.length > 0 && (
                        <Pagination
                          paginationData={paginationData}
                          setPage={setPage}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="my-12">
                    Please{" "}
                    <Link href="/auth/signin">
                      <a className="text-blue-500">sign in</a>
                    </Link>{" "}
                    to search
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </VideoLayout>
  );
};

export async function getServerSideProps(context) {
  const { channelTag } = context.params;
  const { query } = context.query;

  //get podcast info from db
  const client = await clientPromise;
  const db = await client.db();

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
      channelTag,
      query,
      podcastData: podcastParsed,
    },
  };
}

export default VideoSearchPage;
