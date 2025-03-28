export default function Loading() {
  return (
    <div className="bg-white min-h-screen p-4 w-full">
      <div className="text-center text-gray-500 mb-4 text-sm">Yesterday</div>
      
      <div className="space-y-4">
        {/* Left Message Skeleton */}
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="flex-grow">
            <div className="bg-gray-200 w-3/4 h-12 rounded-tr-md rounded-tl-md rounded-br-sm rounded-bl-md animate-pulse mb-2"></div>
            <div className="bg-gray-200 w-1/2 h-12 rounded-tr-md rounded-tl-md rounded-br-sm rounded-bl-md animate-pulse"></div>
          </div>
        </div>
        
        {/* Right Message Skeleton */}
        <div className="flex justify-end items-start space-x-2">
          <div className="flex-grow text-right">
            <div className="bg-red-200 w-3/4 h-12 rounded-tr-md rounded-tl-md rounded-br-sm rounded-bl-md inline-block animate-pulse mb-2 ml-auto"></div>
            <div className="bg-red-200 w-1/2 h-12 rounded-tr-md rounded-tl-md rounded-br-sm rounded-bl-md inline-block animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
