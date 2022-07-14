import {
  HttpClient
} from '@angular/common/http';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  catchError,
  throwError
} from 'rxjs';
import {
  environment
} from 'src/environments/environment';
import {
  SharedService
} from '../services/shared.service';
import {
  SnackbarService
} from '../services/snackbar.service';

@Component({
  selector: 'app-randomgenerator',
  templateUrl: './randomgenerator.component.html',
  styleUrls: ['./randomgenerator.component.css']
})
export class RandomgeneratorComponent implements OnInit {

  generatedPhrase: any = "";

  constructor(
    private http: HttpClient,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {}

  generate(): void {

    const headers = {
      'Content-Type': 'text',
    };

    this.http
      .get(`${environment.apiUrl}/api/phrases/generaterandom`, {
        headers
      })
      .pipe(
        catchError(() => {
          this.generatedPhrase = null;
          this.snackBarService.displayMessage(
            `Impossible de générer une phrase aléatoirement. ${environment.msgErrorIdentifyYourself}`
          );
          return throwError(() => new Error('ups sommething happend'));
        })
      )
      .subscribe(response => {
        this.generatedPhrase = response;
      });
  }

}
