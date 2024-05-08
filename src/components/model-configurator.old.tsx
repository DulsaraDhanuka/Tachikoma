import {
    Calculator,
    Calendar,
    CircleUser,
    CreditCard,
    Search,
    Settings,
    Smile,
    CornerDownLeft,
    User,
    Paperclip,
    Mic,
    Menu,
    Moon,
    Sun,
    Plus,
    Rabbit,
    Bird,
    Turtle,
} from "lucide-react";
import { PlusIcon, CalendarIcon, FaceIcon, RocketIcon, PersonIcon, EnvelopeClosedIcon, GearIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
import { Badge } from "@/components/ui/badge"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";

import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Textarea } from "@/components/ui/textarea";
import ChatItem from "@/components/chat-item";
import ChatBottomBar from "@/components/chat-button-bar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Groq } from '@/llm-providers/groq';
import { LLMProviderBase } from "@/llm-providers/llm-provider-base";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FieldValues, useForm } from "react-hook-form";
import { Cohere } from "@/llm-providers/cohere";

export default function ModelConfigurator({ onStartConversation }: { onStartConversation?: (config: {model: string, configuration: FieldValues}) => any }) {
    const [LLMProviders, setLLMProviders] = useState<{ name: string, provider: LLMProviderBase }[]>([]);
    const [modelString, setModelString] = useState("");
    const [models, setModels] = useState<{ name: string, provider: string, icon: string }[]>([]);
    const [modelConfigurationFields, setModelConfigurationFields] = useState<JSX.Element[]>([]);
    const form = useForm();

    useEffect(() => {
        const groq = new Groq();
        const cohere = new Cohere();

        setLLMProviders([
            {
                name: groq.getName(),
                provider: groq
            },
            {
                name: cohere.getName(),
                provider: cohere
            }
        ]);

        async function getModels() {
            let models: { name: string, provider: string, icon: string }[] = [];
            Object.entries(await groq.getModels()).forEach((entry) => {
                models.push({ name: entry[0], provider: groq.getName(), icon: groq.getIcon() });
            })
            Object.entries(await cohere.getModels()).forEach((entry) => {
                models.push({ name: entry[0], provider: cohere.getName(), icon: cohere.getIcon() });
            })
            setModels(models);
        }

        getModels();
    }, []);

    function renderModel(model: { name: string, provider: string, icon: string }) {
        return (
            <>
                <SelectItem value={model.provider + "/" + model.name}>
                    <div className="flex items-start gap-3 text-muted-foreground">
                        {/* <Rabbit className="size-5" /> */}
                        <Avatar className="size-5">
                            <AvatarImage src={model.icon} />
                            <AvatarFallback>{model.name}</AvatarFallback>
                        </Avatar>

                        <div className="grid gap-0.5">
                            <p>
                                {model.provider + " / "}
                                <span className="font-medium text-foreground">
                                    {model.name}
                                </span>
                            </p>
                            <p className="text-xs" data-description>

                            </p>
                        </div>
                    </div>
                </SelectItem>
            </>
        );
    }

    function renderFields(value: string) {
        setModelString(value);
        const [providerName, modelName] = value.split("/");
        const provider: LLMProviderBase = LLMProviders.filter((x) => x.name == providerName)[0].provider;

        const configurations = provider.getModelConfigurations(modelName);
        let elements: JSX.Element[] = [];
        configurations.forEach(configuration => {
            switch (configuration.type) {
                case "textarea":
                    elements.push(
                        <FormField
                            control={form.control}
                            name={configuration.id}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{configuration.name}</FormLabel>
                                    <FormControl>
                                        <Textarea defaultValue={configuration.default} {...field} />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    );
                    break;
                default:
                    break;
            }
        });

        setModelConfigurationFields(elements)
    }

    const startConversation = function () {
        if (onStartConversation) {
            onStartConversation({
                "model": modelString,
                "configuration": form.getValues()
            });
        }
    }

    return (
        <>
            <Form {...form}>
                <form className="flex flex-col h-full" onSubmit={form.handleSubmit(startConversation)}>
                    <div className="flex flex-col gap-3 m-5 h-full">
                        <div className="grid gap-3">
                            <Label htmlFor="model">Model</Label>
                            <Select onValueChange={renderFields}>
                                <SelectTrigger
                                    id="model"
                                    className="items-start [&_[data-description]]:hidden"
                                >
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {models.map((model) => renderModel(model))}
                                </SelectContent>
                            </Select>
                        </div>
                        <fieldset className="grid gap-6 rounded-lg border p-4">
                            <legend className="-ml-1 px-1 text-sm font-medium">
                                Settings
                            </legend>
                            {modelConfigurationFields}
                        </fieldset>
                    </div>
                    <Button className="m-5">Start conversation</Button>
                </form>
            </Form >
        </>
    );
}