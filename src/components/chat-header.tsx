import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";

export default function ChatHeader({ icon, name }: { icon: string | undefined, name: string | undefined }) {
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
                <ModeToggle />
            </div>
        </header>
    );
}