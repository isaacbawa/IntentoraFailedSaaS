import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SponsoredContent {
    title: string;
    description: string;
    image?: string;
    sponsorName?: string;
    link: string;
}

const TeardownSideBar = ({
    title,
    description,
    image,
    sponsorName,
    link,
}: SponsoredContent) => {
    return (
        <div className="bg-white mb-3 rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="w-full h-36 object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            )}
            <div className="p-2 mb-3">
                <p className="text-xs uppercase text-gray-400 mb-1 font-medium tracking-wide">
                    Sponsored
                </p>
                <h3 className="text-md font-semibold text-gray-900 leading-tight mb-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{description}</p>
                <div className="flex items-center justify-between">
                    {sponsorName && (
                        <span className="text-xs text-gray-500 italic">
                            by {sponsorName}
                        </span>
                    )}
                    <Link
                        to={link}
                        target="_blank"
                        className="inline-flex items-center text-red-600 hover:text-red-700 text-xs font-medium"
                    >
                        Learn more <ExternalLink className="ml-1 w-3 h-3" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TeardownSideBar;
