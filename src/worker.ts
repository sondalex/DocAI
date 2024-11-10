import { PipelineType, TextClassificationPipeline } from "@xenova/transformers";
import { loadModel} from "./utils";
import { LoadMessage, ProgressCallbackData , ProgressMessage, InferMessage, InferenceItem } from "./types";

class ClassificationPipelines {
    loadedModels: Map<string, TextClassificationPipeline>;

    constructor() {
        this.loadedModels = new Map();
        self.addEventListener("message", this.handleMessage.bind(this));
    }

    async loadModel(
        modelName: string,
        task: PipelineType,
        progressCallback: (data: ProgressCallbackData) => void,
        quantized: boolean,
    ) {
        if (!this.loadedModels.has(modelName)) {
            console.log(`loading model ${modelName}`);
            const model = await loadModel(
                modelName,
                task,
                progressCallback,
                quantized,
            );
            this.loadedModels.set(modelName, model);
        }
    }

    progressCallback(data: ProgressCallbackData) {
        const message: ProgressMessage = { type: "progress", data: data }
        self.postMessage(message);
    }

    async handleMessage(event: MessageEvent) {
        const data = event.data.data;

        switch (event.data.type) {
        case "load": {
            await this.loadModel(
                data.modelName,
                data.task,
                this.progressCallback,
                data.quantized !== undefined ? data.quantized : true,
            );
            const message: LoadMessage = {
                type: "load",
                data: { loaded: true, modelName: data.modelName },
            }
            self.postMessage(message);
            break;
        }
        case "infer": {
            const model: TextClassificationPipeline | undefined =
          this.loadedModels.get(data.modelName);
            if (!model) {
                break;
            }
            const output = await model(data.input) as InferenceItem<typeof data.modelName>[];
            
            console.log(`infering with model ${data.modelName}`);
            const message: InferMessage<typeof data.modelName> = {
                type: "infer",
                data: {
                    output: output,
                    input: data.input, // TODO: use a message id instead to avoid returning redundant information
                    modelName: data.modelName,
                },
            }
            self.postMessage(message);
            break;
        }
        default:
            console.log(`message type ${event.data.type} not supported`);
            break;
        }
    }
}


new ClassificationPipelines();
