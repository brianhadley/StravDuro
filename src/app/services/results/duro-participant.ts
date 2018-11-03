import { DuroResult } from "./duro-result";

export class DuroParticipant {
    userId: string; 
    userName: string; 
    isCurrentUser: boolean; 
    overallTime: number;
    results: DuroResult[];
    rank: number;
}