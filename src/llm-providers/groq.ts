import { FieldType, LLMProviderBase, LLMProviderSettingsField, ModelConfigurationField } from "@/llm-providers/llm-provider-base";
import { FieldValues } from "react-hook-form";
import { HashMap } from "@/lib/utils";
import { Message } from "@/lib/chat-types";
import { Groq as GroqSDK } from "groq-sdk";

export class Groq extends LLMProviderBase {
    models: any;
    groq!: GroqSDK;

    constructor() {
        super();

        this.models = {
            "llama3-8b-8192": "LLaMA3 8b",
            "llama3-70b-8192": "LLaMA3 70b",
            "mixtral-8x7b-32768": "Mixtral 8x7b",
            "gemma-7b-it": "Gemma 7b"
        };
    }

    getIcon(): string {
        return "/groq.ico";
    }

    getName(): string {
        return "Groq"
    }

    getModelName(id: string): string {
        return this.models[id];
    }

    async initialize(settings: HashMap<string>): Promise<void> {
        if ("apiKey" in settings) {
            this.groq = new GroqSDK({ apiKey: settings["apiKey"], dangerouslyAllowBrowser: true });
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

    async getModelConfigurations(model: string): Promise<ModelConfigurationField[]> {
        return [
            {
                type: FieldType.MULTILINE,
                id: "system_prompt",
                name: "System prompt",
                default: ""
            }
        ];
    }

    async chat(model: string, message: string, config: FieldValues, history: Message[]): Promise<string> {
        let messages = [];
        if (config["system_prompt"]) { messages.push({ role: "system", content: config["system_prompt"] }); }
        messages.push(...history.map((message) => {
            return { role: message.author == "user" ? "user" : "assistant", content: message.content }
        }));
        messages.push({ role: "user", content: message });
        console.log(messages);
        return (await this.groq.chat.completions.create({
            model: model,
            messages: messages,
        })).choices[0].message.content;
    }

}