export const RESOURCE_CATEGORIES = [
  'Computer Science',
  'Mathematics',
  'Electronics & IoT',
  'Mechanical & Civil',
  'Management & Economics',
  'Competitive Exams',
  'Community Guides',
];

export const RENTAL_PRICE_SLABS = [
  { min: 1, max: 50, rate: 3, label: '1–50 pages' },
  { min: 51, max: 100, rate: 4, label: '51–100 pages' },
  { min: 101, max: 150, rate: 5, label: '101–150 pages' },
  { min: 151, max: 200, rate: 6, label: '151–200 pages' },
  { min: 201, max: 250, rate: 7, label: '201–250 pages' },
  { min: 251, max: 300, rate: 8, label: '251–300 pages' },
  { min: 301, max: 400, rate: 9, label: '301–400 pages' },
  { min: 401, max: Infinity, rate: 10, label: 'Above 400 pages' },
];

export function getRecommendedDailyRate(pageCount) {
  const pages = Number(pageCount) || 0;
  if (pages <= 0) return 3;
  const slab = RENTAL_PRICE_SLABS.find((s) => pages >= s.min && pages <= s.max);
  return slab ? slab.rate : 10;
}

export function calculateRentalDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export function hasOverlappingDates(existingRentals, newStart, newEnd) {
  const s1 = new Date(newStart).getTime();
  const e1 = new Date(newEnd).getTime();
  return existingRentals.some((rental) => {
    if (!['Accepted', 'Active Rental'].includes(rental.status)) return false;
    const s2 = new Date(rental.startDate).getTime();
    const e2 = new Date(rental.endDate).getTime();
    return s1 < e2 && e1 > s2;
  });
}

export function formatTimestamp(ts) {
  if (!ts) return 'Just now';
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
