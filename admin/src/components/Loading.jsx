import React from 'react';

const Loading = ({ fullScreen = false, message = "Loading..." }) => {
    const content = (
        <div className='flex flex-col items-center justify-center gap-4'>
            <div className='relative flex items-center justify-center'>
                {/* Outer glowing pulsing ring */}
                <div className='w-14 h-14 rounded-full border-4 border-indigo-100 animate-pulse'></div>
                {/* Inner rotating gradient spinner */}
                <div className='absolute w-14 h-14 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin'></div>
                {/* Center dot */}
                <div className='absolute w-3 h-3 bg-primary rounded-full'></div>
            </div>
            {message && (
                <p className='text-sm sm:text-base font-medium text-gray-600 tracking-wide animate-pulse'>
                    {message}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className='fixed inset-0 z-50 bg-white/80 backdrop-blur-xs flex items-center justify-center'>
                {content}
            </div>
        );
    }

    return (
        <div className='w-full min-h-[60vh] flex items-center justify-center'>
            {content}
        </div>
    );
};

export default Loading;
