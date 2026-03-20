import React from "react";

function ProductSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="w-full h-60 bg-gray-200"></div>
            <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
            </div>
        </div>
    );
}

export default ProductSkeleton;