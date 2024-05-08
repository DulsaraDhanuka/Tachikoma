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
import { useEffect, useMemo, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Groq } from '@/llm-providers/groq';
import { FieldType, LLMProviderBase, ModelConfigurationField } from "@/llm-providers/llm-provider-base";
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
import { useSettings } from "@/contexts/settings-provider";
import { useRoute } from "@/contexts/route-provider";

type Model = {
    provider: string,
    id: string,
    name: string,
    icon: string
};

export default function ModelConfigurator({ llmsInitialized, llmProviders, model, onModelChange, provider, onProviderChange, onStartConversation }: { llmsInitialized: boolean, llmProviders: LLMProviderBase[], model: string, onModelChange: (model: string) => void, provider: LLMProviderBase | null, onProviderChange: (provider: LLMProviderBase | null) => void, onStartConversation: (provider: LLMProviderBase, model: string, configuration: FieldValues) => any }) {
    const form = useForm();
    const { settings, settingsUpdated } = useSettings();
    const [avaiableModels, setAvailableModels] = useState<Model[]>([]);
    const [configurationFields, setConfigurationFields] = useState<ModelConfigurationField[]>([]);

    useEffect(() => {
        async function loadModels() {
            let models: Model[] = []

            for (let i = 0; i < llmProviders.length; i++) {
                const llmProvider = llmProviders[i];
                const x = Object.entries(await llmProvider.getModels());
                let newModels: Model[] = [];
                for (let k = 0; k < x.length; k++) {
                    newModels.push({
                        provider: llmProvider.getName(),
                        id: x[k][0],
                        name: x[k][1],
                        icon: llmProvider.getIcon()
                    });
                }

                models = [...models, ...newModels]
            }

            return models;
        }

        loadModels().then(setAvailableModels);
    }, [llmsInitialized]);

    useEffect(() => {
        if (provider && model != "") {
            provider.getModelConfigurations(model).then(setConfigurationFields);
        }
    }, [model, provider, llmsInitialized]);

    const selectModel = (val: string) => {
        const [providerName, modelId] = val.split("/");
        for (let i = 0; i < llmProviders.length; i++) {
            if (llmProviders[i].getName() == providerName) {
                onProviderChange(llmProviders[i]);
                break;
            }
        }
        onModelChange(modelId);
    }

    const startConversation = () => {
        onStartConversation(provider!, model, form.getValues());
    }

    return (
        <>
            <Form {...form}>
                <form className="flex flex-col h-full" onSubmit={form.handleSubmit(startConversation)}>
                    <div className="flex flex-col gap-3 m-5 h-full">
                        <div className="grid gap-3">
                            <Label htmlFor="model">Model</Label>
                            <Select onValueChange={selectModel}>
                                <SelectTrigger
                                    id="model"
                                    className="items-start [&_[data-description]]:hidden"
                                >
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {avaiableModels.map((model: Model) => (
                                        <SelectItem value={model.provider + "/" + model.id}>
                                            <div className="flex items-start gap-3 text-muted-foreground">
                                                {/* <Rabbit className="size-5" /> */}
                                                <Avatar className="size-5">
                                                    <AvatarImage src={model.icon} />
                                                    <AvatarFallback>{model.provider}</AvatarFallback>
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
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <fieldset className="grid gap-6 rounded-lg border p-4">
                            <legend className="-ml-1 px-1 text-sm font-medium">
                                Settings
                            </legend>

                            {configurationFields.map((fieldDesc: ModelConfigurationField) => (
                                <FormField
                                    control={form.control}
                                    name={fieldDesc.id}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{fieldDesc.name}</FormLabel>
                                            <FormControl>
                                                {fieldDesc.type == FieldType.MULTILINE && ( <Textarea defaultValue={fieldDesc.default} {...field} /> )}
                                            </FormControl>
                                            <FormDescription></FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </fieldset>
                    </div>
                    <Button className="m-5">Start conversation</Button>
                </form>
            </Form >
        </>
    );
}