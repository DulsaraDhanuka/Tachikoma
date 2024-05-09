import Markdown from "markdown-to-jsx";

export default function ChatItem({ selectedUser, message }: { selectedUser: boolean, message: string, authorName: string }) {
    return (
        <div className={"flex flex-col w-full " + (selectedUser ? 'items-start' : 'items-end')}>
            <div className="flex m-3 gap-3 items-center">
                <span className="bg-accent p-3 rounded-md text-sm">
                    <Markdown>{message}</Markdown>
                </span>
            </div>
        </div>
    );
}