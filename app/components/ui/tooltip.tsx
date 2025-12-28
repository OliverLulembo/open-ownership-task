"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children: React.ReactElement
  content: React.ReactNode
  className?: string
}

export function Tooltip({ children, content, className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [position, setPosition] = React.useState({ top: 0, left: 0 })
  const triggerRef = React.useRef<HTMLDivElement>(null)

  // Extract background color from className for arrow
  const getArrowColor = () => {
    if (className?.includes('bg-red-500')) return 'border-t-red-500'
    if (className?.includes('bg-orange-500')) return 'border-t-orange-500'
    if (className?.includes('bg-purple-500')) return 'border-t-purple-500'
    if (className?.includes('bg-blue-500')) return 'border-t-blue-500'
    if (className?.includes('bg-gray-500')) return 'border-t-gray-500'
    return 'border-t-gray-900'
  }

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.top - 8, // Position above the element
        left: rect.left + rect.width / 2, // Center horizontally
      })
    }
  }

  const handleMouseEnter = () => {
    setIsVisible(true)
    updatePosition()
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  React.useEffect(() => {
    if (isVisible) {
      updatePosition()
      const handleScroll = () => {
        requestAnimationFrame(updatePosition)
      }
      const handleResize = () => {
        requestAnimationFrame(updatePosition)
      }
      
      // Listen to scroll on all scrollable containers
      document.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleResize)
      
      return () => {
        document.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [isVisible])

  return (
    <>
      <div
        ref={triggerRef}
        className="relative w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isVisible && typeof window !== 'undefined' && createPortal(
        <div
          className={cn(
            "fixed z-[9999] px-2 py-1 text-xs font-medium rounded-md shadow-lg pointer-events-none whitespace-nowrap",
            className
          )}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {content}
          <div
            className={cn(
              "absolute top-full left-1/2 -translate-x-1/2 w-0 h-0",
              getArrowColor()
            )}
            style={{
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid',
            }}
          />
        </div>,
        document.body
      )}
    </>
  )
}

