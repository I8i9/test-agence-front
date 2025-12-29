/* eslint-disable no-unused-vars */
'use client'

import * as React from 'react'

import { motion } from 'motion/react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'


const Tablist = ({activeTab, setActiveTab , tabs , className , keyRef }) => {
  const tabRefs = React.useRef([])
  const [underlineStyle, setUnderlineStyle] = React.useState({ left: 0, width: 0 })

  React.useLayoutEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.value === activeTab)
    const activeTabElement = tabRefs.current[activeIndex]

    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement

      setUnderlineStyle({
        left: offsetLeft,
        width: offsetWidth
      })
    }
  }, [activeTab])

  return (
    <div key={keyRef} className={`w-full  ${className}`}>
      <Tabs key={keyRef} value={activeTab} onValueChange={setActiveTab} className='gap-4 w-full border-b '>
        <TabsList className='bg-background relative rounded-none p-0 '>
          {tabs.map((tab, index) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              ref={el => {
                tabRefs.current[index] = el
              }}
              className='bg-background px-8  relative z-10 rounded-none border-0 data-[state=active]:shadow-none'
            >
              {tab.name}
            </TabsTrigger>
          ))}

          <motion.div
            key={`div-underline-${keyRef}`}
            className='bg-rod-primary absolute bottom-0 z-20 h-0.5'
            layoutId={`underline-${keyRef}`}
            style={{
              left: underlineStyle.left,
              width: underlineStyle.width
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 40
            }}
          />
        </TabsList>
      </Tabs>
    </div>
  )
}

export default Tablist
