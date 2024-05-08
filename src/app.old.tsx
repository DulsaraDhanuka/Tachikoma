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
import ModelConfigurator from "@/components/model-configurator";
import { Groq } from '@/llm-providers/groq';
import { Cohere } from "@/llm-providers/cohere";
import { FieldValues } from "react-hook-form";
import { LLMProviderBase } from "./llm-providers/llm-provider-base";

export default function App() {
  const [open, setOpen] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [chatList, setChatList] = useState<{author: string, message: string}[]>([]);
  const [LLMProvider, setLLMProvider] = useState<LLMProviderBase>();
  const [conversationConfig, setConversationConfig] = useState<{model: string, configuration: FieldValues}>();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === " " && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, []);

  function startConversation(config: {model: string, configuration: FieldValues}) {
    let [provider, model] = config["model"].split("/");
    switch (provider) {
      case "Groq":
        setLLMProvider(new Groq())
        break;
      case "Cohere":
        setLLMProvider(new Cohere())
        break;
      default:
        break;
    }

    setConversationConfig(config);
    setConversationStarted(true);
  }

  return (
    <>
      <div className="flex w-full flex-col h-screen">
        <header className="flex border-b bg-background px-4 flex-none">
          <div className="flex h-16 w-full items-center gap-4">
            <Sheet>
              <SheetTrigger>
                <Menu size={16} />
              </SheetTrigger>
              <SheetContent side="left">
                <Button className="w-full">New conversation</Button>
                <SheetHeader className="mt-5">
                  <SheetTitle>Previous conversations</SheetTitle>
                  <SheetDescription>
                    <Button variant="ghost" className="w-full justify-start">Ghost</Button>
                    <Button variant="ghost" className="w-full justify-start">Ghost</Button>
                    <Button variant="ghost" className="w-full justify-start">Ghost</Button>
                    <Button variant="ghost" className="w-full justify-start">Ghost</Button>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=Bob" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Label htmlFor="avatar">John Doe</Label>
          </div>
          <div className="flex h-16 items-center gap-4">
            <ModeToggle />
          </div>
        </header>
        {conversationStarted ?
          <>
            <div className="grow">
              {
                chatList.map((chat: {author: string, message: string}) => {
                  if (chat.author == "user") {
                    return <ChatItem selectedUser={false} message={chat.message} authorAvatar={"https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=Bob"} authorName={"Dulsara Dhanuka"} />
                  } else {
                    return <ChatItem selectedUser={true} message={chat.message} authorAvatar={"https://api.dicebear.com/8.x/bottts-neutral/svg?seed=Molly"} authorName={"Assistant"} />
                  }
                })
              }
            </div>
            <div className="flex-none p-3">
              <ChatBottomBar onSend={(message: string) => {
                setChatList(oldList => [...oldList, {author: "user", message: message}]);

                if (LLMProvider && conversationConfig) {
                  LLMProvider.chat(conversationConfig.model.split("/")[1], message, conversationConfig.configuration).then((response) => {
                    setChatList(oldList => [...oldList, {author: "assistant", message: response}]);
                  })
                }
              }} />
            </div>
          </> : 
          <>
            <ModelConfigurator onStartConversation={startConversation} />
          </>
        }
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="overflow-hidden p-0">
            <Command className="rounded-lg border shadow-md">
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Options">
                  <CommandItem>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    <span>New conversation</span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Previous conversations">
                  <CommandItem>
                    <ChatBubbleIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </CommandItem>
                  <CommandItem>
                    <ChatBubbleIcon className="mr-2 h-4 w-4" />
                    <span>Mail</span>
                  </CommandItem>
                  <CommandItem>
                    <ChatBubbleIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
