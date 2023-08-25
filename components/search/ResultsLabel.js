const ResultsLabel = ({ paginationData, query }) => {
  if (!paginationData || !paginationData || !query) return null;

  console.log("paginationData =>", paginationData);

  const {
    currentSegmentCount,
    transcriptionsCount,
    segmentsCount,
    pageSize,
    totalPages,
    page,
  } = paginationData;

  return (
    <>
      <div className="title">
        <p>
          <span className="font-bold">{segmentsCount} results</span> found{" "}
        </p>
        <p>
          for
          <span className="italic truncate"> &quot;{query}&quot; </span> in
          <span className="font-bold"> {transcriptionsCount} videos</span>
        </p>
      </div>

      <div className="title text-center text-xs mt-4 mb-2">
        <p>
          showing <span className="font-bold">{currentSegmentCount}</span>{" "}
          results
        </p>
        <p>
          page
          <span className="font-bold"> {page}</span> of
          <span className="font-bold"> {totalPages}</span>
        </p>
      </div>
    </>
  );
};

export default ResultsLabel;
