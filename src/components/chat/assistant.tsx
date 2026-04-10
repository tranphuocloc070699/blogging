"use client"
import { AssistantRuntimeProvider } from "@assistant-ui/react"
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk"
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import ChatWidget from "./chat-widget"
const Assistant = () => {



    const runtime = useChatRuntime({
        sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
        transport: new AssistantChatTransport({
            api: "/api/chat"
        })
    })

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            <ChatWidget />
        </AssistantRuntimeProvider>
    )
}

export default Assistant