"use client"
import { AssistantRuntimeProvider, Suggestions, useAui } from "@assistant-ui/react"
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk"
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import ChatWidget from "./chat-widget"

const Assistant = () => {
    const runtime = useChatRuntime({
        sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
        transport: new AssistantChatTransport({
            api: "/api/chat",
        }),
    })

    const aui = useAui({
        suggestions: Suggestions([
            { title: "Who is the author?", label: "", prompt: "Who is the author of this blog?" },
            { title: "What is this blog?", label: "", prompt: "What topics does this blog cover?" },
            { title: "Show popular posts", label: "", prompt: "What are the most liked posts on this blog?" },
            { title: "Latest posts", label: "", prompt: "What are the latest published posts?" },
        ]),
    });


    return (
        <AssistantRuntimeProvider aui={aui} runtime={runtime}>
            <ChatWidget />
        </AssistantRuntimeProvider>
    )
}

export default Assistant