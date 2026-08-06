// Enterprise type definitions

export interface Enterprise {
  id: string;
  name: string;
  shortCode: string;
  badge: string;
  badgeType: 'primary' | 'teal' | 'gray' | 'warning' | string;
  studentCount: number;
  activeThisWeek: boolean;
  contactEmail: string;
  location: string;
  status: string;
  field: string;
  contactPerson: string;
  contactPhone: string;
  website: string;
  openPositions?: string[];
  capacity: number;
  rating: number;
  hasStipend: boolean;
  isHiring: boolean;
  isPriority: boolean;
  updatedAt?: string;
}
