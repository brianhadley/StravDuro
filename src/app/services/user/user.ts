import { Duro } from "../duro/duro";

export class User {   
  _id: String 
  firstName: String
  lastName: String
  stravaAthleteInfo: {
    userName: String,
    stravaUserId: String
  }
  duros: [Duro]
}

