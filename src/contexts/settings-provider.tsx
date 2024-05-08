import { createContext, useContext, useEffect, useState } from "react";
import { Store } from '@tauri-apps/plugin-store';
import { HashMap } from "@/lib/utils";

export type Settings = {
    supabaseUrl: string,
    supabaseKey: string,
    providerSettings: HashMap<HashMap<string>>
}

const store = new Store('settings.bin');

const SettingsProviderContext = createContext({ settings: {} as Settings, settingsUpdated: false, updateSettings: (settings: Settings) => { } });

export function SettingsProvider({ children }: { children?: React.ReactNode }) {
    const [settings, updateSettings] = useState<Settings>(
        {} as Settings
    );
    const [settingsUpdated, setSettingsUpdated] = useState(false);

    const value = {
        settings,
        settingsUpdated,
        updateSettings: (settings: Settings) => {
            async function updateStore() {
                let newSettings: Settings = {} as Settings;
                newSettings.supabaseKey = settings.supabaseKey as string | ""
                newSettings.supabaseUrl = settings.supabaseUrl as string | ""
                newSettings.providerSettings = settings.providerSettings as HashMap<HashMap<string>> | {}
                await store.set("supabaseUrl", { value: settings.supabaseKey });
                await store.set("supabaseKey", { value: settings.supabaseUrl });
                await store.set("providerSettings", { value: JSON.stringify(settings.providerSettings) });
                return newSettings;
            }
    
            updateStore().then((settings) => {
                updateSettings(settings);
                setSettingsUpdated(!settingsUpdated);
            });
        },
    }

    useEffect(() => {
        async function loadSaved() {
            let newSettings: Settings = {} as Settings;
            newSettings.supabaseUrl = ((await store.get("supabaseUrl")) as {value: string} | {value: ""}).value;
            newSettings.supabaseKey = ((await store.get("supabaseKey")) as {value: string} | {value: ""}).value;
            newSettings.providerSettings = JSON.parse(((await store.get("providerSettings")) as {value: string} | {value: "{}"}).value);

            return newSettings
        }

        loadSaved().then((settings) => {
            updateSettings(settings);
            setSettingsUpdated(!settingsUpdated);
        });
    }, []);

    return (
        <SettingsProviderContext.Provider value={value}>
            {children}
        </SettingsProviderContext.Provider>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsProviderContext);

    if (context === undefined)
        throw new Error("useSettings must be used within a SettingsProvider")

    return context;
}

