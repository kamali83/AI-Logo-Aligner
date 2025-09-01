
import React from 'react';

interface ResultDisplayProps {
    resultImage: string | null;
    error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ resultImage, error }) => {
    if (!resultImage && !error) {
        return null;
    }

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold text-center mb-4">Result</h2>
            <div className="bg-gray-800 p-4 rounded-lg shadow-inner w-full max-w-4xl mx-auto min-h-[200px] flex justify-center items-center">
                {error && (
                    <div className="text-center text-red-400">
                        <p className="font-semibold">An error occurred:</p>
                        <p>{error}</p>
                    </div>
                )}
                {resultImage && (
                    <div className="w-full">
                        <img src={resultImage} alt="AI aligned logo" className="rounded-md w-full h-auto object-contain" />
                         <div className="text-center mt-4">
                            <a 
                                href={resultImage} 
                                download="aligned-logo.png"
                                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
                            >
                                Download Image
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultDisplay;
