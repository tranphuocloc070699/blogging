import { motion } from "motion/react"
import { Button } from "../ui/button"
import { Sparkles } from "lucide-react"
import { ComponentProps } from "react"

interface ChatFloatingButtonProps extends Pick<ComponentProps<"button">, "onClick" | "disabled" | "aria-label"> {
    isMobile?: boolean
}
const ChatFloatingButton = ({ onClick, isMobile }: ChatFloatingButtonProps) => {
    return (
        <Button
            size={isMobile ? "fab-sm" : "fab"}
            variant={"outline"}
            onClick={onClick}
        >
            <Sparkles />
        </Button>
    )
}

export default ChatFloatingButton
