import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ChevronLeft, Plus, Settings } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AgentSettings() {
    let [settingsEnabled, setSettingsEnabled] = useState(true);
    const navigate = useNavigate();
    
    return (
        <div className="flex flex-col w-full">
            <header className="sticky z-50 top-0 flex h-16 items-center border-b bg-background px-4">
                <div className="flex items-center mr-auto gap-3">
                    <Button variant="ghost" size="icon" onClick={() => {navigate(-1)}}>
                        <ChevronLeft className="size-5" />
                    </Button>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Create agent</h4>
                </div>
                <div className="flex ml-auto gap-1.5">
                    <ModeToggle />
                </div>
            </header>
            <main className="mb-32">
                <form className="flex flex-col items-start gap-2 p-2">
                    <Card className="w-full border-none">
                        <CardHeader>
                            <CardTitle>
                                LLM Provider
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button className="text-left w-[300px]" variant="outline">
                                        <p className="grow">Select LLM provider...</p>
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-[300px]">
                                    <Command>
                                        <CommandInput placeholder="Search LLM provider..." />
                                        <CommandList>
                                            <CommandEmpty>No LLM providers.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem><img className="w-5 h-5 mr-3" src="/cohere.png" /> Cohere</CommandItem>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </CardContent>
                    </Card>
                    <Card className="w-full border-none">
                        <CardHeader>
                            <CardTitle>
                                Cohere
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button className="text-left w-[300px]" variant="outline">
                                        <p className="grow">Select model...</p>
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-[300px]">
                                    <Command>
                                        <CommandInput placeholder="Search models..." />
                                        <CommandList>
                                            <CommandEmpty>No models.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem>Command r</CommandItem>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </CardContent>
                    </Card>
                </form>
            </main>
            <footer className="fixed flex flex-col w-full bottom-0 p-5">
                <Button className="w-full mb-3">Create</Button>
                <Button variant="destructive" className="w-full">Delete</Button>
            </footer>
        </div>
    );
}