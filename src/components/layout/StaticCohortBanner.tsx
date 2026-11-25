'use client';

import React from 'react';

interface StudentProfile {
  name: string;
  no: string;
  role: string;
}

const TEAM_PROFILES: StudentProfile[] = [
  { name: 'Alvaro Febryan A.', no: '02', role: 'Lead Dev' },
  { name: 'Marvell Leonard R.', no: '15', role: 'Web Designer' },
  { name: 'Cecilia Leticya', no: '05', role: 'Ecoprint Maker' },
  { name: 'Naomi Felicya A.', no: '17', role: 'Ecoprint Maker' },
];

export function StaticCohortBanner() {
  return (
    <div className="w-full bg-[#161234]/95 border-b border-[#BB9AEF]/20 py-2 px-4 select-none z-30 transition-colors backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-1 text-xs">
        {TEAM_PROFILES.map((student, idx) => (
          <React.Fragment key={student.no}>
            <div className="flex items-center space-x-1.5 font-light">
              <span className="text-[#FFF2B1] font-medium tracking-wide">
                {student.name}
              </span>
              <span className="text-[#FFC8DD] text-[10px] font-mono">
                ({student.no})
              </span>
              <span className="text-[#BB9AEF]/85 text-[10px] uppercase font-mono tracking-tight">
                • {student.role}
              </span>
            </div>
            {idx < TEAM_PROFILES.length - 1 && (
              <span className="w-1 h-1 rounded-full bg-[#BB9AEF]/60 shadow-[0_0_4px_#BB9AEF] hidden sm:inline-block" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
