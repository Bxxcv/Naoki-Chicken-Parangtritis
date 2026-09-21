import { useState } from 'react';
import { IconChevronDown } from './icons.jsx';

export default function Faq({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div className={`faq-item${open ? ' is-open' : ''}`} key={item.q}>
            <button
              type="button"
              className="faq-trigger"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span>{item.q}</span>
              <IconChevronDown size={18} />
            </button>
            {open && <div className="faq-answer">{item.a}</div>}
          </div>
        );
      })}
    </div>
  );
}
