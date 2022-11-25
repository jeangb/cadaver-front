import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  HttpClient, HttpErrorResponse
} from '@angular/common/http';
import {
  IPhrase,
  IVote
} from '../models/models.module';
import {
  MatTableDataSource
} from '@angular/material/table';
import {
  MatSort
} from '@angular/material/sort';
import {
  environment
} from 'src/environments/environment';
import {
  SharedService
} from './../services/shared.service';
import {
  catchError,
  Subscription,
  throwError
} from 'rxjs';
import {
  SnackbarService
} from '../services/snackbar.service';
import { VoteService } from '../services/vote.service';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  phraseData: any;
  dataSource: any;
  displayedColumns = ['id', 'phrase', 'votes', 'auteurs'];

  clickEventRefreshHistory: Subscription;

  @ViewChild(MatSort, {static: true}) sort: MatSort | undefined;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator  | undefined;

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private snackBarService: SnackbarService,
    private voteService: VoteService
  ) {
    this.clickEventRefreshHistory = this.sharedService
      .getClickRefreshHistory()
      .subscribe((value) => {
        this.ngOnInit();
      });

  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource < any > ();
    this.dataSource.paginator=this.paginator;
    this.http
      .get(`${environment.apiUrl}/api/phrases?full=true&withScore=true`)
      .pipe(
        catchError(() => {
          this.snackBarService.displayMessage(
            `Impossible de récupérer l'historique des phrases. ${environment.msgErrorIdentifyYourself}`
          );
          return throwError(() => new Error('ups sommething happend'));
        })
      )
      .subscribe((data) => {
        // Assign the data to the data source for the table to render
        this.phraseData = data;
        const ids = [];

        this.phraseData.forEach((phraseElement: IPhrase) => {
          let myData = new Array < string > ();
          myData.push(phraseElement.subject.user.username);
          myData.push(phraseElement.verb.user.username);
          myData.push(phraseElement.directObject.user.username);
          myData.push(phraseElement.circumstantialObject.user.username);
          const distinctArray = myData.filter(
            (n, i) => myData.indexOf(n) === i
          );

          let phrase =
            phraseElement.subject.libelle +
            ' ' +
            phraseElement.verb.libelle +
            ' ' +
            phraseElement.directObject.libelle +
            ' ' +
            phraseElement.circumstantialObject.libelle +
            '.';

          let model = {
            id: phraseElement.id,
            phrase: phrase,
            votes: phraseElement.score,
            auteurs: distinctArray.join(', '),
            isAuthorIn: this.sharedService.isConnectedUserPartOfAuthors(phraseElement, sessionStorage.getItem('current_user_id')),
            hasAuthorGaveThumbUp: this.hasAuthorThumbedUpPhrase(sessionStorage.getItem('current_user_id'), phraseElement.listVotes),
            hasAuthorGaveThumbDown: this.hasAuthorThumbedDownPhrase(sessionStorage.getItem('current_user_id'), phraseElement.listVotes),
          }; //get the model from the form
          this.dataSource.data.push(model);
          this.dataSource.sort = this.sort;
        });
      });
  }


  hasAuthorVotedOnPhrase(currentUserId: string | null, listVotes: IVote[]) {
    if (listVotes.length == 0 || currentUserId == null) {
      return false;
    } else {
      return listVotes.filter(function (vote) {
        return vote.voteId.user.id === Number(currentUserId);
      }).length > 0;
    }
  }

  hasAuthorThumbedUpPhrase(currentUserId: string | null, listVotes: IVote[]) {
    return this.hasAuthorVotedForPhraseWithVote(currentUserId, listVotes, 1);
  }

  hasAuthorThumbedDownPhrase(currentUserId: string | null, listVotes: IVote[]) {
    return this.hasAuthorVotedForPhraseWithVote(currentUserId, listVotes, -1);
  }

  hasAuthorVotedForPhraseWithVote(currentUserId: string | null, listVotes: IVote[], voteValue: number) {
    if (listVotes.length == 0 || currentUserId == null) {
      return false;
    } else {
      return listVotes.filter(function (vote) {
        return vote.voteId.user.id === Number(currentUserId) && vote.vote == voteValue;
      }).length > 0;
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refresh(): void {
    this.ngOnInit();
  }

  thumbUp(entry: any) {
    if (null === sessionStorage.getItem('current_user_id')) {
      this.snackBarService.displayMessage(`Impossible de voter. ${environment.msgErrorIdentifyYourself}`);
    } else {

      let idUSer = Number(sessionStorage.getItem('current_user_id'));
      const observer = {
        next: (x: IVote) => {
          this.voteService.deleteVoteById(idUSer, entry.id).subscribe();
        },
        error: (err: HttpErrorResponse) => {
          this.voteService.addVoteById(idUSer, entry.id, 1).subscribe()
        }
      };

      this.voteService.existsByIdAndVoteValue(idUSer, entry.id, 1).subscribe(observer);

      let incrementVote = 0;

      // Update votes button status
      if (entry.hasAuthorGaveThumbUp) {
        entry.hasAuthorGaveThumbUp = false;
        incrementVote = -1;
      } else if (!entry.hasAuthorGaveThumbUp && !entry.hasAuthorGaveThumbDown) {
        entry.hasAuthorGaveThumbUp = true;
        incrementVote = 1;
      } else if (!entry.hasAuthorGaveThumbUp && entry.hasAuthorGaveThumbDown) {
        entry.hasAuthorGaveThumbUp = true;
        incrementVote = 2;
      }
      entry.hasAuthorGaveThumbDown = false;

      // Update score vote
      entry.votes = entry.votes + incrementVote;
    }
  }

  thumbDown(entry: any) {
    if (null === sessionStorage.getItem('current_user_id')) {
      this.snackBarService.displayMessage(`Impossible de voter. ${environment.msgErrorIdentifyYourself}`);
    } else {
      let idUSer = Number(sessionStorage.getItem('current_user_id'));

      const observer = {
        next: (x: IVote) => {
          this.voteService.deleteVoteById(idUSer, entry.id).subscribe();
        },
        error: (err: HttpErrorResponse) => {
          this.voteService.addVoteById(idUSer, entry.id, -1).subscribe()
        }
      };

      this.voteService.existsByIdAndVoteValue(idUSer, entry.id, -1).subscribe(observer);
      let incrementVote = 0;

      // Update votes button status
      if (entry.hasAuthorGaveThumbDown) {
        entry.hasAuthorGaveThumbDown = false;
        incrementVote = 1;
      } else if (!entry.hasAuthorGaveThumbDown && !entry.hasAuthorGaveThumbUp) {
        entry.hasAuthorGaveThumbDown = true;
        incrementVote = -1;
      } else if (!entry.hasAuthorGaveThumbDown && entry.hasAuthorGaveThumbUp) {
        entry.hasAuthorGaveThumbDown = true;
        incrementVote = -2;
      }
      entry.hasAuthorGaveThumbUp = false;

      // Update score vote
      entry.votes = entry.votes + incrementVote;
    }
  }
}
