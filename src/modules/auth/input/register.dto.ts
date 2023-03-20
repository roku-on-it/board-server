import { LoginDto } from './login.dto';

export enum ProfileType {
  CANDIDATE,
  EMPLOYER,
}

export class RegisterDto extends LoginDto {
  name: string;
  profileType: ProfileType;

  candidateDescription: string;
  candidateEmail: string;
  candidateTechStack: string;
  candidateSalary: number;
  candidatePosition: string;
}
