import { Pipe, PipeTransform } from '@angular/core';
import { IPhrase } from '../models/models.module';

@Pipe({  name: 'finishedFormattedPhrase'})
export class FinishedFormattedPhrasePipe implements PipeTransform {

  transform(phraseElement: IPhrase, ...args: unknown[]): unknown {
    let formattedSubject = phraseElement.subject.libelle.charAt(0).toUpperCase()
    + phraseElement.subject.libelle.slice(1);

    let formattedVerb=phraseElement.verb.libelle.charAt(0).toLowerCase()
    + phraseElement.verb.libelle.slice(1);

    let directObject=phraseElement.directObject.libelle;

    let formattedCircumstantialObject=phraseElement.circumstantialObject.libelle.charAt(0).toLowerCase()
    + phraseElement.circumstantialObject.libelle.slice(1);    
    let phrase = formattedSubject + ' ' +
      formattedVerb +
      ' ' +
      directObject +
      ' ' +
      formattedCircumstantialObject
      +'.';
    
    return phrase;
  }

}
