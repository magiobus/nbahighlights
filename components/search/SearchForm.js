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
  placeholder = "Type your search",
  text = "",
  youtubeId = "",
}) => {
  const { data: session, status } = useSession();
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
  }, []);

  //showing toast in row type
  useEffect(() => {
    if (errors.query && type !== "col") {
      toast.error(errors.query.message);
    }
  }, [errors]);

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
    //redirect to search page with params
    setIsLoading(true);
    const { query } = data;
    //before sending to new location, we need to track how many searches the not logged in user has made, maybe we can use localstorage for this
    const canSearch = handleOutSearches();
    if (!canSearch) {
      //send to login page with nextauth redirect
      window.location.href = `/auth/signin?redirect=${window.location.origin}/search?query=${query}`;
      return;
    }

    if (youtubeId) {
      window.location.href = `/videos/${youtubeId}/search?query=${query}`;
      return;
    }

    //send to search page
    window.location.href = `/search?query=${query}`;
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
            <Link href="/">
              <a>
                <div className="logo mr-4 w-12"> 🏀</div>
              </a>
            </Link>
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
                  message: "Please enter a search term",
                },
                maxLength: {
                  value: 38,
                  message: "Please enter a search term less than 38 characters",
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
                    "Search"
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
