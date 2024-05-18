import { Remarkable } from 'remarkable';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button"
import { useState } from 'react';

export default function ConversationItem({ title }: { title: string }) {
    const [contextOpen, setContextOpen] = useState(false);
    return (
        <>
            <ContextMenu onOpenChange={setContextOpen}>
                <ContextMenuTrigger className="w-full" asChild>
                    <Button variant={"ghost"} className={`justify-start w-full ${contextOpen && "bg-accent text-accent-foreground"}`}>{title}</Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem>Delete</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </>
    );
}