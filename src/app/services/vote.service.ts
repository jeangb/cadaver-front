import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { IPhrase, IUser, IVote, IVoteId } from '../models/models.module';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  constructor(
    private http: HttpClient
  ) { }

  getVoteById(userId: Number, phraseId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/votes/`+userId+`/`+phraseId, {});
  }

  deleteVoteById(userId: number, phraseId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/votes/`+userId+`/`+phraseId, {});
  }

  existsByIdAndVoteValue(userId: number, phraseId: string, voteValue: Number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/votes/exists/`+userId+`/`+phraseId+`/`+voteValue, {});
  }

  addVoteById(userId: number, phraseId: string, voteValue: Number): Observable<any> {
    let voteId = {} as IVoteId
    let phrase = {} as IPhrase;
    let user = {} as IUser;
    phrase.id=phraseId;
    user.id=userId;

    voteId.user=user;
    voteId.phrase=phrase;
    let vote: Number=voteValue;

    return this.http.post(`${environment.apiUrl}/api/votes`, {
      voteId,
      vote
    });
  }
}
