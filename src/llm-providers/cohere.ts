import { Message } from "@/lib/chat-types";
import { HashMap } from "@/lib/utils";
import { FieldType, LLMProviderBase, LLMProviderSettingsField, ModelConfigurationField } from "@/llm-providers/llm-provider-base";

import { CohereClient } from "cohere-ai";
import { FieldValues } from "react-hook-form";

export class Cohere extends LLMProviderBase {
    client!: CohereClient;
    models!: HashMap<string>;

    constructor() {
        super();

        this.client = new CohereClient({ token: "" });
        this.models = {};
        
    }

    getIcon(): string {
        return "/cohere.png";
    }

    getName(): string {
        return "Cohere"
    }

    getModelName(id: string): string {
        return this.models[id];
    }

    async initialize(settings: HashMap<string>): Promise<void> {
        if ("apiKey" in settings) {
            this.client = new CohereClient({ token: settings["apiKey"] });
    
            (await this.client.models.list()).models.forEach((model) => {
                if (model.endpoints?.includes("chat") && model.name) {
                    this.models[model.name] = model.name;
                }
            })
        }
    }
    
    async getSettings(): Promise<LLMProviderSettingsField[]> {
        return [
            {
                id: "apiKey",
                name: "API Key",
                default: "",
                type: FieldType.SINGLELINE
            }
        ];
    }

    async getModels(): Promise<object> {
        return this.models;
    }
    
    async getModelConfigurations(_model: string): Promise<ModelConfigurationField[]> {
        return [
            {
                type: FieldType.MULTILINE,
                id: "system_prompt",
                name: "System prompt",
                default: ""
            }
        ];
    }

    async chat(model: string, message: string, config: FieldValues, messages: Message[]): Promise<string> {
        let response = await this.client.chat({
            preamble: config["system_prompt"],
            message: message,
            model: model,
            chatHistory: messages.map((x) => { return {role: x.author == "user" ? "USER" : "CHATBOT", message: x.content}; })
        });
        return response.text;
    }
}