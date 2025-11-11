'use client';

import { useState } from 'react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* TODO: Implement mobile navigation */}
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
    </div>
  );
}
