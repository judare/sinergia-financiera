import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
export default function FloatBox({
  children,
  className,
  showing = false,
  darkMode = false,
}: any) {
  return (
    <AnimatePresence>
      {showing > 0 && (
        <motion.div
          className={cn(
            `text-center z-[100] rounded-2xl  border border-black/20 dark:border-white/10   bottom-5  bg-white  fixed left-1/2  -translate-x-1/2  shadow-[0_0_20px_rgba(0,0,0,0.20)]`,
            darkMode && "bg-black",
            className
          )}
          transition={{ duration: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
          initial={{
            opacity: 0,
            y: 300,
          }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 200 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
