
const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
        <div className="w-12 h-12 border-4 border-t-primary rounded-full absolute top-0 left-0 animate-spin"></div>
      </div>
      <p className="ml-4 text-lg font-medium">Loading images...</p>
    </div>
  );
};

export default LoadingIndicator;
