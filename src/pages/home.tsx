import AgentItem from "@/components/agent-item";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { BotMessageSquare, BotMessageSquareIcon, MessageSquareDashed, MessageSquareDashedIcon, Plus, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
    let test = [1, 2, 3];//, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    return (
        <div className="flex flex-col w-full">
            <header className="sticky z-50 top-0 flex h-16 items-center border-b bg-background px-4">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">AGENTS</h4>
                <div className="flex ml-auto gap-1.5">
                    <Link to="/appsettings">
                        <Button variant="outline" size="icon">
                            <Settings className="size-5" />
                            <span className="sr-only">Settings</span>
                        </Button>
                    </Link>
                    <ModeToggle />
                </div>
            </header>
            <main className="flex flex-col items-start gap-1 p-2">
                {test.map(() => <AgentItem agentName="Someone" agentAvatar="https://ui.shadcn.com/avatars/01.png" lastMessage="Xxxxxxxxxxxxxxxxxxx" />)}
            </main>
            <footer className="fixed flex flex-col gap-3 bottom-0 right-0 mb-5 mr-5">
                <Link to="createagent">
                    <Button variant="default" size="icon" className="h-12 w-12">
                        <BotMessageSquareIcon className="h-5 w-5" />
                    </Button>
                </Link>
            </footer>
        </div>
    );
}