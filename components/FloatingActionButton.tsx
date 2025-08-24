"use client"

import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

export function FloatingActionButton() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        onClick={handleScrollToTop}
        size="lg"
        className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group"
        aria-label="Scroll to top"
      >
        <ArrowUp className="animate-bounce text-white group-hover:scale-110 transition-transform mt-1" />
      </Button>
    </div>
  )
}
