import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'rotate'
  distance?: number
  duration?: number
  delay?: number
  threshold?: number
  once?: boolean
}

export const ScrollReveal = ({
  children,
  className = '',
  direction = 'up',
  distance = 50,
  duration = 0.6,
  delay = 0,
  threshold = 0.1,
  once = true
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { 
    threshold,
    once,
    margin: '-50px'
  })

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 }
      case 'down':
        return { y: -distance, opacity: 0 }
      case 'left':
        return { x: distance, opacity: 0 }
      case 'right':
        return { x: -distance, opacity: 0 }
      case 'fade':
        return { opacity: 0 }
      case 'scale':
        return { scale: 0.8, opacity: 0 }
      case 'rotate':
        return { rotate: 180, opacity: 0 }
      default:
        return { y: distance, opacity: 0 }
    }
  }

  const getAnimatePosition = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: 0, opacity: 1 }
      case 'left':
      case 'right':
        return { x: 0, opacity: 1 }
      case 'fade':
        return { opacity: 1 }
      case 'scale':
        return { scale: 1, opacity: 1 }
      case 'rotate':
        return { rotate: 0, opacity: 1 }
      default:
        return { y: 0, opacity: 1 }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialPosition()}
      animate={isInView ? getAnimatePosition() : getInitialPosition()}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
