import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Home, Moon, Sun, Box, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocCategory, NavItem } from './constants';
import { NAV_SECTIONS } from './constants';

interface SidebarProps {
  activeCategory: DocCategory;
  onCategoryChange: (id: DocCategory) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const navButtonBase =
  'w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group overflow-hidden';
const navButtonActive =
  'bg-blue-600 text-white shadow-xl shadow-blue-500/20 scale-[1.02]';
const navButtonInactive =
  'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300';

function NavItemButton({
  item,
  label,
  desc,
  isActive,
  onClick,
  isCollapsed,
}: {
  item: NavItem;
  label: string;
  desc: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        navButtonBase,
        isActive ? navButtonActive : navButtonInactive,
        isCollapsed && "justify-center px-0"
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon
        size={18}
        className={cn(
          isCollapsed ? "" : "mt-0.5",
          isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
        )}
      />
      {!isCollapsed && (
        <div className="flex flex-col whitespace-nowrap">
          <span className="font-black uppercase tracking-tighter italic text-[11px]">
            {label}
          </span>
          <span
            className={cn(
              'text-[9px] font-medium opacity-70 leading-none mt-1',
              isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
            )}
          >
            {desc}
          </span>
        </div>
      )}
      {isActive && !isCollapsed && <ChevronRight size={14} className="ml-auto" />}
    </button>
  );
}

export const Sidebar = ({
  activeCategory,
  onCategoryChange,
  isDarkMode,
  onToggleTheme,
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const t = useTranslations('doc');

  return (
    <aside className={cn(
      "h-screen sticky top-0 border-r-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-4 flex flex-col gap-8 z-20 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-80"
    )}>
      <div className={cn("flex items-center gap-3 px-2", isCollapsed ? "justify-center" : "justify-between")}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Box size={18} />
          </div>
          {!isCollapsed && (
            <div className="whitespace-nowrap">
              <h1 className="text-sm font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
                {t('echoMaps')}
              </h1>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest">
                {t('documentation')}
              </p>
            </div>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? t('sidebarExpand') : t('sidebarCollapse')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors"
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto overflow-x-hidden no-scrollbar">
        {NAV_SECTIONS.map((section) => (
          <nav key={section.titleKey} className="space-y-1">
            {!isCollapsed && (
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 mb-2 whitespace-nowrap">
                {t(section.titleKey)}
              </p>
            )}
            {section.items.map((item) => (
              <NavItemButton
                key={item.id}
                item={item}
                label={t(item.labelKey)}
                desc={t(item.descKey)}
                isActive={activeCategory === item.id}
                onClick={() => onCategoryChange(item.id)}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
        ))}
      </div>

      <div className="pt-6 border-t-2 border-slate-300 dark:border-slate-600 space-y-4 overflow-hidden">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 group overflow-hidden",
            isCollapsed && "justify-center px-0"
          )}
        >
          <Home size={18} className="flex-shrink-0 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          {!isCollapsed && (
            <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              {t('backHome')}
            </span>
          )}
        </Link>
        <button
          onClick={onToggleTheme}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 overflow-hidden",
            isCollapsed && "justify-center px-0"
          )}
        >
          {!isCollapsed && (
            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
              {isDarkMode ? t('themeDark') : t('themeLight')}
            </span>
          )}
          {isDarkMode ? <Sun size={16} className="flex-shrink-0" /> : <Moon size={16} className="flex-shrink-0" />}
        </button>
      </div>
    </aside>
  );
};
