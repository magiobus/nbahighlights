import Head from "next/head";
import Footer from "@/components/common/Footer";
import Seo from "@/components/common/Seo";
import { useSession } from "next-auth/react";
import LoadingCircle from "@/components/common/LoadingCircle";
import NoAccessErrorPage from "@/components/errors/NoAccessErrorPage";
import SearchForm from "@/components/search/SearchForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SessionMenu from "@/components/common/SessionMenu";
import Link from "next/link";
import { Popover, Transition } from "@headlessui/react";
import { Toaster } from "react-hot-toast";

const VideoLayout = ({ title, description, children, podcast, ...rest }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const { query } = router.query;
    setQuery(query);
  }, [router]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* FIXED SEARCH BAR */}
      <Toaster position="bottom-center" />

      <div className="searchformwrapper w-full px-2 fixed top-0 bg-white shadow-md h-auto min-w-full flex justify-center items-center z-50  ">
        <div className="wrapper max-w-xs sm:max-w-2xl w-full">
          <SearchForm type="row" text={query} podcast={podcast} />
        </div>
        <div className="flex justify-end items-center   ">
          {/* HEADER DESKTOP RIGHT SECTION BUTTONS */}
          <div className="wrapper -mt-2 ml-4  ">
            <SessionMenu session={session} />
          </div>
        </div>
      </div>
      <Seo subtitle={title} description={description} />
      <div className="flex flex-col w-full " {...rest}>
        <div className="my-0 w-full ">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default VideoLayout;
