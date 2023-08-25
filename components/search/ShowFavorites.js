import Link from "next/link";
import format from "format-duration";
import GenericModal from "@/components/search/GenericModal";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { XIcon, StarIcon } from "@heroicons/react/outline";
import { StarIcon as StarIconFilled } from "@heroicons/react/solid";
import YoutubeIframe from "@/components/common/YoutubeIframe";
import toast from "react-hot-toast";
import axios from "axios";

const ShowFavorites = ({
  favorites = [],
  showVideoSearchButton = true,
  session,
}) => {
  //states
  const [open, setOpen] = useState(false);
  const [favorite, setFavorite] = useState(null);

  //functions
  const isSegmentFavorite = (youtubeId, segmentText) => {
    const isFavorite = favorites.find((favorite) => {
      return (
        favorite.segment.text === segmentText &&
        favorite.youtubeId === youtubeId
      );
    });

    return isFavorite ? true : false;
  };
  const handleShowVideo = (favorite, segment) => {
    setFavorite(favorite);
    setOpen(true);
  };

  const deleteFavorite = async (favorite) => {
    try {
      await axios.delete(`/api/users/favorites`, {
        data: {
          youtubeId: favorite.youtubeId,
          segmentText: favorite.segment.text,
        },
      });
      toast.success("Video eliminado de favoritos, reecargando...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("error deleting favorite", error);
      toast.error("Error eliminando video de favoritos");
    }
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
                    youtubeId={favorite?.youtubeId}
                    segment={favorite?.segment}
                  />
                </div>

                <div className="title mt-3 flex flex-col items-center justify-center">
                  <h3 className="text-center text-xs font-medium italic text-gray-900">
                    &quot;
                    {favorite?.segmentText}
                    &quot;
                  </h3>
                  <p className="mt-1">
                    Ver Minuto: {format(favorite?.segment?.start * 1000)}
                  </p>
                  <p className="mt-1 text-left text-xs font-normal italic">
                    Fecha: {favorite?.upload_date}
                  </p>
                  {/* //should only appear if the plan is pro */}
                  {session && (
                    <button
                      className="mt-4 flex rounded-md bg-buttonbg px-2 py-1 text-buttontxt"
                      onClick={() => deleteFavorite(favorite)}
                    >
                      {favorites && favorites.length > 0 && (
                        <>
                          {isSegmentFavorite(
                            favorite?.youtubeId,
                            favorite?.segmentText
                          ) ? (
                            <div className="removefromfavorites flex">
                              Borrar de favoritos &nbsp;
                              <span className="h-6 w-6 text-yellow-400">
                                <StarIconFilled />
                              </span>
                            </div>
                          ) : (
                            <div className="addtofavorites flex">
                              Añadir a favoritos &nbsp;
                              <span className="h-6 w-6 text-yellow-400">
                                <StarIcon />
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  )}
                  {session && showVideoSearchButton && (
                    <Link href={`/search/${favorite?.youtubeId}`}>
                      <a className="mt-4 rounded-md bg-buttonbg px-2 py-1 text-buttontxt">
                        Buscar sólo en este video{" "}
                      </a>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </GenericModal>
      </div>
      {favorites?.length > 0 ? (
        favorites.map((favorite) => (
          <div
            className="wrapper item w-full border-2 border-black  px-2"
            key={favorite._id}
          >
            <div className="resultitem__title pt-2 text-left  text-sm">
              Video:{" "}
              <Link href={`/search/${favorite?.youtubeId}`}>
                <a className="italic underline">{favorite?.videoTitle}</a>
              </Link>
            </div>

            <div className="segments my-3">
              <div className="segments space-y-4">
                <div className="segment text-left text-xs">
                  <p className="italic">{favorite.segmentText}</p>
                  <button
                    className=" mt-2 rounded-md bg-buttonbg px-2 py-1 text-sm text-buttontxt"
                    onClick={() => handleShowVideo(favorite)}
                  >
                    Ver Minuto:{" "}
                    {format(favorite?.segment?.start * 1000, {
                      format: "mm:ss",
                    })}{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="notfound flex w-full flex-col items-center justify-center pt-20 text-center  ">
          <div className="label flex flex-col items-center justify-center text-center ">
            <p className="">No hay favoritos 😢</p>
            <p className="mt-2 text-xs italic">
              Puedes añadir favoritos desde la página de resultados
            </p>

            <Link href="/">
              <a className="my-4 underline">Ir a la página de inicio</a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowFavorites;
