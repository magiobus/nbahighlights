/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
const PodcastList = ({ podcasts }) => {
  return (
    <div className="listpodcasts my-4">
      <div className="container flex justify-center items-center">
        <p className="mt-6 mx-0 px-0 text-xl font-bold text-gray-600">
          Choose a podcast to search:
        </p>
      </div>
      <ul className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {podcasts &&
          podcasts.length > 0 &&
          podcasts.map((podcast, index) => (
            <Link href={`/podcasts/${podcast.channel_tag}`} key={index}>
              <a>
                <li
                  key={index}
                  className="cursor-pointer col-span-1 flex flex-col text-center bg-white hover:bg-gray-100 rounded-lg shadow divide-y divide-gray-200"
                >
                  <div className="flex-1 flex flex-col p-8">
                    <img
                      className="md:w-32 md:h-32 flex-shrink-0 mx-auto bg-black rounded-full"
                      src={podcast.channelProfileUrl}
                      alt=""
                    />
                    <h3 className="mt-6 text-black text-sm font-medium">
                      {podcast.youtubeChannelName}
                    </h3>
                    <dl className="mt-1 flex-grow flex flex-col justify-between">
                      <dt className="sr-only">{podcast.name}</dt>
                      <dd className="text-gray-500 text-sm">{podcast.host}</dd>
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

export default PodcastList;
