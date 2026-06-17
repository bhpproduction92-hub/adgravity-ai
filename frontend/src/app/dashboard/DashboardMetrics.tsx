'use client';

import React from 'react';

interface MetricProps {
  credits: number;
  maxCredits: number;
}

export function DashboardMetricsCard({ credits, maxCredits }: MetricProps) {
  const percentage = (credits / maxCredits) * 100;

  return (
    <div className="bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-slate-100/80 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold tracking-wider text-text-secondary uppercase">Visual Credit Tracker</h3>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-custom/10 text-accent-custom">
          Daily Reset
        </span>
      </div>
      
      <div className="flex flex-col gap-1 mt-2">
        <span className="text-lg font-black text-text-primary">
          Credits Remaining Today: {credits}/{maxCredits}
        </span>
        <span className="text-xs text-text-secondary">
          Remaining balance for automated campaigns.
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div className="w-full h-3 bg-bg-primary border border-border-custom rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent-custom transition-all duration-500 rounded-full" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-[10px] text-text-secondary">
          {credits > 0 ? 'Use your credit to generate bilingual ad copies.' : 'Credits depleted. Start a ₹1 trial to replenish!'}
        </span>
      </div>
    </div>
  );
}

export function DashboardCalendarCard() {
  // Mock Calendar Posts Data
  const calendarPosts = [
    { day: 12, name: 'Assam Medicose Ad', status: 'published', type: 'Vernacular' },
    { day: 16, name: 'Cafe Guwahati Intro', status: 'published', type: 'Bilingual' },
    { day: 17, name: 'Special Weekend Discount', status: 'pending', type: 'Reel' },
    { day: 24, name: 'Monsoon Mega Sale', status: 'scheduled', type: 'Image' }
  ];

  return (
    <div className="bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-slate-100/80 rounded-2xl p-6 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
      <div>
        <h3 className="text-base font-bold text-text-primary font-heading">Post History Calendar</h3>
        <p className="text-text-secondary text-xs mt-1">
          Track your active, pending, and scheduled campaigns.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-text-secondary font-semibold px-1">
          <span className="text-text-primary font-bold">June 2026</span>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Published</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-accent-custom" /> Scheduled</span>
          </div>
        </div>

        {/* Grid 7 Columns for Days */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="text-text-secondary font-bold py-1 select-none">{day}</div>
          ))}
          
          {Array.from({ length: 30 }).map((_, index) => {
            const day = index + 1;
            const activePost = calendarPosts.find((p) => p.day === day);
            
            return (
              <div 
                key={day} 
                className={`aspect-square rounded-xl flex flex-col items-center justify-between p-1.5 relative border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] ${
                  activePost?.status === 'published' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold' :
                  activePost?.status === 'pending' ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold' :
                  activePost?.status === 'scheduled' ? 'bg-accent-custom/10 border-accent-custom/30 text-accent-custom font-bold' :
                  'bg-bg-primary border-border-custom text-text-secondary hover:border-text-secondary/30'
                }`}
              >
                <span className="text-[10px] self-start select-none">{day}</span>
                {activePost && (
                  <div className="w-2 h-2 rounded-full bg-current absolute bottom-1.5 right-1.5" title={activePost.name} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
