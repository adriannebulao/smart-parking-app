function PaginationControls({ onPrev, onNext, hasPrev, hasNext, loading }) {
  return (
    <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-2 mt-4">
      <button
        onClick={onPrev}
        disabled={!hasPrev || loading}
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <button
        onClick={onNext}
        disabled={!hasNext || loading}
        className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default PaginationControls;
