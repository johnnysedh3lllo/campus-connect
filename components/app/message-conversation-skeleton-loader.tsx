import React from 'react';

const MessageConversationSkeletonLoader = () => {
    return (
        <div className="flex h-16 w-full items-center justify-between px-4 py-2 space-x-3">
            {/* Profile/Avatar Skeleton */}
            <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
            </div>

            {/* Content Skeleton */}
            <div className="flex-grow flex flex-col justify-center space-y-2">
                <div className="h-3 bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4 animate-pulse"></div>
            </div>

            {/* Action/Icon Skeleton */}
            <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-gray-700 rounded-full animate-pulse"></div>
            </div>
        </div>
    );
};

export default MessageConversationSkeletonLoader;