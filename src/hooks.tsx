import { useCallback, useEffect, useRef, useState } from "react";
import { sentencize } from "./utils";
import { File, Text } from "./types";

const useWorker = (onMessage: (e: MessageEvent) => void) => {
    const workerRef = useRef<Worker | null>(null);

    const stableOnMessage = useCallback(onMessage, []);

    useEffect(() => {
        if (!workerRef.current) {
            workerRef.current = new Worker(new URL("worker.ts", import.meta.url), {
                type: "module",
            });
        }

        const worker = workerRef.current;
        worker.addEventListener("message", stableOnMessage);

        return () => {
            worker.removeEventListener("message", stableOnMessage);
            worker.terminate();
            workerRef.current = null;
        };
    }, [stableOnMessage]);

    return workerRef;
};

const useFileImport = () => {
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [textsItems, setTextsItems] = useState<Array<Text[]>>([]);
    
    const onFileImport = ({ content, name }: File) => {
        const processedText: Text[] = sentencize(content).map(
            (str: string): Text => ({
                text: str,
                color: undefined,
                opacity: undefined,
            }),
        );
        setTextsItems([...textsItems, processedText]);
        setFileNames([...fileNames, name]);
    };
    return { textsItems, fileNames, onFileImport, setTextsItems };
}

export {useWorker, useFileImport}
