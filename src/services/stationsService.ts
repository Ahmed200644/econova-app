import { Station } from '../types';

export const MOCK_STATIONS: Station[] = [
  {
    id: 'st-001',
    name: 'EcoNova Main Hub',
    code: 'ST-101',
    distanceMeters: 120,
    status: 'open',
    locationName: 'Faculty of Science Main Gate · Luxor University',
    acceptedMaterials: ['plastic', 'paper', 'metal', 'ewaste'],
    isAvailable: true,
  },
  {
    id: 'st-002',
    name: 'Engineering Block B Station',
    code: 'ST-102',
    distanceMeters: 350,
    status: 'open',
    locationName: 'Faculty of Engineering Courtyard · Luxor University',
    acceptedMaterials: ['plastic', 'metal', 'ewaste'],
    isAvailable: true,
  },
  {
    id: 'st-003',
    name: 'Student Union Recycling Station',
    code: 'ST-103',
    distanceMeters: 520,
    status: 'open',
    locationName: 'Student Activities Complex · Luxor University',
    acceptedMaterials: ['plastic', 'paper'],
    isAvailable: true,
  },
  {
    id: 'st-004',
    name: 'Central Library Station',
    code: 'ST-104',
    distanceMeters: 780,
    status: 'closed',
    closingTime: 'Closes at 4:00 PM',
    locationName: 'University Library East Entrance',
    acceptedMaterials: ['paper', 'plastic'],
    isAvailable: false,
  },
];

export const getStationByCode = (code: string): Station | undefined => {
  const normalized = code.trim().toUpperCase();
  return MOCK_STATIONS.find(
    (s) => s.code.toUpperCase() === normalized || s.id.toUpperCase() === normalized
  );
};

export const getStationById = (id: string): Station | undefined => {
  return MOCK_STATIONS.find((s) => s.id === id);
};
