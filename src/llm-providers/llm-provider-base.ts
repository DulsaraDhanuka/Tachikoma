import { Message } from "@/lib/chat-types";
import { HashMap } from "@/lib/utils";
import { FieldValues } from "react-hook-form";

export enum FieldType {
    MULTILINE,
    SINGLELINE
}

export type LLMProviderSettingsField = {
    type: FieldType,
    id: string,
    name: string,
    default: string
};

export type ModelConfigurationField = {
    type: FieldType,
    id: string,
    name: string,
    default: string
};

export abstract class LLMProviderBase {
    constructor() {

    }
    
    abstract getIcon(): string;
    abstract getName(): string;
    abstract getModelName(id: string): string;

    abstract getSettings(): Promise<LLMProviderSettingsField[]>;
    abstract initialize(settings: HashMap<string>): Promise<void>;
    abstract getModels(): Promise<object>;
    abstract getModelConfigurations(model: string): Promise<ModelConfigurationField[]>;
    abstract chat(model: string, message: string, config: FieldValues, messages: Message[]): Promise<string>;
}