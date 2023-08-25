import Link from "next/link";
import format from "format-duration";
import GenericModal from "@/components/search/GenericModal";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import YoutubeIframe from "@/components/common/YoutubeIframe";
import toast from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import ShareButtons from "@/components/search/ShareButtons";

const ShowResults = ({
  data = [],
  query = "la busqueda",
  showVideoSearchButton = true,
}) => {
  //hooks
  const { data: session } = useSession();

  //states
  const [open, setOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [segment, setSegment] = useState(null);

  //functions

  const handleShowVideo = (item, segment) => {
    setVideo(item);
    setSegment(segment);
    setOpen(true);
  };

  return (
    <div className="resultscontainer my-4 w-full space-y-3 ">
      {/* MODAL */}
      <div className="modalwrapper w-full">
        <GenericModal open={open} setOpen={setOpen}>
          <Dialog.Panel className="relative my-8 min-h-full w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 px-4 pt-5 pb-4 text-left shadow-xl transition-all">
            <div className="absolute top-0 right-0 mr-4 flex h-12 items-center">
              <button
                type="button"
                className="rounded-md bg-white text-selectedtxt focus:outline-none focus:ring-2 focus:ring-buttonbg focus:ring-offset-2"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5 w-full">
              <div className="flex flex-col items-center justify-between">
                <div className="videohere h-full w-full md:min-h-[480px]">
                  {/* //height should be different for tablet and desktop */}
                  <YoutubeIframe
                    youtubeId={video?.youtubeId}
                    segment={segment}
                  />
                </div>

                <div className="title mt-3 flex flex-col items-center justify-center">
                  <h3 className="text-center text-xs font-medium italic text-gray-900">
                    &quot;
                    {segment?.text}
                    &quot;
                  </h3>
                  <p className="mt-1">
                    <strong> Minute:</strong> {format(segment?.start * 1000)}
                  </p>

                  <p className="mt-1 text-left text-xs font-medium italic">
                    Date: {video?.upload_date}
                  </p>
                  {/* //should only appear if the plan is pro */}
                  <div className="sharebuttons space-x-2">
                    <ShareButtons
                      shareUrl={`https://www.youtube.com/watch?v=${
                        video?.youtubeId
                      }&t=${segment?.start?.toFixed(
                        0
                      )}s found on nbahighlights.fun by @magiobus`}
                      sharedMessage={`"${segment?.text}"`}
                      centered={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </GenericModal>
      </div>
      {data?.length > 0 ? (
        data.map((item, index) => (
          <div
            className="wrapper item w-full border-2 border-black  px-2"
            key={index}
          >
            <div className="resultitem__title pt-2 text-left  text-sm">
              <strong>Video:</strong>{" "}
              <a href={item.url} className="italic underline">
                {item.filename}
              </a>
            </div>
            <div className="date">
              <p className="mt-1 text-left text-xs">
                <strong>Date:</strong> {item.upload_date}
              </p>
            </div>

            <div className="segments my-3">
              <h3 className="segmentstitle text-left">
                {item.segments.length} results
              </h3>
              <div className="segments space-y-4">
                {item.segments.map((segment, index) => (
                  <div
                    className="segment space-x-2 text-left text-xs"
                    key={index}
                  >
                    <p className="italic">{segment.text}</p>
                    <button
                      className=" mt-2 rounded-md bg-buttonbg px-2 py-1 text-sm text-buttontxt"
                      onClick={() => handleShowVideo(item, segment)}
                    >
                      Watch Minute:{" "}
                      {format(segment.start * 1000, {
                        format: "mm:ss",
                      })}{" "}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="notfound flex w-full flex-col items-center justify-center pt-20 text-center  ">
          <div className="label flex flex-col items-center justify-center text-center ">
            <p className="">No results found for</p>
            <p className="">
              <span className="truncate italic "> &quot;{query}&quot; </span>
            </p>
          </div>
          <Link href="/">
            <a className="my-6 underline">Back to home</a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ShowResults;
