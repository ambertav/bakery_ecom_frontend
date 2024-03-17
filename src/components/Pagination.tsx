interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const generatePageButtons = (): (number | string)[] => {
    const adjacentPages = 2; // adjacent page buttons on either side of current page
    const pagesToShow = 5; // total page buttons to show, including ellipses

    // determining the range of numbers to display
    let startPage = Math.max(1, currentPage - adjacentPages);
    let endPage = Math.min(totalPages, currentPage + adjacentPages);

    // adjusting the range if total pages is greater than range
    if (endPage - startPage + 1 < pagesToShow) {

      // if current page is in first half of total pages...
      if (currentPage < totalPages / 2)
        // add more pages towards end
        endPage = Math.min(totalPages, startPage + pagesToShow - 1);
        
      // else, where current page is in second page of total pages
      // include more pages towards beginning
      else startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    // generate array of page buttons
    const pageButtons: (number | string)[] = Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );

    // add ellipses if neccesary
    if (startPage > 1) pageButtons.unshift(1, '...');
    if (endPage < totalPages) pageButtons.push('...', totalPages);

    return pageButtons;
  };

  const changePage = (page: number) => {
    onPageChange(page);
  };

  return (
    <div>
      {currentPage !== 1 && (
        <button onClick={() => changePage(currentPage - 1)}>Previous</button>
      )}
      {generatePageButtons().map((page, index) => (
        <div key={index}>
          {typeof page === 'number' ? (
            <button
              key={page}
              onClick={() => changePage(page as number)}
              disabled={currentPage === page}
            >
              {page}
            </button>
          ) : (
            <p>{page}</p>
          )}
        </div>
      ))}
      {currentPage !== totalPages && (
        <button onClick={() => changePage(currentPage + 1)}>Next</button>
      )}
    </div>
  );
}
