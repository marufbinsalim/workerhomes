import { Icon } from '@iconify/react'
import React, { useState, useId } from 'react'

function Accordion({ title, children, open = false }) {
  const [isOpen, setIsOpen] = useState(open)
  const htmlId = useId()

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='accordion-container'>
      <div className='accordion-header' onClick={toggleAccordion}>
        <h6>{title}</h6>
        <button
          className={`accordion-button ${isOpen ? 'open' : 'closed'}`}
          aria-expanded={isOpen}
          aria-controls={htmlId}
          onClick={toggleAccordion}
        >
          <Icon
            icon={
              !isOpen ? 'akar-icons:chevron-down' : 'flowbite:minus-outline'
            }
          />
        </button>
      </div>
      <div
        id={htmlId}
        className={`accordion-content ${isOpen ? 'open' : 'closed'}`}
      >
        {children}
      </div>
    </div>
  )
}

export default Accordion
