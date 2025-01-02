import { Tour } from '../types/api';

export const generateTourSlug = (tourName: string): string => {
  return tourName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const generateTourUrl = (tour: Tour): string => {
  const slug = generateTourSlug(tour.name);
  return `/tours/${slug}/${tour.tour_code}`;
};

export const extractTourCode = (pathname: string): string | null => {
  const matches = pathname.match(/\/tours\/[^/]+\/([^/]+)/);
  return matches ? matches[1] : null;
};