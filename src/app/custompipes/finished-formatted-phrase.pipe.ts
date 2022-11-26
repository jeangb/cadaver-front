import { Pipe, PipeTransform } from '@angular/core';
import { IPhrase } from '../models/models.module';

@Pipe({  name: 'finishedFormattedPhrase'})
export class FinishedFormattedPhrasePipe implements PipeTransform {

  transform(phraseElement: IPhrase, ...args: unknown[]): unknown {
    let phrase =
            phraseElement.subject.libelle +
            ' ' +
            phraseElement.verb.libelle +
            ' ' +
            phraseElement.directObject.libelle +
            ' ' +
            phraseElement.circumstantialObject.libelle;
    
    const formattedPhrase = phrase.charAt(0).toUpperCase() + phrase.slice(1)+".";

    return formattedPhrase;
  }

}
