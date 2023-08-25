import LoadingCircle from "@/components/common/LoadingCircle";

const SubmitButton = ({ isLoading = false, label = "", ...rest }) => {
  return (
    <button
      type="submit"
      className="hover:bg-happy-yellow-600 inline-flex w-full justify-center rounded-md border border-transparent bg-buttonbg px-4 py-2  text-sm font-medium text-buttontxt focus:outline-none focus-visible:ring-2 focus-visible:ring-buttonbg focus-visible:ring-offset-2 lg:text-base"
      disabled={isLoading}
    >
      <div className="loadingcontainer flex w-full items-center justify-center font-bold">
        {isLoading ? <LoadingCircle color="#ffffff" /> : <span>{label}</span>}
      </div>
    </button>
  );
};

export default SubmitButton;
