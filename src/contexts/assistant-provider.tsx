import { LLMProviderBase } from "@/llm-providers/llm-provider-base";
import { createContext, useContext, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Message } from "@/lib/chat-types";

export type AssistantProviderState = {
    llmProvider: LLMProviderBase | null,
    model: string,
    configuration: FieldValues,
    messages: Message[],
    sendMessage: (message: string) => undefined
};

const AssistantProviderContext = createContext<AssistantProviderState>({ llmProvider: null, model: "", configuration: {}, messages: [], sendMessage: (message: string) => undefined });

export function AssistantProvider({ children, llmProvider, model, configuration, history }: { children?: React.ReactNode, llmProvider: LLMProviderBase, model: string, configuration: FieldValues, history: Message[] }) {
    const [messages, setMessages] = useState<Message[]>(history);

    const value: AssistantProviderState = {
        llmProvider,
        model,
        configuration,
        messages,
        sendMessage: (message: string) => {
            setMessages((oldval) => [...oldval, { author: "user", content: message }]);
            llmProvider.chat(model, message, configuration, messages).then((response) => {
                setMessages((oldval) => [...oldval, { author: "assistant", content: response }]);
            });
        }
    }

    return (
        <AssistantProviderContext.Provider value={value}>
            {children}
        </AssistantProviderContext.Provider>
    );
}

export const useAssistant = () => {
    const context = useContext(AssistantProviderContext);

    if (context === undefined)
        throw new Error("useSettings must be used within a SettingsProvider")

    return context;
}

