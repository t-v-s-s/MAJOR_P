import React from "react";

export default function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg"></div>

            <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-2 h-3 bg-gray-200 rounded w-1/2"></div>

            <div className="mt-3 flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
        </div>
    );
}