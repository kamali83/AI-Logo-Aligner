
import React, { useCallback, useRef } from 'react';
import { UploadedImage } from '../types';

interface ImageUploaderProps {
    id: string;
    title: string;
    description: string;
    image: UploadedImage | null;
    onImageChange: (image: UploadedImage | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, description, image, onImageChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageChange({
                    file: file,
                    base64: reader.result as string,
                });
            };
            reader.readAsDataURL(file);
        } else {
            onImageChange(null);
        }
    }, [onImageChange]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-gray-400 mb-4 flex-grow">{description}</p>
            <div
                onClick={handleClick}
                className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 h-64 flex justify-center items-center cursor-pointer hover:border-blue-500 transition-colors duration-300 bg-gray-900/50"
            >
                <input
                    ref={fileInputRef}
                    id={id}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                {image ? (
                    <img src={image.base64} alt="Preview" className="max-h-full max-w-full object-contain rounded" />
                ) : (
                    <div className="text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="mt-2 block font-medium">Click to upload an image</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
