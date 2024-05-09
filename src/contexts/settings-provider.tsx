import { createContext, useContext, useEffect, useState } from "react";
import { Store } from '@tauri-apps/plugin-store';
import { HashMap } from "@/lib/utils";

export type Settings = {
    supabaseUrl: string,
    supabaseKey: string,
    providerSettings: HashMap<HashMap<string>>
}

const store = new Store('settings.bin');

const SettingsProviderContext = createContext({ settings: {} as Settings, settingsUpdated: false, updateSettings: (_settings: Settings) => { } });

export function SettingsProvider({ children }: { children?: React.ReactNode }) {
    const [settings, updateSettings] = useState<Settings>(
        {} as Settings
    );
    const [settingsUpdated, setSettingsUpdated] = useState(false);

    const value = {
        settings,
        settingsUpdated,
        updateSettings: (updatedSettings: Settings) => {
            async function updateStore() {
                let newSettings: Settings = {} as Settings;
                newSettings.supabaseKey = updatedSettings.supabaseKey as string | ""
                newSettings.supabaseUrl = updatedSettings.supabaseUrl as string | ""
                newSettings.providerSettings = updatedSettings.providerSettings as HashMap<HashMap<string>> | {}
                await store.set("supabaseUrl", { value: updatedSettings.supabaseKey });
                await store.set("supabaseKey", { value: updatedSettings.supabaseUrl });
                await store.set("providerSettings", { value: JSON.stringify(updatedSettings.providerSettings) });
                return newSettings;
            }
            
            if (JSON.stringify(updatedSettings) != JSON.stringify(settings)) {
                updateStore().then((savedSettings) => {
                    updateSettings(savedSettings);
                    setSettingsUpdated(!settingsUpdated);
                });
            }
        },
    }

    useEffect(() => {
        async function loadSaved() {
            let savedSettings: Settings = {} as Settings;
            savedSettings.supabaseUrl = ((await store.get("supabaseUrl")) as {value: string} | {value: ""}).value;
            savedSettings.supabaseKey = ((await store.get("supabaseKey")) as {value: string} | {value: ""}).value;
            savedSettings.providerSettings = JSON.parse(((await store.get("providerSettings")) as {value: string} | {value: "{}"}).value);

            return savedSettings
        }

        loadSaved().then((savedSettings) => {
            if (JSON.stringify(savedSettings) != JSON.stringify(settings)) {
                updateSettings(savedSettings);
                setSettingsUpdated(!settingsUpdated);
            }
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

