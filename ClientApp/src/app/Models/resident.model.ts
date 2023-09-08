export interface Resident {
    id: number;
    name: string;
    surname: string;
    personalCode: string;
    dateOfBirth: Date;
    phone: string;
    email: string;
    isOwner: boolean;
    apartmentId: number;
  }