import loadingphrases from "@/data/loadingphrases.json";
import { useEffect, useState } from "react";

const SearchLoading = ({ color = "currentColor", ...rest }) => {
  //get random phrase
  const [randomPhrase, setRandomPhrase] = useState("");

  useEffect(() => {
    const getRandomPhrase = () => {
      const randomIndex = Math.floor(Math.random() * loadingphrases.length);
      setRandomPhrase(loadingphrases[randomIndex]);
    };

    getRandomPhrase();

    return () => {
      setRandomPhrase("");
    };
  }, []);

  return (
    <div className="container" {...rest}>
      <div className="flex items-center justify-center">
        <svg
          className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke={color}
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill={color}
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <p className="pt-3 text-center text-base text-black ">
        {randomPhrase}...
      </p>
    </div>
  );
};

export default SearchLoading;
