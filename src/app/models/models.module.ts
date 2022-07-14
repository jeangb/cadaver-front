import { NgModule } from '@angular/core';
import { CommonModule, LocationChangeEvent } from '@angular/common';

export interface IUser {
  id: number;
  login: string;
  email: string;
}

export interface IWord {
  id: string;
  libelle: string;
  user: IUser;
}

export interface IPhrase {
  id: string;
  subject: IWord;
  verb: IWord;
  directObject: IWord;
  circumstantialObject: IWord;
}


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ModelsModule {

 }
