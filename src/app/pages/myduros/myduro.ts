import { UserDuroResults } from "src/app/services/results/user-duro-results";
import { DuroParticipant } from "src/app/services/results/duro-participant";

export class MyDuro {
  constructor(userDuroResults: UserDuroResults) {
    this.myDuroName = userDuroResults.duroName;
    let duroParticipants: DuroParticipant[] = userDuroResults.duroParticipants;
    let myResult: DuroParticipant = duroParticipants.find(
      item => (item.isCurrentUser = true)
    );
    this.myDuroRank = myResult.rank + ' of ' + duroParticipants.length;
    this.myDuroTime = myResult.overallTime;
    this.duroId = userDuroResults.duroId;
  }
  myDuroName: string;
  myDuroRank: string;
  myDuroTime: number;
  duroId: string;
}

export class MyDuros {
  myDuros: MyDuro[];

  constructor(userResults: UserDuroResults[]) {
    if (userResults) {
      console.log('making user duro results',userResults);
      this.myDuros = userResults.map(duro => {
        let myDuro: MyDuro = new MyDuro(duro);
        return myDuro;
      });
    }
    console.log('contents of myDuros', this.myDuros);
  }
}
