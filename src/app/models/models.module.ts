import { NgModule } from '@angular/core';
import { CommonModule, LocationChangeEvent } from '@angular/common';

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  token: string;
}

export interface IWord {
  id: string;
  libelle: string;
  user: IUser;
}

export interface IPhrase {
  id: string;
  subject: IWord;
  directObject: IWord;
  circumstantialObject: IWord;
  verb: IWord;
  score:number;
  listVotes: IVote[];
}

export interface IVote {
  voteId: IVoteId;
  vote: Number;
}

export interface IVoteId {
  user: IUser;
  phrase: IPhrase;
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ModelsModule {

 }
