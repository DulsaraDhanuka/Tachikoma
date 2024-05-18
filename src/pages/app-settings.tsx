import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Plus, Settings } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AppSettings() {
    let [settingsEnabled, setSettingsEnabled] = useState(true);
    const navigate = useNavigate();

    return (
        <div className="flex flex-col w-full">
            <header className="sticky z-50 top-0 flex h-16 items-center border-b bg-background px-4">
                <div className="flex items-center mr-auto gap-3">
                    <Button variant="ghost" size="icon" onClick={() => {navigate(-1)}}>
                        <ChevronLeft className="size-5" />
                    </Button>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Settings</h4>
                </div>
                <div className="flex ml-auto gap-1.5">
                    <ModeToggle />
                </div>
            </header>
            <main className="w-full mb-32">
                <form className="flex flex-col w-full items-start gap-2 p-2">
                    <Card className="w-full border-none">
                        <CardHeader>
                            <CardTitle className="flex">
                                <div className="flex mr-auto">
                                    <img className="w-5 h-5 mr-3" src="/cohere.png" />
                                    Cohere
                                </div>
                                <div className="flex ml-auto">
                                    <Switch checked={settingsEnabled} onCheckedChange={setSettingsEnabled} id="airplane-mode" />
                                </div>
                            </CardTitle>
                            {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3">
                                <Label htmlFor="name">API Key</Label>
                                <Input
                                    disabled={!settingsEnabled}
                                    id="cohere[apikey]"
                                    type="text"
                                    className="w-full"
                                    defaultValue=""
                                />
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </main>
            <footer className="fixed flex flex-col w-full bottom-0 p-5">
                <Button className="w-full">Save</Button>
            </footer>
        </div>
    );
}