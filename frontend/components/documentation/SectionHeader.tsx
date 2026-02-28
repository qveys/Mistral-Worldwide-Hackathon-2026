import React from 'react';

interface SectionHeaderProps {
  title: string;
  description: string;
}

export const SectionHeader = ({ title, description }: SectionHeaderProps) => (
  <div className="space-y-2 mb-12">
    <h2 className="text-4xl font-black uppercase tracking-tighter italic dark:text-white">
      {title.split(' ')[0]} <span className="text-[#ff4f00]">{title.split(' ')[1] || ''}</span>
    </h2>
    <p className="text-slate-500 font-medium max-w-2xl">{description}</p>
  </div>
);
