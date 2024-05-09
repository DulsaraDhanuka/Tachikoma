import { useEffect, useState } from "react"
import { useRoute } from "@/contexts/route-provider";
import { LLMProviderBase } from "@/llm-providers/llm-provider-base";
import { Groq } from '@/llm-providers/groq';
import { Cohere } from "@/llm-providers/cohere";
import { useSettings } from "@/contexts/settings-provider";

import Home from "./home";
import Settings from "./settings";

const llmProviders: LLMProviderBase[] = [
  new Groq(), new Cohere()
];

export default function App() {
  const { currentRoute } = useRoute();
  const { settings, settingsUpdated } = useSettings();
  const [llmsInitialized, setLlmsInitialized] = useState(false);

  useEffect(() => {
    async function reinitialize() {
      for (let i = 0; i < llmProviders.length; i++) {
        const provider = llmProviders[i];
        await provider.initialize((settings.providerSettings && provider.getName() in settings.providerSettings) ? settings.providerSettings[provider.getName()] : {});
      }
      setLlmsInitialized(!llmsInitialized);
    }

    reinitialize();
  }, [currentRoute, settingsUpdated]);

  return (
    <>
      <div className={currentRoute != "/" ? "hidden" : ""}>
        <Home llmsInitialized={llmsInitialized} llmProviders={llmProviders} />
      </div>
      <div className={currentRoute != "/settings" ? "hidden" : ""}>
        <Settings llmProviders={llmProviders} />
      </div>
    </>
  )
}
