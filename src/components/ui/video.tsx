import React from 'react';
import {normalizeURL} from "@/utils"

type VideoSource = {
    src: string;
    type: string;
    media?: string
}

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    sources: VideoSource[];
    baseURL?: string;
}



const Video: React.FC<VideoProps> = ({ sources, baseURL = import.meta.env.BASE_URL, ...videoProps }) => {
    console.log("base", baseURL)
    console.log("source.src", sources)
    return (
        <video {...videoProps} className="w-full h-full object-cover">
            {sources.map((source, index) => (
                <source
                    key={index}
                    src={normalizeURL(baseURL, source.src)} // Prepend baseUrl to each src
                    type={source.type}
                    media={source.media}
                />
            ))}
        </video>
    );
};

export {Video};
export type {VideoSource}
