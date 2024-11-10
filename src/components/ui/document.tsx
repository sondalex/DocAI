import { ReactNode } from "react";
import { Card } from "./card";

interface DocumentContainerProps {
    children?: ReactNode;
}

const DocumentContainer = ({children}: DocumentContainerProps) => {
    return (
        <Card className="w-3/4 flex flex-col mx-auto justify-center content-center">
            <div className="flex justify-start flex-row">
                <div className="flex justify-start w-full flex-col mx-2 my-2 space-y-6">
                    {children}
                </div>
            </div>
        </Card>
    )
}
export {DocumentContainer}
