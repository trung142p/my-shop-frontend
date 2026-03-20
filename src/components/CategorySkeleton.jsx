import React from 'react';

function CategorySkeleton() {
    return (
        <div className="flex flex-col items-center animate-pulse">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-200"></div>
            <div className="mt-3 h-3 w-16 bg-gray-200 rounded"></div>
        </div>
    );
}

export default CategorySkeleton;