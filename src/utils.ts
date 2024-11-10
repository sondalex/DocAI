import {
    pipeline,
    TextClassificationPipeline,
    env,
    PipelineType,
} from "@xenova/transformers";
import segment from "sentencex";

import { InferenceItem, ModelNames, Text, ProgressCallbackData } from "./types";

import { GREEN400, BLUE400, YELLOW400, RED400, PINK400 } from "./colors";

env.allowLocalModels = false;
env.useBrowserCache = false;



const loadModel = async (
    modelName: string,
    task: PipelineType,
    progress_callback: (data: ProgressCallbackData) => void,
    quantized: boolean,
): Promise<TextClassificationPipeline> => {
    const model = await pipeline(task, modelName, {
        progress_callback: progress_callback,
        quantized: quantized,
    });
    return model as TextClassificationPipeline;
};

const concat_string = (a: string, b: string, between: string) => {
    return a + between + b;
};



const processInferenceItem = <M extends ModelNames>(item: InferenceItem<M>, text: string, modelName: string): Text => {
    let processedItem: Text;
    let color: string | undefined;
    switch (modelName) {
    case "Xenova/distilbert-base-uncased-finetuned-sst-2-english":
        processedItem = {
            text: text,
            color: item.label == "POSITIVE" ? GREEN400 : RED400,
            opacity: item.score,
        };
        return processedItem;
    case "Xenova/distilroberta-finetuned-financial-news-sentiment-analysis":
        switch (item.label) {
        case "positive":
            color = GREEN400;
            break;
        case "negative":
            color = RED400;
            break;
        case "neutral":
            color = undefined;
            break;
        }
        processedItem = {
            opacity: item.score,
            text: text,
            color: color,
        };

        return processedItem;
    case "sondalex/GovernanceBERT-governance":
        switch (item.label) {
        case "none":
            color = undefined;
            break;
        case "governance":
            color = BLUE400;
            break;
        }

        processedItem = {
            opacity: item.score,
            text: text,
            color: color,
        };
        return processedItem;
    case "sondalex/EnvironmentalBERT-environmental":
        switch (item.label) {
        case "none":
            color = undefined;
            break;
        case "environmental":
            color = YELLOW400;
            break;
        }
        processedItem = {
            opacity: item.score,
            text: text,
            color: color,
        };
        return processedItem;
    case "sondalex/SocialBERT-social":
        switch (item.label) {
        case "none":
            color = undefined;
            break;
        case "social":
            color = PINK400;
            break;
        }
        processedItem = {
            opacity: item.score,
            text: text,
            color: color,
        };
        return processedItem;

    default:
        throw Error(`model ${modelName} not supported`);
    }
};

const processInference = <M extends ModelNames>(
    input: string[],
    output: InferenceItem<M>[],
    modelName: string,
): Text[] => {
    const processedOutput = zip(input, output).map(([text, item]: [string, InferenceItem<M>]) =>
        processInferenceItem(item, text, modelName),
    );
    return processedOutput;
};

const sentencize = (text: string): string[] => {
    return segment("en", text);
};

function intToHex(i: number): string {
    const c = (i & 0x00ffffff).toString(16).toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

const labelToColor = (label: string) => {
    let hash = 0;
    for (let i = 0; i < label.length; i++) {
        hash = label.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `#${intToHex(hash)}`;
};

const where = (iterable: string[], match: string): Uint8Array => {
    const idx = iterable
        .map((str, index) => (str === match ? index : -1))
        .filter((item) => item !== -1);

    return new Uint8Array(idx); // convert to Uint8Array
};

const between = <T>(
    iterable: Array<T>,
    idx: Uint8Array,
): Iterable<Iterable<T>> => {
    return {
        *[Symbol.iterator]() {
            for (let i = 0; i < idx.length - 1; i++) {
                yield iterable.slice(idx[i] + 1, idx[i + 1]);
            }
        },
    };
};

const zip = <T, U>(a: T[], b: U[]): [T, U][] => a.map((k, i) => [k, b[i]]);

const before = <T>(
    iterable: Array<T>,
    minIndex: number
): Iterable<Iterable<T>> => {
    return {
        *[Symbol.iterator]() {
            yield iterable.slice(0, minIndex);
        },
    };
};


const after = <T>(iterable: Array<T>, maxIndex: number): Iterable<Iterable<T>> => {
    return {
        *[Symbol.iterator]() {
            yield iterable.slice(maxIndex + 1);
        },
    };
};

const sliceOutOfIndices = <T>(
    iterable: Array<T>,
    indices: Uint8Array
): Iterable<Iterable<T>> => {
    return {
        *[Symbol.iterator]() {
            yield* before(iterable, Math.min(...indices));
            yield* between(iterable, indices);
            yield* after(iterable, Math.max(...indices));
        },
    };
};

const normalizeURL = (baseURL: string, path: string): string => {
    if (baseURL && !baseURL.endsWith('/')) {
        baseURL += '/';
    } else {
        while (baseURL[baseURL.length - 2] === "/"){
            baseURL = baseURL.slice(0, -1);
        }
    }
    if (path && baseURL) {
        while (path.startsWith('/')) {
            path = path.slice(1);
        }
    }
    console.log(baseURL, path)

    return baseURL + path;
}


export {
    loadModel,
    sentencize,
    labelToColor,
    where,
    between,
    zip,
    before,
    after,
    sliceOutOfIndices,
    processInference,
    concat_string,
    normalizeURL
};
