import { ComponentProps, FC } from 'react'
import { motion } from "motion/react"
import {
    ActionBarPrimitive,
    AuiIf,
    ComposerPrimitive,
    ErrorPrimitive,
    MessagePrimitive,
    TextMessagePart,
    ThreadPrimitive,
    useAuiState,
    useMessage,
} from "@assistant-ui/react";
import { ArrowDownIcon, ArrowUpIcon, Loader2, Maximize2, Minimize2, PencilIcon, Sparkles, SquareIcon, XIcon } from 'lucide-react';
import { Button } from '../ui';
import { MarkdownText } from './markdown-text';
import { ToolFallback } from './tool-fallback';
import { TooltipIconButton } from './tooltip-icon-button';
import { cn } from '@/lib/utils';


interface ChatDialogProps extends Pick<ComponentProps<"button">, "onClick"> {
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

const Composer: FC = () => {
    return (
        <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col">
            <ComposerPrimitive.AttachmentDropzone asChild>
                <div
                    data-slot="composer-shell"
                    className="flex p-4 gap-4"
                >

                    <ComposerPrimitive.Input
                        className="aui-composer-input max-h-32 min-h-10 rounded-lg w-full resize-none bg-gray-100 p-3 text-sm outline-none placeholder:text-muted-foreground/80"
                        rows={1}
                        autoFocus
                        aria-label="Message input"
                    />
                    <ComposerAction />
                </div>
            </ComposerPrimitive.AttachmentDropzone>
        </ComposerPrimitive.Root>
    );
};

const ComposerAction: FC = () => {
    return (
        <div className="aui-composer-action-wrapper relative flex items-center justify-between">
            <AuiIf condition={(s) => !s.thread.isRunning}>
                <ComposerPrimitive.Send asChild>
                    <TooltipIconButton
                        tooltip="Send message"
                        side="bottom"
                        type="button"
                        variant="default"
                        size="icon"
                        className="aui-composer-send size-8 rounded-full"
                        aria-label="Send message"
                    >
                        <ArrowUpIcon className="aui-composer-send-icon size-4" />
                    </TooltipIconButton>
                </ComposerPrimitive.Send>
            </AuiIf>
            <AuiIf condition={(s) => s.thread.isRunning}>
                <ComposerPrimitive.Cancel asChild>
                    <Button
                        type="button"
                        variant="default"
                        size="icon"
                        className="aui-composer-cancel size-8 rounded-full"
                        aria-label="Stop generating"
                    >
                        <SquareIcon className="aui-composer-cancel-icon size-3 fill-current" />
                    </Button>
                </ComposerPrimitive.Cancel>
            </AuiIf>
        </div>
    );
};

const MessageError: FC = () => {
    return (
        <MessagePrimitive.Error>
            <ErrorPrimitive.Root className="aui-message-error-root mt-2 rounded-md border border-destructive bg-destructive/10 p-3 text-destructive text-sm dark:bg-destructive/5 dark:text-red-200">
                <ErrorPrimitive.Message className="aui-message-error-message line-clamp-2" />
            </ErrorPrimitive.Root>
        </MessagePrimitive.Error>
    );
};

const ThreadScrollToBottom: FC = () => {
    return (
        <ThreadPrimitive.ScrollToBottom asChild>
            <TooltipIconButton
                tooltip="Scroll to bottom"
                variant="outline"
                className="aui-thread-scroll-to-bottom absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible dark:border-border dark:bg-background dark:hover:bg-accent"
            >
                <ArrowDownIcon />
            </TooltipIconButton>
        </ThreadPrimitive.ScrollToBottom>
    );
};

const UserActionBar: FC = () => {
    return (
        <ActionBarPrimitive.Root
            hideWhenRunning
            autohide="not-last"
            className="aui-user-action-bar-root flex flex-col items-end"
        >
            <ActionBarPrimitive.Edit asChild>
                <TooltipIconButton tooltip="Edit" className="aui-user-action-edit p-4">
                    <PencilIcon />
                </TooltipIconButton>
            </ActionBarPrimitive.Edit>
        </ActionBarPrimitive.Root>
    );
};

const UserMessage: FC = () => {
    return (
        <MessagePrimitive.Root
            className="aui-user-message-root fade-in slide-in-from-bottom-1 mx-auto grid w-full max-w-(--thread-max-width) animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 py-3 duration-150 [&:where(>*)]:col-start-2"
            data-role="user"
        >
            <div className="aui-user-message-content-wrapper relative col-start-2 min-w-0">
                <div className="aui-user-message-content wrap-break-word peer rounded-2xl bg-muted px-4 py-2.5 text-foreground empty:hidden">
                    <MessagePrimitive.Parts />
                </div>
                <div className="aui-user-action-bar-wrapper absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 pr-2 peer-empty:hidden">
                    <UserActionBar />
                </div>
            </div>
        </MessagePrimitive.Root>
    );
};


const ThreadMessage: FC = () => {
    const role = useAuiState((s) => s.message.role);
    if (role === "user") return <UserMessage />;
    return <AssistantMessage />;
};

function isStatusPart(text: string): boolean {
    return text.startsWith("__STATUS__");
}

function getStatusText(text: string): string {
    return text.replace("__STATUS__", "");
}

function StatusStep({ text, isLast }: { text: string; isLast: boolean }) {
    return (
        <div className={cn(
            "flex items-center gap-2 text-xs py-0.5 transition-all duration-300",
            isLast
                ? "text-foreground"
                : "text-muted-foreground/40"
        )}>
            {isLast
                ? <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                : <span className="w-3 h-3 rounded-full border border-border/50 shrink-0" />
            }
            <span>{text}</span>
        </div>
    );
}
const AssistantMessage: FC = () => {
    const message = useMessage();
    const allParts = message.content ?? [];

    const statusParts = allParts.filter(
        p => p.type === "text" && isStatusPart(p.text)
    ) as TextMessagePart[];

    const hasResponse = allParts.some(
        p => p.type === "text" &&
            !isStatusPart(p.text) &&
            p.text.trim().length > 0
    );

    return (
        <MessagePrimitive.Root
            className="aui-assistant-message-root fade-in slide-in-from-bottom-1 relative mx-auto w-full max-w-(--thread-max-width) animate-in py-3 duration-150"
            data-role="assistant"
        >
            <div className="aui-assistant-message-content wrap-break-word px-2 text-foreground leading-relaxed">

                {statusParts.length > 0 && (
                    <div className="mb-3 flex flex-col gap-1 border-l-2 border-border/30 pl-3">
                        {statusParts.map((part, i) => (
                            <StatusStep
                                key={i}
                                text={getStatusText(part.text)}
                                isLast={i === statusParts.length - 1 && !hasResponse}
                            />
                        ))}
                    </div>
                )}

                <MessagePrimitive.Parts>
                    {({ part }) => {
                        if (part.type === "text") {
                            if (isStatusPart(part.text)) return null;
                            return <MarkdownText />;
                        }
                        if (part.type === "tool-call")
                            return part.toolUI ?? <ToolFallback {...part} />;
                        return null;
                    }}
                </MessagePrimitive.Parts>

                <MessageError />
            </div>
        </MessagePrimitive.Root>
    );
};
const ChatDialog = ({ onClick, isFullscreen, onToggleFullscreen }: ChatDialogProps) => {
    return (
        <div
            style={{ borderRadius: isFullscreen ? 0 : "16px" }}
            className="w-full h-full border bg-background flex flex-col overflow-hidden"
        >
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
                <span className="font-semibold text-base flex gap-2 items-center"><Sparkles size={24} /> AI Assistant</span>
                <div className="flex items-center gap-1">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <Button
                            onClick={onToggleFullscreen}
                            size={"icon"}
                            variant={"ghost"}
                            className='rounded-full'
                            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                        >
                            <motion.div
                                key={isFullscreen ? "minimize" : "maximize"}
                                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            </motion.div>
                        </Button>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <Button
                            onClick={onClick}
                            size={"icon"}
                            variant={"ghost"}
                            className='rounded-full'
                            aria-label="Close"
                        >
                            <XIcon size={16} />
                        </Button>
                    </motion.div>
                </div>
            </div>
            <ThreadPrimitive.Root
                className="min-h-0 flex flex-col flex-1"
            >
                <ThreadPrimitive.Viewport className="flex flex-col flex-1 overflow-y-auto px-4 py-3 gap-3 min-h-0">
                    <ThreadPrimitive.Messages>
                        {() => <ThreadMessage />}
                    </ThreadPrimitive.Messages>
                </ThreadPrimitive.Viewport>

                <ThreadPrimitive.ViewportFooter className="sticky bottom-0 mx-auto flex w-full flex-col">
                    <ThreadScrollToBottom />
                    <Composer />
                </ThreadPrimitive.ViewportFooter>
            </ThreadPrimitive.Root>
        </div>
    )
}

export default ChatDialog