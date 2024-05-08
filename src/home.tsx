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
  SettingsIcon,
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ModelConfigurator from "@/components/model-configurator";

import { FieldValues } from "react-hook-form";

import { useRoute } from "@/contexts/route-provider";

import { AssistantProvider } from "./contexts/assistant-provider";
import Chat from "@/components/chat";
import { LLMProviderBase } from "@/llm-providers/llm-provider-base";

type Model = {
  provider: string,
  id: string,
  name: string,
  icon: string
};

export default function Home({ llmsInitialized, llmProviders }: { llmsInitialized: boolean, llmProviders: LLMProviderBase[] }) {
  const { setCurrentRoute } = useRoute();
  const [isCommandDialogOpen, setCommandDialogOpen] = useState(false);
  const [chatView, setChatView] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<LLMProviderBase | null>();
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [modelConfiguration, setModelConfiguration] = useState<FieldValues>({} as FieldValues);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === " " && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandDialogOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, []);

  const onStartConversation = (provider: LLMProviderBase, model: string, configuration: FieldValues) => {
    setModelConfiguration(configuration);
    setChatView(true);
  }

  return (
    <>
      {
        chatView ?
          <>
            <AssistantProvider llmProvider={selectedProvider!} model={selectedModel} configuration={modelConfiguration} history={[]}>
              <Chat selectedProvider={selectedProvider!} selectedModel={selectedModel} />
            </AssistantProvider>
          </> :
          <ModelConfigurator llmsInitialized={llmsInitialized} llmProviders={llmProviders} model={selectedModel} onModelChange={setSelectedModel} provider={selectedProvider!} onProviderChange={setSelectedProvider} onStartConversation={onStartConversation} />
      }

      <Dialog open={isCommandDialogOpen} onOpenChange={setCommandDialogOpen}>
        <DialogContent className="overflow-hidden p-0">
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Options">
                <CommandItem onSelect={() => { setChatView(false) }}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  <span>New conversation</span>
                </CommandItem>
                <CommandItem onSelect={() => { setCurrentRoute("/settings") }}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
