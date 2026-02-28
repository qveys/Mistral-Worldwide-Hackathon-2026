interface SectionHeaderProps {
  title: string;
  description: string;
}

export const SectionHeader = ({ title, description }: SectionHeaderProps) => (
  <div className="space-y-3 mb-14">
    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white drop-shadow-sm">
      {title.split(' ')[0]} <span className="text-[#ff4f00]">{title.split(' ')[1] || ''}</span>
    </h2>
    <p className="text-slate-700 dark:text-slate-200 font-medium max-w-2xl leading-relaxed text-base">{description}</p>
  </div>
);
