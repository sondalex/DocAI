import { useState, useRef} from "react";
import "./App.css";
import { Progress } from "./components/ui/progress";
import { processInference } from "./utils";
import {
    ProgressCallbackData,
    Text,
    LoadMessage,
    ProgressMessage,
    InferMessage,
    LoadData,
    InferData,
    ModelNames,
} from "./types";
import {
    ModelClick,
    PaginationBar,
    TextViewer,
    MenuBar,
} from "./components/ui/text";
import { Spinner } from "./components/ui/spinner";
import { PipelineType } from "@xenova/transformers";
import { useFileImport, useWorker } from "./hooks";
import { Header } from "./components/ui/header";
import { DocumentContainer } from "./components/ui/document";

interface Model {
  task: PipelineType;
  name: string;
}

type alias = string;

interface ModelLoaderProps {
  models: Record<alias, Model>;
}

type ProgressData = {
  progress?: number;
  name: string;
  file?: string;
};

const DocumentAnalyzer = ({ models }: ModelLoaderProps) => {
    const { textsItems, fileNames, onFileImport, setTextsItems } =
    useFileImport();
    const [progressItems, setProgressItems] = useState<ProgressData[]>([]);
    const [active, setActive] = useState<number>(0);
    const activeRef = useRef<number>(0);
    const worker = useWorker((e) => handleWorkerMessage(e));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setSelectedModels] = useState<Set<string>>(new Set());
    const [loadedModels, setLoadedModels] = useState<Set<string>>(new Set());
    const [infering, setInfering] = useState<boolean>(false);

    const textsItemsRef = useRef<Array<Text[]>>([]);
    textsItemsRef.current = textsItems;

    const handleProgress = (data: ProgressCallbackData) => {
        switch (data.status) {
        case "initiate":
            setProgressItems((prevItems: ProgressData[]) => {
                const exists = prevItems.some((item) => item.file === data.file);
                if (!exists) {
                    return [
                        ...prevItems,
                        {
                            file: data.file,
                            name: data.status,
                        },
                    ];
                }
                return prevItems;
            });
            break;

        case "progress":
            setProgressItems((prevItems: ProgressData[]) => {
                const updatedItems = prevItems.map((item) => {
                    if (item.file === data.file) {
                        return { ...item, progress: data.progress };
                    }
                    return item;
                });
                return updatedItems;
            });
            break;

        case "done":
            setProgressItems((prev) =>
                prev.filter((item) => item.file !== data.file),
            );
            break;

        case "ready":
            break;
        }
    };

    const handleOnModelClick = ({ alias, on }: ModelClick) => {
        setSelectedModels((prevSelected) => {
            const newSelected = new Set(prevSelected);
            setTextsItems(
                textsItems.map((items, index) =>
                    index === active
                        ? items.map(
                            (item: Text): Text => ({
                                text: item.text,
                                color: undefined,
                                opacity: undefined,
                            }),
                        )
                        : items,
                ),
            );
            if (!on) {
                newSelected.delete(alias);
            } else {
                newSelected.add(alias);
            }
            return newSelected;
        });

        const model = models[alias];
        if (!loadedModels.has(model.name)) {
            worker.current?.postMessage({
                type: "load",
                data: { modelName: model.name, task: model.task },
            });
        } else {
            if (textsItems[active]) {
                setInfering(true);
                worker.current?.postMessage({
                    type: "infer",
                    data: {
                        input: textsItems[active].map((item: Text): string => item.text),
                        modelName: model.name,
                    },
                });
            }
        }
    };
    const handleLoadConfirmation = (data: LoadData) => {
        const modelName = data.modelName;
        setLoadedModels((prevLoadedModels: Set<string>): Set<string> => {
            const updatedModels = new Set<string>(prevLoadedModels);
            if (modelName) {
                updatedModels.add(modelName);
            }
            return updatedModels;
        });
        console.log("current active", active, activeRef);
        if (modelName !== undefined && textsItemsRef.current[activeRef.current]) {
            setInfering(true);
            worker.current?.postMessage({
                type: "infer",
                data: {
                    input: textsItemsRef.current[activeRef.current].map(
                        (item) => item.text,
                    ),
                    modelName: modelName,
                },
            });
        }
    };

    const handleInfer = <M extends ModelNames>(data: InferData<M>) => {
        const newTextItems = processInference(
            data.input,
            data.output,
            data.modelName,
        );
        setInfering(false);
        setTextsItems([
            ...textsItemsRef.current.slice(0, activeRef.current),
            newTextItems,
            ...textsItemsRef.current.slice(activeRef.current + 1),
        ]);
    };
    const handleWorkerMessage = <M extends ModelNames>(
        e: MessageEvent<ProgressMessage | LoadMessage | InferMessage<M>>,
    ) => {
        const type = e.data.type;
        const data = e.data.data;

        switch (type) {
        case "progress":
            handleProgress(data as ProgressCallbackData);
            break;
        case "load":
            handleLoadConfirmation(data as LoadData);
            break;
        case "infer":
            handleInfer(data as InferData<M>);
            break;
        default:
            break;
        }
    };

    return (
        <DocumentContainer>
            <MenuBar
                className="rounded-none"
                menuItems={Object.keys(models)}
                onModelClick={handleOnModelClick}
                onFileImport={onFileImport}
                exclusive={true}
            ></MenuBar>
            {progressItems.map((data) => (
                <div key={data.file}>
                    <label>{data.file}</label>
                    <Progress value={data.progress}></Progress>
                </div>
            ))}
            {infering ? <Spinner /> : null}

            <TextViewer
                className="h-[800px] w-full border p-4 rounded-none"
                texts={textsItems[active]}
            ></TextViewer>
            <PaginationBar
                className="my-2"
                active={active}
                values={fileNames}
                onClick={(index) => {
                    setActive(index);
                    activeRef.current = index;
                }}
            />
        </DocumentContainer>
    );
};



const App = () => {
    return (
        <>
            <Header title="DocAI" links={[]}/>
            <div className="container mx-auto text-center space-y-10">
                <DocumentAnalyzer
                    models={{
                        "Financial-Sentiment": {
                            task: "sentiment-analysis",
                            name: "Xenova/distilroberta-finetuned-financial-news-sentiment-analysis",
                        },
                        "ESG-Governance": {
                            task: "text-classification",
                            name: "sondalex/GovernanceBERT-governance",
                        },
                        "ESG-Environment": {
                            task: "text-classification",
                            name: "sondalex/EnvironmentalBERT-environmental",
                        },
                        "ESG-Social": {
                            task: "text-classification",
                            name: "sondalex/SocialBERT-social",
                        },
                    }}
                ></DocumentAnalyzer>
            </div>
        </>
    );
};

export default App;
