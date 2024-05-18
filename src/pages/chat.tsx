import Bubble, { MessageAuthor } from "@/components/bubble";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, CornerDownLeft, Info, List, Mic, Paperclip, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Chat() {
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
                    <Link to="/conversations">
                        <Button variant="outline" size="icon">
                            <List className="size-5" />
                            <span className="sr-only">Conversations</span>
                        </Button>
                    </Link>
                    <Link to="/editagent">
                        <Button variant="outline" size="icon">
                            <Info className="size-5" />
                            <span className="sr-only">Edit agent</span>
                        </Button>
                    </Link>
                    <ModeToggle />
                </div>
            </header>
            <main className="flex flex-col items-start gap-2 py-3 mb-40">
                {test.map((i) => <Bubble key={i} deleteAllowed={false} regenerateAllowed={false} text={`Hello World`} authorName="Hello World" agentAvatar="https://ui.shadcn.com/avatars/01.png" sentDate="2024/05/14 11:00 AM" author={i % 2 ? MessageAuthor.AGENT : MessageAuthor.USER} />)}
            </main>
            <footer className="fixed z-50 bottom-0 w-full overflow-hidden h-auto border-t bg-background">
                <div className="flex w-full items-center h-auto bg-muted/50">
                    <div className="overflow-hidden w-full rounded-lg border bg-background m-3 focus-within:ring-1 focus-within:ring-ring">
                        <Textarea
                            id="message"
                            placeholder="Type your message here..."
                            className="min-h-12 resize-none mr-3 p-3 border-0 shadow-none focus-visible:ring-0"
                        />
                        <div className="flex items-center mt-3 p-3 pt-0">
                            <Button type="submit" size="sm" className="ml-auto gap-1.5">
                                Send Message
                                <CornerDownLeft className="size-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>
                {/* <form className="overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring" x-chunk="dashboard-03-chunk-1">
                    <Label htmlFor="message" className="sr-only">
                        Message
                    </Label>
                    <Textarea
                        id="message"
                        placeholder="Type your message here..."
                        className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                    />
                    <div className="flex items-center p-3 pt-0">
                        <Button type="submit" size="sm" className="ml-auto gap-1.5">
                            Send Message
                            <CornerDownLeft className="size-3.5" />
                        </Button>
                    </div>
                </form> */}
            </footer>
        </div>
    );
}