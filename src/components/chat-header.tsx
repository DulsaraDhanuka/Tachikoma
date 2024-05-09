import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { PlusIcon, SettingsIcon } from "lucide-react";
import { useRoute } from "@/contexts/route-provider";
import { Button } from "@/components/ui/button";

export default function ChatHeader({ icon, name, onNewConversation }: { icon: string | undefined, name: string | undefined, onNewConversation: () => undefined }) {
    const { setCurrentRoute } = useRoute();

    return (
        <header className="sticky top-0 z-10 flex border-b bg-background px-4 flex-none">
            <div className="flex h-16 w-full items-center gap-4">
                <Avatar>
                    <AvatarImage src={icon} />
                    <AvatarFallback>{name}</AvatarFallback>
                </Avatar>
                <Label htmlFor="avatar">{name}</Label>
            </div>
            <div className="flex h-16 items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => { onNewConversation() }}>
                    <PlusIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                    <span className="sr-only">New conversation</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => { setCurrentRoute("/settings") }}>
                    <SettingsIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                    <span className="sr-only">Settings</span>
                </Button>
                <ModeToggle />
            </div>
        </header>
    );
}