import { LoaderPinwheel } from "lucide-react";

const Spinner = ({
    size = "default",
    className = "",
}: {
    size?: "small" | "default" | "large";
    className?: string;
}) => {
    const sizeClasses = {
        small: "w-4 h-4",
        default: "w-6 h-6",
        large: "w-8 h-8",
    };

    return (
        <div className="flex items-center justify-center">
            <LoaderPinwheel
                className={`animate-spin text-primary ${sizeClasses[size]} ${className}`}
            />
        </div>
    );
};

export { Spinner };
