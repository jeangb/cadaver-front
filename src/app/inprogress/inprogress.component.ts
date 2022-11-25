import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPhrase } from '../models/models.module';
import { SharedService } from './../services/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { catchError, Subscription, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';
import { MatPaginator } from '@angular/material/paginator';

export interface IInprogressArray {
  id: string;
  auteurs: string;
  progress: string;
  remaining: string;
}

@Component({
  selector: 'app-inprogress',
  templateUrl: './inprogress.component.html',
  styleUrls: ['./inprogress.component.css'],
})
export class InprogressComponent implements OnInit {
  phraseData: any;
  dataSource: any;
  displayedColumns = ['id', 'auteurs', 'progress', 'remainingWords'];
  clickedRows = new Set<IInprogressArray>();
  rowsWithCurrentUser = new Array<number>();
  clickEventRefreshInProgress: Subscription;

  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator  | undefined;

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private snackBarService: SnackbarService
  ) {
    this.clickEventRefreshInProgress = this.sharedService
      .getClickRefreshInProgress()
      .subscribe((value) => {
        // this.setPhrase(value);
        this.ngOnInit();
      });
  }

  joinPhrase(idPhrase: string): void {
    console.log('joined ' + idPhrase);
    this.sharedService.sendClickPhraseEvent(idPhrase);
  }

  refresh(): void {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IInprogressArray>();
    this.dataSource.paginator=this.paginator;
    this.http
      .get(`${environment.apiUrl}/api/phrases?full=false`)
      .pipe(
        catchError(() => {
          this.snackBarService.displayMessage(
            `Impossible de récupérer les phrases à compléter. ${environment.msgErrorIdentifyYourself}`
          );
          return throwError(() => new Error('ups sommething happend'));
        })
      )
      .subscribe((data) => {
        // Assign the data to the data source for the table to render
        this.phraseData = data;

        if (this.phraseData == null) {
          this.joinPhrase('');
        } else {
          this.phraseData.forEach((phrase: IPhrase) => {
            let arraysUsernameAuthorsPhrase = new Array<string>();
            let wordsInPhrase = new Array<string>();
            let wordsRemainInPhrase = new Array<string>();

            if (null != phrase.subject) {
              arraysUsernameAuthorsPhrase.push(phrase.subject.user.username);
              wordsInPhrase.push('Sujet');
            } else {
              wordsRemainInPhrase.push('Sujet');
            }
            if (null != phrase.verb) {
              arraysUsernameAuthorsPhrase.push(phrase.verb.user.username);
              wordsInPhrase.push('Verbe');
            } else {
              wordsRemainInPhrase.push('Verbe');
            }
            if (null != phrase.directObject) {
              arraysUsernameAuthorsPhrase.push(
                phrase.directObject.user.username
              );
              wordsInPhrase.push("Complément d'Objet Direct");
            } else {
              wordsRemainInPhrase.push("Complément d'Objet Direct");
            }
            if (null != phrase.circumstantialObject) {
              arraysUsernameAuthorsPhrase.push(
                phrase.circumstantialObject.user.username
              );
              wordsInPhrase.push("Complément d'Objet Circonstantiel.");
            } else {
              wordsRemainInPhrase.push("Complément d'Objet Circonstantiel.");
            }

            let arrayDistinctsUserNames = arraysUsernameAuthorsPhrase.filter(
              (n, i) => arraysUsernameAuthorsPhrase.indexOf(n) === i
            );

            let auteurs = arrayDistinctsUserNames.join(', ');

            let model = {
              id: phrase.id,
              auteurs: auteurs,
              progress: wordsInPhrase.join(', '),
              remainingWords: wordsRemainInPhrase.join(', '),
              isAuthorIn: this.sharedService.isConnectedUserPartOfAuthors(phrase, sessionStorage.getItem('current_user_id')),
            }; //get the model from the form
            this.dataSource.data.push(model);
            this.dataSource.sort = this.sort;
          });
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
