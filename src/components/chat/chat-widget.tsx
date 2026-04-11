"use client"
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import ChatFloatingButton from './chat-floating-button'
import ChatDialog from './chat-dialog'

const ChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [winSize, setWinSize] = useState({ w: 380, h: 520 });

    useEffect(() => {
        const update = () => {
            const mobile = window.innerWidth < 640;
            setIsMobile(mobile);
            setWinSize({ w: window.innerWidth, h: window.innerHeight });
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    // On mobile, auto-fullscreen when opening
    useEffect(() => {
        if (isMobile && open) setIsFullscreen(true);
        if (!open) setIsFullscreen(false);
    }, [isMobile, open]);

    const buttonSize = isMobile ? 46 : 58;

    const DESKTOP_FULLSCREEN_LEFT_PAD = 20;

    const dialogWidth = isFullscreen
        ? (isMobile ? winSize.w : winSize.w - DESKTOP_FULLSCREEN_LEFT_PAD)
        : isMobile ? Math.min(winSize.w - 32, 340) : 380;

    const dialogHeight = isFullscreen
        ? winSize.h
        : isMobile ? Math.min(winSize.h - 80, 480) : 520;

    const bottomPos = isFullscreen ? 0 : isMobile ? 16 : 40;
    const rightPos = isFullscreen ? 0 : isMobile ? 16 : 40;

    return (
        <motion.div
            className='fixed z-50'
            animate={{
                bottom: open ? bottomPos : isMobile ? 16 : 40,
                right: open ? rightPos : isMobile ? 16 : 40,
            }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        >
            <motion.div
                layout
                animate={{
                    width: open ? dialogWidth : buttonSize,
                    height: open ? dialogHeight : buttonSize,
                    borderRadius: isFullscreen ? 0 : 16,
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                className="overflow-hidden"
                style={{ originX: 1, originY: 1 }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {open ? (
                        <ChatDialog
                            onClick={() => setOpen(false)}
                            isFullscreen={isFullscreen}
                            onToggleFullscreen={() => setIsFullscreen(v => !v)}
                        />
                    ) : (
                        <motion.div
                            key="button"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.05 }}
                            className="w-full h-full flex items-center justify-center"
                        >

                            <ChatFloatingButton onClick={() => setOpen(true)} isMobile={isMobile} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    )
}

export default ChatWidget
