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

const VideoSearchPage = ({ query, videoData }) => {
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
    if (query) {
      getQueryResults({
        query: query,
        page: page,
        limit: pageSize,
        sort: sortBy,
        order: orderBy,
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

  const getQueryResults = async ({ query, page, limit, sort, order }) => {
    setIsLoading(true);
    try {
      cleanData();
      //edit area
      const { data } = await axios.get(
        `/api/videos/${videoData.youtubeId}/search/?query=${query}&page=${page}&limit=${limit}&sort=${sort}&order=${order}`
      );
      const { resultsCount, result, matchesCount } = data;

      setResults(result);
      setPaginationData({
        transcriptionsCount: resultsCount,
        segmentsCount: matchesCount,
        pageSize: result.length,
        totalPages: Math.ceil(resultsCount / pageSize),
        page,
      });
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  return (
    <VideoLayout title={videoData.videoTitle} video={videoData}>
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
  const { youtubeId } = context.params;
  const { query } = context.query;

  //get video info from db
  const client = await clientPromise;
  const db = await client.db();

  const video = await db.collection("videos").findOne({
    youtubeId,
  });

  if (!video) {
    return {
      notFound: true,
    };
  }

  const videoParsed = JSON.parse(JSON.stringify(video));

  return {
    props: {
      query,
      videoData: videoParsed,
    },
  };
}
export default VideoSearchPage;
