import Bubble, { MessageAuthor } from "@/components/bubble";
import ConversationItem from "@/components/conversation-item";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, CornerDownLeft, Info, List, Mic, Paperclip, Plus, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Conversations() {
    let test = [1, 2, 3, 4, 5];//, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    return (
        <div className="flex flex-col w-full no-scrollbar">
            <header className="sticky z-50 top-0 flex h-16 items-center border-b bg-background px-4">
                <div className="flex items-center mr-auto gap-3">
                    <Link to="/">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="size-5" />
                        </Button>
                    </Link>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="https://ui.shadcn.com/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>WK</AvatarFallback>
                    </Avatar>
                    <div className="text-lg font-semibold">William Kim</div>
                </div>
                <div className="flex ml-auto gap-1.5">
                    <Link to="/editagent">
                        <Button variant="outline" size="icon">
                            <Info className="size-5" />
                            <span className="sr-only">Edit agent</span>
                        </Button>
                    </Link>
                    <ModeToggle />
                </div>
            </header>
            <main className="flex flex-col items-start gap-2 p-3 mb-20">
                <ConversationItem title="Hello World" />
                <ConversationItem title="123s" />
            </main>
            <footer className="fixed bottom-0 right-0 mb-5 mr-5">
                <Link to="/chat">
                    <Button variant="outline" size="icon" className="h-12 w-12">
                        <Plus className="h-4 w-4" />
                    </Button>
                </Link>
            </footer>
        </div>
    );
}