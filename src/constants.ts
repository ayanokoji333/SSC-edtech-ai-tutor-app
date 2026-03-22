export interface Course {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  progress: number;
  category: string;
  previewUrl?: string;
  stats?: string;
}

export const COURSES: Course[] = [
  {
    id: "1",
    title: "Mastering Number Systems for SSC CGL",
    thumbnail: "https://picsum.photos/seed/math/1280/720",
    duration: "1h 12m",
    progress: 65,
    category: "Mathematics",
    stats: "High Yield Topic"
  },
  {
    id: "2",
    title: "Data Interpretation: Crash Course",
    thumbnail: "https://picsum.photos/seed/data/1280/720",
    duration: "45m",
    progress: 0,
    category: "Reasoning",
    stats: "4 hours left"
  },
  {
    id: "3",
    title: "English Grammar: The Ultimate Guide",
    thumbnail: "https://picsum.photos/seed/english/1280/720",
    duration: "2h 30m",
    progress: 10,
    category: "English",
    stats: "Trending"
  },
  {
    id: "4",
    title: "General Awareness: Current Affairs Oct",
    thumbnail: "https://picsum.photos/seed/news/1280/720",
    duration: "1h 5m",
    progress: 0,
    category: "GK",
    stats: "New"
  },
  {
    id: "5",
    title: "Advanced Geometry for Tier 2",
    thumbnail: "https://picsum.photos/seed/geo/1280/720",
    duration: "3h 15m",
    progress: 85,
    category: "Mathematics",
    stats: "Critical"
  }
];

export const MOCK_TESTS = [
  { id: "m1", title: "SSC CGL Tier 1: All India Open Mock", date: "OCT 24", time: "10:00 AM", registered: "25k+" },
  { id: "m2", title: "Quantitative Aptitude: Sectional", date: "OCT 26", time: "All Day", registered: "12k+" }
];
