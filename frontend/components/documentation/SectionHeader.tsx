import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description: string;
  className?: string;
  accentColor?: string;
}

export const SectionHeader = ({ 
  title, 
  description, 
  className,
  accentColor = "text-blue-600 dark:text-blue-400"
}: SectionHeaderProps) => (
  <div className={cn("space-y-3 mb-10", className)}>
    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white drop-shadow-sm leading-tight">
      {title.split(' ')[0]} <span className={accentColor}>{title.split(' ').slice(1).join(' ') || ''}</span>
    </h2>
    <p className="text-slate-600 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed text-base italic">{description}</p>
  </div>
);
