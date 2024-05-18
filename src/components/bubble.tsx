import { Remarkable } from 'remarkable';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import "../assets/bubble.css";
import "../assets/highlight.js.css"
import hljs from 'highlight.js'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useState } from 'react';
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { htmlToText } from 'html-to-text'

export enum MessageAuthor {
    AGENT, USER
};

export default function Bubble({ text, author, authorName, agentAvatar, sentDate, deleteAllowed, regenerateAllowed }: { text: string, author: MessageAuthor, authorName: string, agentAvatar: string, sentDate: string, deleteAllowed: boolean, regenerateAllowed: boolean }) {
    let md = new Remarkable('full', {
        breaks: true,
        langPrefix: "language-",
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (err) { }
            }

            try {
                return hljs.highlightAuto(str).value;
            } catch (err) { }

            return ''; // use external default escaping
        }
    });
    let content = md.render(text);
    content = content.replace(/<pre>/g, "<pre class=\"bg-gray-50 dark:bg-gray-600 rounded-xl p-4 mb-3 mt-3\">");

    const [contextOpen, setContextOpen] = useState(false);

    return (
        <>
            <ContextMenu onOpenChange={setContextOpen}>
                <ContextMenuTrigger className="w-full" asChild>
                    <div className={`flex w-full items-start px-3 py-1 gap-2.5 ${contextOpen && "bg-accent text-accent-foreground"} ${author == MessageAuthor.USER ? "justify-end" : "justify-start"}`}>
                        {author == MessageAuthor.AGENT && (
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={agentAvatar} alt={authorName} />
                                <AvatarFallback>{authorName.toUpperCase()}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`flex w-full max-w-[320px] flex-col leading-1.5 p-3 border-gray-200 bg-gray-100 dark:bg-gray-700 ${author == MessageAuthor.USER ? "rounded-s-xl rounded-ee-xl" : "rounded-e-xl rounded-es-xl"}`}>
                            {/* <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{authorName}</span>
                                </div> */}
                            <div className="text-sm font-normal pb-1 text-gray-900 dark:text-white message-content" dangerouslySetInnerHTML={{ __html: content }}>
                            </div>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 pointer-events-none">{sentDate}</span>
                        </div>
                        {author == MessageAuthor.USER && (
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={agentAvatar} alt={authorName} />
                                <AvatarFallback>{authorName.toUpperCase()}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent >
                    <ContextMenuItem onClick={() => { writeText(htmlToText(content)).then(() => {console.log(content)}) }}>Copy</ContextMenuItem>
                    {regenerateAllowed && <ContextMenuItem>Regenerate</ContextMenuItem>}
                    {deleteAllowed && <ContextMenuItem>Delete</ContextMenuItem>}
                </ContextMenuContent>
            </ContextMenu>
        </>
    );
}