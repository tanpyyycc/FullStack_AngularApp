export interface GymLeaderModel {
  _id?: string;
  name: string;
  region: 'Kanto' | 'Johto' | 'Hoenn';
  town: string;
  badge: string;
  specialty: string;
  aceLevel: number;
  motto?: string;
}

