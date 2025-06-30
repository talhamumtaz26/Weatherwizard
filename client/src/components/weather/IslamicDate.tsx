import React from 'react';

interface IslamicDateProps {
  className?: string;
}

export function IslamicDate({ className = "" }: IslamicDateProps) {
  const getIslamicDate = () => {
    const today = new Date();
    
    // Simple Islamic date calculation (approximate)
    // For production, you'd want to use a proper Islamic calendar library
    const hijriYear = 1446; // Current approximate Hijri year
    const hijriMonths = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ];
    
    // Approximate calculation (for demo purposes)
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const hijriMonth = Math.floor((dayOfYear % 354) / 29.5);
    const hijriDay = Math.floor((dayOfYear % 354) % 29.5) + 1;
    
    return {
      day: hijriDay,
      month: hijriMonths[hijriMonth] || hijriMonths[0],
      year: hijriYear
    };
  };

  const islamicDate = getIslamicDate();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <i className="fas fa-calendar-alt text-purple-400"></i>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {islamicDate.day} {islamicDate.month} {islamicDate.year}
      </span>
    </div>
  );
}