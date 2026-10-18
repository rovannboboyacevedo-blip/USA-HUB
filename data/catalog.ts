import type { CampusEvent, Organization, Recommendation } from '@/types/models';

export const INTERESTS = [
  'Computer Networking',
  'Java Programming',
  'Cybersecurity Frameworks',
  'System Architecture',
  'Tamiya Mini 4WD Building',
  'Minimalist Graphic Design',
] as const;

export const ROLE_OPTIONS = [
  { value: 'IT Intern', label: 'IT Intern / Technical Support' },
  { value: 'Undergraduate Student', label: 'Undergraduate Student' },
  { value: 'Organization Representative', label: 'Organization Representative' },
  { value: 'Alumni Practitioner', label: 'Alumni Practitioner' },
] as const;

export const eventsData: CampusEvent[] = [
  {
    id: 'e1',
    lines: ['Opening', 'Week', 'University', 'Week'],
    name: 'University Opening Week',
    author: 'USA Student Government',
    description:
      'Welcome back Augustinians! Join us for a week full of fun games, booth exhibitions, and student interaction events.',
    date: 'July 09 2026',
    time: '8:00 AM to 5:00 PM',
    venue: 'Campus Grounds',
    crowd: 'Crowded',
    image: require('../assets/images/opening-week.jpg'),
    year: 2026,
    month: 7,
    day: 9,
  },
  {
    id: 'e2',
    lines: ['Alternative', 'Class', 'USA Event'],
    name: 'Alternative Learning Classes',
    author: 'USA Student Government',
    description:
      'Expand your horizons beyond the standard curriculum with specialized tech and creative arts seminars hosted by industry veterans.',
    date: 'August 07 2026',
    time: '1:00 PM to 4:00 PM',
    venue: 'USA Auditorium',
    crowd: 'Moderate',
    image: require('../assets/images/alternative-class.jpg'),
    year: 2026,
    month: 8,
    day: 7,
  },
  {
    id: 'e3',
    lines: ['University', 'Best', 'Dance', 'Crew'],
    name: 'University Best Dance Crew 2026',
    author: 'University Dance Crew',
    description:
      'The ultimate campus dance battle returns! Watch student groups compete for supremacy and major trophy honors.',
    date: 'March 17 2027',
    time: '6:00 PM to 9:00 PM',
    venue: 'USA Gymnasium',
    crowd: 'Very Crowded',
    image: require('../assets/images/dance-crew.jpg'),
  },
  {
    id: 'e4',
    lines: ['Thank', 'God Its', 'Friday'],
    name: "Thank God It's Friday Mixers",
    author: 'USA Student Government',
    description:
      'Unwind from a grueling week of exams with casual student acoustic sessions and free coffee lounges.',
    date: 'Every Friday',
    time: '4:00 PM to 7:00 PM',
    venue: 'Student Center Plaza',
    crowd: 'Light',
    image: require('../assets/images/friday-mixers.jpg'),
  },
  {
    id: 'e5',
    lines: ['Battle', 'Of The', 'Bands'],
    name: 'USA Battle of the Bands',
    author: 'Conservatory Music Society',
    description:
      'Rock out to spectacular live original music arrangements performed entirely by homegrown student bands.',
    date: 'TBD',
    time: '5:00 PM onwards',
    venue: 'Gymnasium Court',
    crowd: 'Very Crowded',
    image: require('../assets/images/battle-of-the-bands.jpg'),
  },
];

