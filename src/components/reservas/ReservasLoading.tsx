
export const ReservasLoading = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="relative">
        <div className="spinner-cyber animate-spin rounded-full h-16 w-16 border-4"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
