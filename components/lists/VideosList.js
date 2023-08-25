/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
const VideosList = ({ videos }) => {
  return (
    <div className="listvideos my-4">
      <div className="container flex justify-center items-center">
        <p className="mt-6 mx-0 px-0 text-xl font-bold text-gray-600">
          Choose a video to see info:
        </p>
      </div>
      <ul className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {videos &&
          videos.length > 0 &&
          videos.map((video, index) => (
            <Link href={`/videos/${video.youtubeId}`} key={index}>
              <a>
                <li
                  key={index}
                  className="cursor-pointer col-span-1 flex flex-col text-center bg-white hover:bg-gray-100 shadow divide-y divide-gray-200"
                >
                  <div className="flex-1 flex flex-col">
                    <img
                      className=" flex-shrink-0  w-full" // Changed the height to make the thumbnail a rectangle
                      src={video.thumbnail}
                      alt=""
                    />
                    <h3 className="mt-2 text-black text-sm font-medium">
                      {video.videoTitle}
                    </h3>
                    <dl className="mt-1 flex-grow flex flex-col justify-between">
                      <dt className="sr-only">{video.name}</dt>
                    </dl>
                  </div>
                </li>
              </a>
            </Link>
          ))}
      </ul>
    </div>
  );
};

export default VideosList;
