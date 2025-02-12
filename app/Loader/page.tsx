const Loader = () => {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="relative w-16 h-16">
          <div className="absolute w-full h-full border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  };
  
  export default Loader;
  