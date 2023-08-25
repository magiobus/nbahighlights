import AdminLayout from "@/components/layouts/AdminLayout";
import Link from "next/link";
import LoadingCircle from "@/components/common/LoadingCircle";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Select } from "@/components/forms/fields";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { CheckCircleIcon } from "@heroicons/react/outline";

const AdminUsersAddPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const videoUrl = data.videoUrl;

      //send videoUrl to node.js to download only the audio of the video
      const response = await axios.post(`/api/admin/videos/transcribe`, {
        url: videoUrl,
      });

      setSubmitted(true);
    } catch (error) {
      console.error("error downloading video =>", error);
      setSubmitted(false);
      const textError = error.response.data || "Error downloading video";
      toast.error(textError);
    }
    setIsLoading(false);
  };

  return (
    <AdminLayout title="Add a Video">
      <div className="w-full flex justify-center">
        <div className="relative bg-white w-full ">
          <div>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white py-6 space-y-8 ">
                <div className="flex flex-row px-8 w-full justify-between items-center  ">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Add a Video
                  </h3>
                  <Link href="/admin/videos" passHref legacyBehavior>
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-buttonbg hover:bg-buttonbg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-inputfocus"
                    >
                      Back
                    </button>
                  </Link>
                </div>
                <div className="formcontainer w-full flex-col items-start justify-center px-8 ">
                  <div className="wrapper mx-auto">
                    <div className="inputfield lg:w-full mb-4">
                      {/* FORM */}
                      <form onSubmit={handleSubmit(onSubmit)}>
                        {!isLoading && !submitted && (
                          <>
                            <p className="mb-2">
                              Enter a YouTube link to be processed by the
                              nbaSearch AI 🏀
                            </p>
                            <div className="mb-4">
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="videoUrl"
                              >
                                YouTube Link
                              </label>
                              <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="videoUrl"
                                type="text"
                                {...register("videoUrl", { required: true })}
                              />
                              {errors.videoUrl && (
                                <p className="text-red-500 text-xs italic">
                                  Please enter a YouTube link.
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                                disabled={isLoading}
                              >
                                Process
                              </button>
                            </div>
                          </>
                        )}
                      </form>

                      {/* //processing video */}
                      {isLoading && !submitted && (
                        <div className="w-full flex justify-center items-center">
                          <div className="py-24 flex ">
                            <LoadingCircle color="#000000" />
                            <p>Downloading video...</p>
                            <p>This process can take a few minutes</p>
                          </div>
                        </div>
                      )}

                      {/* //video processed */}
                      {!isLoading && submitted && (
                        <div className="w-full flex flex-col justify-center items-center">
                          <div className="pt-24 flex flex-col">
                            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-2" />
                            <p className="">Video successfully downloaded</p>
                          </div>
                          <div className=" flex flex-col">
                            <p className="">
                              Video is processing in the background, it will be
                              available in a few minutes.
                            </p>
                            <div className="buttonwrapper w-full flex justify-center items-center my-4">
                              <Link
                                href="/admin/videos"
                                passHref
                                legacyBehavior
                              >
                                <button
                                  type="button"
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-buttonbg hover:bg-buttonbg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-inputfocus"
                                >
                                  Back to videos list
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersAddPage;
