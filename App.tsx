
import React, { useState, useCallback } from 'react';
import { UploadedImage } from './types';
import { alignImages } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Spinner from './components/Spinner';

const App: React.FC = () => {
    const [companyNameImage, setCompanyNameImage] = useState<UploadedImage | null>(null);
    const [logoImage, setLogoImage] = useState<UploadedImage | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleAlign = useCallback(async () => {
        if (!companyNameImage || !logoImage) {
            setError('Please upload both images before aligning.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResultImage(null);

        try {
            const alignedImage = await alignImages(companyNameImage, logoImage);
            setResultImage(alignedImage);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [companyNameImage, logoImage]);

    return (
        <div className="min-h-full bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                        AI Logo Aligner
                    </h1>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Upload a source image with your company name and a second image with your logo. Our AI will seamlessly combine them.
                    </p>
                </header>

                <main>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <ImageUploader
                            id="company-name-image"
                            title="1. Company Name Image"
                            description="Upload the base image containing the text."
                            image={companyNameImage}
                            onImageChange={setCompanyNameImage}
                        />
                        <ImageUploader
                            id="logo-image"
                            title="2. Logo Image"
                            description="Upload the logo with a transparent background."
                            image={logoImage}
                            onImageChange={setLogoImage}
                        />
                    </div>

                    <div className="text-center mb-8">
                        <button
                            onClick={handleAlign}
                            disabled={!companyNameImage || !logoImage || isLoading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-blue-500/30"
                        >
                            {isLoading ? 'Aligning...' : 'Align Logo'}
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center items-center flex-col">
                            <Spinner />
                            <p className="text-gray-400 mt-2">AI is working its magic... this may take a moment.</p>
                        </div>
                    )}

                    <ResultDisplay resultImage={resultImage} error={error} />
                </main>
            </div>
        </div>
    );
};

export default App;
