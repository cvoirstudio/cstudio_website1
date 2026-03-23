'use client'

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right'
  className?: string
}

const getVariants = (direction: ScrollRevealProps['direction']): Variants => {
  const offset = 24
  const initial =
    direction === 'left'
      ? { opacity: 0, x: -offset }
      : direction === 'right'
        ? { opacity: 0, x: offset }
        : { opacity: 0, y: offset }

  return {
    hidden: initial,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  }
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      variants={getVariants(direction)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
      // Respect prefers-reduced-motion via Framer Motion's global config
      // (set in layout via MotionConfig reducedMotion="user" if desired)
    >
      {children}
    </motion.div>
  )
}
