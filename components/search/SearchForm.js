/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Input, SubmitButton } from "@/components/forms/fields";
import { useForm } from "react-hook-form";
import classNames from "@/utils/classNames";
import { SearchIcon } from "@heroicons/react/outline";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const SearchForm = ({
  type = "col",
  placeholder = "Type your search here...",
  podcast,
  text = "",
}) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (text) {
      setValue("query", text);
    }
  }, [text]);

  //check if user can search
  const handleOutSearches = () => {
    //LOGGED PROCESS
    if (session && session.user) {
      return true;
    } else {
      return false;
    }
  };

  const onSubmit = async (data) => {
    // //redirect to search page with params
    setIsLoading(true);
    const { query } = data;
    const canSearch = handleOutSearches();
    if (!canSearch) {
      //send to login page with nextauth redirect
      console.info("redirecting...");
      window.location.href = `/auth/signin?redirect=${window.location.origin}/podcasts/${podcast.channel_tag}/search?query=${query}`;
      return;
    }
    // //send to search page
    window.location.href = `/podcasts/${podcast.channel_tag}/search?query=${query}`;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames("w-full  ", type === "col" ? "" : "px-0 ")}
    >
      <div
        className={classNames(
          type === "col"
            ? "flex-col items-center justify-center px-4"
            : "my-4 flex-row justify-between px-0",
          "flex w-full"
        )}
      >
        {type !== "col" && (
          <div className="flex items-center justify-center">
            {podcast && podcast.channelProfileUrl && (
              <Link href="/">
                <a>
                  <div className="logo mr-4 w-12">
                    <Image
                      src={podcast.channelProfileUrl}
                      width={470}
                      height={470}
                      alt="podcast_logo"
                      className="rounded-full"
                    />
                  </div>
                </a>
              </Link>
            )}
          </div>
        )}
        <div
          className={classNames(
            type === "col" ? "my-4 w-full" : "my-0 mr-2 p-0 ",
            "relative w-full"
          )}
        >
          {type !== "col" && (
            <button
              className=" absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 pb-2 "
              type="submit"
            >
              <SearchIcon className="h-6 w-6  bg-white text-gray-800" />
            </button>
          )}
          <Input
            placeholder={placeholder}
            name="query"
            type="text"
            register={{
              ...register("query", {
                required: {
                  value: true,
                  message: "Por favor ingresa una busqueda",
                },
                maxLength: {
                  value: 38,
                  message: "No puede contener más de 38 caracteres",
                },
              }),
            }}
            errorMessage={type === "col" ? errors?.query?.message : ""}
          />
        </div>
        <div
          className={classNames(
            "mt-0 flex w-full items-center justify-center ",
            type === "col" ? "mt-4" : "mt-0 hidden w-12"
          )}
        >
          <div
            className={classNames(
              "w-full",
              type === "col" ? "mt-4" : "mt-0 w-12  "
            )}
          >
            <SubmitButton
              isLoading={isLoading}
              label={
                <div className="flex items-center justify-center">
                  {type === "col" ? (
                    "Search on " + podcast.youtubeChannelName
                  ) : (
                    <SearchIcon className="h-6 w-6" />
                  )}
                </div>
              }
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
