import { Pipe, PipeTransform } from '@angular/core';

@Pipe({  name: 'finishedFormattedPhrase'})
export class FinishedFormattedPhrasePipe implements PipeTransform {

  transform(value: String, ...args: unknown[]): unknown {
    const result1 = value.charAt(0).toUpperCase() + value.slice(1)+".";

    return result1;
  }

}
