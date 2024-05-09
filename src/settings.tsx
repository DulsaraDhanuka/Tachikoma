

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { useForm } from "react-hook-form";
import { FieldType, LLMProviderBase, LLMProviderSettingsField } from "@/llm-providers/llm-provider-base";
import { useSettings } from "@/contexts/settings-provider";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useRoute } from "@/contexts/route-provider";
import { HashMap } from "@/lib/utils";

type LLMProviderSettings = {
  name: string,
  fields: LLMProviderSettingsField[]
};

export default function Settings({ llmProviders }: { llmProviders: LLMProviderBase[] }) {
  const form = useForm();
  const { settings, settingsUpdated, updateSettings } = useSettings();
  const { setCurrentRoute } = useRoute();

  const [providerSettings, setProviderSettings] = useState<LLMProviderSettings[]>([]);

  useEffect(() => {
    form.setValue("supabaseurl", settings.supabaseUrl);
    form.setValue("supabasekey", settings.supabaseKey);
    let providerSettings = Object.entries(settings.providerSettings ? settings.providerSettings : {});
    for (let i = 0; i  < providerSettings.length; i++) {
      const [providerName, providerFields]: [string, any] = providerSettings[i];
      const fields = Object.entries(providerFields);
      for (let k = 0; k < fields.length; k++) {
        const [name, value]: [string, string] = fields[k] as [string, string];
        form.setValue("providerSettings[" + providerName + "[" + name + "]" + "]", value);
      }
    }
    
    async function loadLLMProviderSettings() {
      let settings: LLMProviderSettings[] = [];
      for (let i = 0; i < llmProviders.length; i++) {
        settings.push({
          name: llmProviders[i].getName(),
          fields: await llmProviders[i].getSettings()
        });
      }

      return settings;
    }

    loadLLMProviderSettings().then(setProviderSettings);
  }, []);

  useEffect(() => {
    form.setValue("supabaseurl", settings.supabaseUrl);
    form.setValue("supabasekey", settings.supabaseKey);
    let providerSettings = Object.entries(settings.providerSettings ? settings.providerSettings : {});
    for (let i = 0; i  < providerSettings.length; i++) {
      const [providerName, providerFields]: [string, any] = providerSettings[i];
      const fields = Object.entries(providerFields);
      for (let k = 0; k < fields.length; k++) {
        const [name, value]: [string, string] = fields[k] as [string, string];
        form.setValue("providerSettings[" + providerName + "[" + name + "]" + "]", value);
      }
    }
  }, [settingsUpdated]);

  const onSubmit = () => {
    let values = form.getValues();
    settings.supabaseUrl = values.supabaseurl;
    settings.supabaseKey = values.supabasekey;

    let providerSettings: HashMap<HashMap<string>> = {};
    let providers = Object.entries(values.providerSettings);
    
    for (let i = 0; i  < providers.length; i++) {
      const [providerName, providerFields]: [string, any] = providers[i];
      const fields = Object.entries(providerFields);
      
      providerSettings[providerName] = {} as HashMap<string>;
      for (let k = 0; k < fields.length; k++) {
        const [name, value]: [string, string] = fields[k] as [string, string];
        providerSettings[providerName][name] = value;
      }
    }
    settings.providerSettings = providerSettings;

    updateSettings(settings);
    setCurrentRoute("/");
  }

  return (
    <>
      <div className="flex w-full flex-col h-screen">
        <header className="flex border-b bg-background px-4 flex-none">
          <div className="flex h-16 w-full items-center gap-4">
            <Label htmlFor="avatar">Settings</Label>
          </div>
          <div className="flex h-16 items-center gap-4">
            <ModeToggle />
          </div>
        </header>
        <div className="grow w-full">
          <Form {...form}>
            <form className="flex flex-col h-full" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3 m-5 h-full">
                <fieldset className="grid gap-3 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Database Settings
                  </legend>
                  <FormField
                    control={form.control}
                    name="supabaseurl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supabase URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>

                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="supabasekey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supabase Key</FormLabel>
                        <FormControl>
                          <Input placeholder="..." {...field} />
                        </FormControl>
                        <FormDescription>

                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </fieldset>
                {
                  providerSettings.map((provider) => (
                    <fieldset className="grid gap-3 rounded-lg border p-4">
                      <legend className="-ml-1 px-1 text-sm font-medium">
                        {provider.name}
                      </legend>

                      {
                        provider.fields.map((fieldDesc) => (
                          <FormField
                            control={form.control}
                            name={"providerSettings[" + provider.name + "[" + fieldDesc.id + "]" + "]"}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{fieldDesc.name}</FormLabel>
                                <FormControl>
                                  {fieldDesc.type == FieldType.SINGLELINE && <Input type="text" defaultValue={fieldDesc.default} { ...field } />}
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))
                      }
                    </fieldset>
                  ))
                }
              </div>
              <Button className="m-3" type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
