export const WEEKDAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'] as const;

export const SCHOOL_MONTHS = [
  { label: 'July 2026', year: 2026, month: 7 },
  { label: 'August 2026', year: 2026, month: 8 },
  { label: 'September 2026', year: 2026, month: 9 },
  { label: 'October 2026', year: 2026, month: 10 },
  { label: 'November 2026', year: 2026, month: 11 },
  { label: 'December 2026', year: 2026, month: 12 },
] as const;

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

export const formatCampusDate = (year: number, month: number, day: number) => {
  const name = MONTH_NAMES[month - 1] ?? 'Month';
  return `${name} ${String(day).padStart(2, '0')} ${year}`;
};

export const isSchoolDate = (year: number, month: number, day: number) =>
  SCHOOL_MONTHS.some((item) => item.year === year && item.month === month) &&
  day >= 1 &&
  day <= daysInMonth(year, month);

export const buildMonthWeeks = (year: number, month: number) => {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks: Array<Array<number | null>> = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  return weeks;
};
