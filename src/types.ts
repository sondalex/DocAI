interface Text {
  text: string;
  color: string | undefined;
  opacity: number | undefined;
}

type Link = { name: string; newTab: boolean; href: string };

interface File {
  name: string;
  content: string;
}

type ModelNames = keyof ModelItemMap;

interface DistilBertItem {
  label: "POSITIVE" | "NEGATIVE";
  score: number;
}

interface FinancialNewsItem {
  label: "positive" | "negative" | "neutral";
  score: number;
}

interface GovernanceBertItem {
  label: "none" | "governance";
  score: number;
}

interface EnvironmentalBertItem {
  label: "none" | "environmental";
  score: number;
}

interface SocialBertItem {
  label: "none" | "social";
  score: number;
}

type ModelItemMap = {
  "Xenova/distilbert-base-uncased-finetuned-sst-2-english": DistilBertItem;
  "Xenova/distilroberta-finetuned-financial-news-sentiment-analysis": FinancialNewsItem;
  "sondalex/GovernanceBERT-governance": GovernanceBertItem;
  "sondalex/EnvironmentalBERT-environmental": EnvironmentalBertItem;
  "sondalex/SocialBERT-social": SocialBertItem;
};

type InferenceItem<M extends ModelNames> = ModelItemMap[M];

type LoadData = { loaded: boolean; modelName: string };

interface LoadMessage {
  type: "load";
  data: LoadData;
}

type status = "initiate" | "progress" | "done" | "ready";

type ProgressCallbackData = {
  status: status;
  name?: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
  task?: "text-classification" | "sentiment-analysis";
  model?: string;
};

interface ProgressMessage {
  type: "progress";
  data: ProgressCallbackData;
}

type InferData<M extends ModelNames> = {
    output: InferenceItem<M>[];
    input: string[];
    modelName: string;
};


interface InferMessage<M extends ModelNames>{
  type: "infer";
  data: InferData<M>
}

export type {
    Text,
    File,
    Link,
    InferenceItem,
    ModelNames,
    LoadData,
    LoadMessage,
    ProgressCallbackData,
    ProgressMessage,
    InferData,
    InferMessage,
};