export const universityOrgs: Organization[] = [
  {
    id: 'u1',
    title: 'Sage Esports',
    category: 'Esports & Entertainment',
    color: 'red',
    bio: 'The premier gaming hub representing San Agustin in competitive collegiate leagues nationwide.',
    kind: 'university',
  },
  {
    id: 'u2',
    title: 'USA Little Theatre',
    category: 'Acting & Entertainment',
    color: 'cream',
    bio: 'Fostering exceptional acting and stage production talents across generations of local campus artists.',
    kind: 'university',
  },
  {
    id: 'u3',
    title: 'USA Peer Facilitators',
    category: 'Health & Peer Support',
    color: 'purple',
    bio: 'Providing peer guidance counseling and wellness workshops to look after student welfare.',
    kind: 'university',
  },
  {
    id: 'u4',
    title: 'Unistarz',
    category: 'Dance & Entertainment',
    color: 'green',
    bio: 'The official elite street-dance ambassadors delivering high-octane stage performances year round.',
    kind: 'university',
  },
];

export const courseOrgs: Organization[] = [
  {
    id: 'c1',
    title: 'CAS Student Corps',
    category: 'CAS Focus Org',
    color: 'cyan',
    bio: 'The organizing core serving liberal arts and social sciences student portfolios.',
    kind: 'course',
    college: 'CLASE',
  },
  {
    id: 'c2',
    title: 'Psych Society',
    category: 'Psych Course Org',
    color: 'orange',
    bio: 'Dedicated to advancing research and student awareness in the psychological fields.',
    kind: 'course',
    college: 'CLASE',
  },
  {
    id: 'c3',
    title: 'Holotech',
    category: 'CSIT Focus Org',
    color: 'pink',
    bio: 'Connecting software engineers, system admins, and information security buffs together.',
    kind: 'course',
    college: 'CPMT',
  },
  {
    id: 'c4',
    title: 'USA Innovators',
    category: 'Creative Tech Club',
    color: 'darkgreen',
    bio: 'A project sandbox incubation network designed to bring app ideas into the real world.',
    kind: 'course',
    college: 'CPMT',
  },
  {
    id: 'c5',
    title: 'Junior Accountants',
    category: 'COB Focus Group',
    color: 'red',
    bio: 'Nurturing accounting practitioners with comprehensive test preparation and masterclasses.',
    kind: 'course',
    college: 'COB',
  },
  {
    id: 'c6',
    title: 'Business Elite',
    category: 'Management Club',
    color: 'purple',
    bio: 'Developing entrepreneurship mindsets and corporate strategies for prospective global leaders.',
    kind: 'course',
    college: 'COB',
  },
  {
    id: 'c7',
    title: 'Design Network',
    category: 'Creative Arts Dept',
    color: 'cream',
    bio: 'Multimedia professionals working on campus marketing campaigns and graphic assets.',
    kind: 'course',
    college: 'COT',
  },
  {
    id: 'c8',
    title: 'Eco Warriors',
    category: 'Sustainability Corps',
    color: 'grey',
    bio: 'Pioneering recycling drives and carbon reduction initiatives around the community grounds.',
    kind: 'course',
    college: 'CNND',
  },
  {
    id: 'c9',
    title: 'SHS Augustinian Council',
    category: 'Senior High Council',
    color: 'cyan',
    bio: 'The senior high council coordinating strand activities, homeroom programs, and campus welcome drives.',
    kind: 'course',
    college: 'SHS',
  },
];

export const recommendations: Recommendation[] = [
  {
    id: 'rec-eagles',
    name: 'San Agustin Golden Eagles',
    meta: 'By: Sage Esports\nCategory: Esports & Entertainment',
    color: 'red',
    orgId: 'u1',
  },
  {
    id: 'rec-unistarz',
    name: 'Unistarz',
    meta: 'By: University Dance Crew\nCategory: Entertainment',
    color: 'green',
    orgId: 'u4',
  },
];

export const activityLogs = [
  'Checked into Alternative Learning Classes (Aug 2026)',
  'Bookmarked University Best Dance Crew',
  'Submitted application file to Holotech Org Hub',
];

export const findEvent = (id: string) => eventsData.find((event) => event.id === id);

export const findOrganization = (id: string) =>
  [...universityOrgs, ...courseOrgs].find((org) => org.id === id);

export const findEventForDay = (year: number, month: number, day: number) =>
  eventsData.find((event) => event.year === year && event.month === month && event.day === day);
