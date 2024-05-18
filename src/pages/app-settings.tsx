import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Plus, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { invoke } from '@tauri-apps/api/core';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

enum InputType {
    TEXT = "TEXT",
    LONGTEXT = "LONGTEXT",
    BOOLEAN = "BOOLEAN"
}

interface ProviderSetting {
    name: string,
    label: string,
    kind: InputType,
    default_bool: boolean | null,
    default_text: string | null
}

interface LLMProvider {
    name: string,
    settings: ProviderSetting[]
}

interface AppSettings {
    default_agent: string,
    provider_settings: any
}

export default function AppSettings() {
    const [providers, setProviders] = useState<Map<string, LLMProvider>>(new Map());
    const [appSettings, setAppSettings] = useState<AppSettings>({ default_agent: "", provider_settings: {} } as AppSettings);
    const navigate = useNavigate();

    const form = useForm();

    useEffect(() => {
        (invoke("load_app_settings") as Promise<AppSettings>).then((settings) => {
            form.setValue("defaultAgent", settings["default_agent"]);
            setAppSettings(settings);

            (invoke('get_llm_providers') as Promise<string[]>).then((providerNames) => {
                for (let i = 0; i < providerNames.length; i++) {
                    (invoke('get_llm_provider_settings', { provider: providerNames[i] }) as Promise<ProviderSetting[]>).then((settings) => {
                        setProviders(providers => {
                            let newProviders = new Map(providers);
                            newProviders.set(providerNames[i], { name: providerNames[i], settings: settings } as LLMProvider);
                            return newProviders;
                        });
                    }).catch((e) => {
                        (e === false && console.error(`Settings for ${providerNames[i]} not implemented`))
                    })
                }
            });
        });
    }, []);

    function getDefaultFieldValue(provider: string, setting_name: string, default_value: any) {
        if (appSettings["provider_settings"][provider] === undefined) {
            return default_value;
        }

        if (appSettings["provider_settings"][provider][setting_name] === undefined) {
            return default_value;
        }

        return appSettings["provider_settings"][provider][setting_name];
    }

    function onSubmit(values: any) {
        let settings: AppSettings = {
            default_agent: values["defaultAgent"],
            provider_settings: {}
        };

        for (let [_, provider] of providers) {
            let providerSettings: any = {};
            providerSettings["enabled"] = values[provider.name]["enabled"] === true ? true : false;
            for (let setting of provider.settings) {
                let value = values[provider.name][setting.name];

                if (value === undefined && (setting.kind == "LONGTEXT" || setting.kind == "TEXT")) {
                    value = setting.default_text
                } else if (value === undefined && setting.kind == "BOOLEAN") {
                    value = setting.default_bool;
                }

                providerSettings[setting.name] = value;
            }
            settings["provider_settings"][provider.name] = providerSettings;
        }

        (invoke("save_app_settings", { "settings": settings }) as Promise<any>).then((success) => {
            if (success) {
                navigate(-1);
            } else {
                console.error("Failed to save settings");
            }
        });
    }

    return (
        <div className="flex flex-col w-full">
            <header className="sticky z-50 top-0 flex h-16 items-center border-b bg-background px-4">
                <div className="flex items-center mr-auto gap-3">
                    <Button variant="ghost" size="icon" onClick={() => { navigate(-1) }}>
                        <ChevronLeft className="size-5" />
                    </Button>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Settings</h4>
                </div>
                <div className="flex ml-auto gap-1.5">
                    <ModeToggle />
                </div>
            </header>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mb-32">
                    <main className="flex flex-col w-full items-start gap-2 p-2">
                        <Card className="w-full border-none shadow-none">
                            <CardHeader>
                                <CardTitle className="flex">
                                    <div className="flex mr-auto">
                                        General
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="defaultAgent"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Default agent</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select the default agent" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="agent1">Agent 1</SelectItem>
                                                    <SelectItem value="agent2">Agent 2</SelectItem>
                                                    <SelectItem value="agent3">Agent 3</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                The default agent used in quick access
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {[...providers.values()].map((provider) => {
                            return (
                                <Card className="w-full border-none shadow-none">
                                    <CardHeader>
                                        <CardTitle className="flex">
                                            <div className="flex mr-auto">
                                                <img className="w-5 h-5 mr-3" src={`/${provider.name.toLowerCase()}.png`} />
                                                {provider.name}
                                            </div>
                                            <div className="flex ml-auto">
                                                <FormField
                                                    control={form.control}
                                                    name={`${provider.name}[enabled]`}
                                                    defaultValue={getDefaultFieldValue(provider.name, "enabled", false)}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Switch
                                                                    name={`${provider.name}[enabled]`}
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {provider.settings.map((setting) => {
                                            return (
                                                <div className="grid gap-3">
                                                    {setting.kind === InputType.TEXT && <FormField
                                                        control={form.control}
                                                        name={`${provider.name}[${setting.name}]`}
                                                        defaultValue={getDefaultFieldValue(provider.name, setting.name, setting.default_text)}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>{setting.label}</FormLabel>
                                                                <FormControl>
                                                                    <Input type="text" className="w-full" {...field} />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />}
                                                    {setting.kind === InputType.LONGTEXT && <FormField
                                                        control={form.control}
                                                        name={`${provider.name}[${setting.name}]`}
                                                        defaultValue={getDefaultFieldValue(provider.name, setting.name, setting.default_text)}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>{setting.label}</FormLabel>
                                                                <FormControl>
                                                                    <Textarea className="w-full" {...field} />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />}
                                                    {setting.kind === InputType.BOOLEAN && <FormField
                                                        control={form.control}
                                                        name={`${provider.name}[${setting.name}]`}
                                                        defaultValue={getDefaultFieldValue(provider.name, setting.name, setting.default_bool)}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>{setting.label}</FormLabel>
                                                                <FormControl>
                                                                    <Switch
                                                                        name={`${provider.name}[${setting.name}]`}
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange} />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />}
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </main>
                    <footer className="fixed flex flex-col w-full bottom-0 p-5">
                        <Button className="w-full" type="submit">Save</Button>
                    </footer>
                </form>
            </Form>
        </div>
    );
}