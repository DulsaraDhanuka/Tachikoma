import { Remarkable } from 'remarkable';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AgentItem({ agentAvatar, agentName, lastMessage }: { agentAvatar: string, agentName: string, lastMessage: string }) {
    const [contextOpen, setContextOpen] = useState(false);

    return (
        <>
            <ContextMenu onOpenChange={setContextOpen}>
                <ContextMenuTrigger className="w-full" asChild>
                    <Link to="/chat">
                        <Button variant="ghost" className={`h-16 w-full flex gap-4 p-3 text-left justify-start overflow-x-hidden ${contextOpen && "bg-accent text-accent-foreground"}`}>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={agentAvatar} alt={agentName} />
                                <AvatarFallback>{agentName.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">
                                    {agentName}
                                </p>
                                <p className="text-sm text-muted-foreground truncate overflow-x-hidden">
                                    {lastMessage}
                                </p>
                            </div>
                        </Button>
                    </Link>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem>Edit</ContextMenuItem>
                    <ContextMenuItem>Delete</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </>
    );
}