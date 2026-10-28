export type Region = 'Kanto' | 'Johto' | 'Hoenn';

export interface GymLeader {
  _id?: string;
  name: string;
  region: Region;
  town: string;
  badge: string;
  specialty: string;
  aceLevel: number;
  motto?: string;
}