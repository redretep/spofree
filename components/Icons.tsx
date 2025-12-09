
import React from 'react';

export const CsvFileIcon = ({size=24, className=""}: {size?: number, className?: string}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M8 13h.01" />
      <path d="M8 17h.01" />
      <path d="M12 13h.01" />
      <path d="M12 17h.01" />
      <path d="M16 13h.01" />
      <path d="M16 17h.01" />
    </svg>
);
