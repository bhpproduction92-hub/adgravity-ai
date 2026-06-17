'use client';

import React from 'react';

interface MetricProps {
  credits: number;
  maxCredits: number;
  theme: {
    accent: string;
    text: string;
    border: string;
    bg: string;
    gradient: string;
  };
}

export function DashboardMetricsCard({ credits, maxCredits, theme }: MetricProps) {
  const getColorHex = () => {
    switch (theme.accent) {
      case 'emerald': return '#10b981';
      case 'rose': return '#f43f5e';
      case 'amber': return '#f59e0b';
      case 'violet': return '#8b5cf6';
      default: return '#6366f1';
    }
  };

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">Visual Credit Tracker</h3>
        <span className={`text-xs ${theme.text} font-bold`}>Daily Reset</span>
      </div>
      <div className="flex items-baseline gap-1.5 mt-2">
        <span className="text-5xl font-black text-white">{credits}</span>
        <span className="text-lg text-gray-500 font-medium">/ {maxCredits}</span>
      </div>
      <div className="flex flex-col gap-1.5 mt-2">
        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500" 
            style={{ width: `${(credits / maxCredits) * 100}%`, backgroundColor: getColorHex() }}
          />
        </div>
        <span className="text-[10px] text-gray-400 mt-1">
          {credits > 0 ? 'Use your credit to generate bilingual ad copies.' : 'Credits depleted. Start a ₹1 trial to replenish!'}
        </span>
      </div>
    </div>
  );
}

interface CalendarProps {
  theme: {
    accent: string;
    text: string;
    border: string;
    bg: string;
    gradient: string;
  };
}

export function DashboardCalendarCard({ theme }: CalendarProps) {
  // Mock Calendar Posts Data
  const calendarPosts = [
    { day: 12, name: 'Assam Medicose Ad', status: 'published', type: 'Vernacular' },
    { day: 16, name: 'Cafe Guwahati Intro', status: 'published', type: 'Bilingual' },
    { day: 17, name: 'Special Weekend Discount', status: 'pending', type: 'Reel' },
    { day: 24, name: 'Monsoon Mega Sale', status: 'scheduled', type: 'Image' }
  ];

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
      <div>
        <h3 className="text-lg font-bold text-white">Post History Calendar</h3>
        <p className="text-gray-400 text-xs mt-1">
          Track your active, pending, and scheduled campaigns.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center text-xs text-gray-400 font-semibold px-2">
          <span>June 2026</span>
          <span className="flex gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Published</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Pending</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Scheduled</span>
          </span>
        </div>

        {/* Grid 7 Columns for Days */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="text-gray-505 font-bold py-1">{day}</div>
          ))}
          
          {Array.from({ length: 30 }).map((_, index) => {
            const day = index + 1;
            const activePost = calendarPosts.find((p) => p.day === day);
            
            return (
              <div 
                key={day} 
                className={`aspect-square rounded-lg flex flex-col items-center justify-between p-1.5 relative border ${
                  activePost?.status === 'published' ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' :
                  activePost?.status === 'pending' ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' :
                  activePost?.status === 'scheduled' ? `bg-${theme.accent}-950/20 border-${theme.accent}-500/30 text-${theme.accent}-300` :
                  'bg-white/[0.01] border-white/5 text-gray-500 hover:bg-white/5'
                }`}
              >
                <span className="font-semibold self-start text-[10px]">{day}</span>
                {activePost && (
                  <div className="w-1.5 h-1.5 rounded-full bg-current absolute bottom-1.5 right-1.5" title={activePost.name} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
