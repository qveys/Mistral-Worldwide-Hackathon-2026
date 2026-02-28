'use client';

import React, { useEffect, useState } from 'react';
import { History, ArrowRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  date: string;
}

export function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('echomaps-recent');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      setProjects([
        { id: 'demo-1', title: 'Architecture Microservices', date: 'Il y a 2h' },
        { id: 'demo-2', title: 'Lancement Produit Q3', date: 'Hier' }
      ]);
    }
  }, []);

  if (projects.length === 0) return null;

  return (
    <div className="w-full max-w-sm space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <History size={12} />
          Projets Récents
        </h3>
      </div>
      
      <div className="space-y-2">
        {projects.map((project) => (
          <a
            key={project.id}
            href={`/project/${project.id}`}
            className="group flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl hover:border-black dark:hover:border-white transition-all duration-300"
          >
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#ff4f00] transition-colors">
                {project.title}
              </span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                {project.date}
              </span>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
          </a>
        ))}
      </div>
    </div>
  );
}
