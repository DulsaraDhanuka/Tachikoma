import ChatHeader from "@/components/chat-header";
import { LLMProviderBase } from "@/llm-providers/llm-provider-base";
import ChatBottomBar from "@/components/chat-button-bar";
import { useAssistant } from "@/contexts/assistant-provider";
import { Message } from "@/lib/chat-types";
import ChatItem from "@/components/chat-item";
import { useEffect, useRef } from "react";

export default function Chat({ selectedProvider, selectedModel }: { selectedProvider: LLMProviderBase | undefined, selectedModel: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const { messages, sendMessage } = useAssistant();

    useEffect(() => {
        window.scrollTo(0, ref.current!.scrollHeight);
    }, [messages])

    return (
        <div className="flex w-full flex-col h-screen">
            <ChatHeader name={selectedProvider?.getModelName(selectedModel)} icon={selectedProvider?.getIcon()} />
            <div className="grow" ref={ref}>
                {
                    messages.map((message: Message) => (
                        <ChatItem selectedUser={message.author == "assistant"} message={message.content} authorName={message.author} />
                    ))
                }
            </div>
            <div className="sticky bottom-0 flex-none p-3 bg-background">
                <ChatBottomBar onSend={(message: string) => {
                    sendMessage(message);
                }} />
            </div>
        </div>
    );
}