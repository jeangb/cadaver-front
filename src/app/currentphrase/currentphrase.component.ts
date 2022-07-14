import { Component, OnInit } from '@angular/core';
import { SharedService } from './../services/shared.service';
import { catchError, Subscription, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IPhrase } from '../models/models.module';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-currentphrase',
  templateUrl: './currentphrase.component.html',
  styleUrls: ['./currentphrase.component.css']
})
export class CurrentphraseComponent implements OnInit {
  clickEventPhraseSelected:Subscription;
  clickEventLogin:Subscription;
  
  phrase: any;
  stepWord='Sujet';
  currentWordValue: any;
  userAuthorizedToEditCurrentPhrase: boolean = false;
  idPhrase: string | null = '';
  connectedUserId: number =Number(sessionStorage.getItem("current_user_id"));
  helpVisible=false;
  constructor(private http: HttpClient, private sharedService:SharedService,private snackBarService: SnackbarService) {
    this.clickEventPhraseSelected=    this.sharedService.getClickPhraseEvent().subscribe((value)=>{
      this.setPhrase(value);
      this.connectedUserId=Number(sessionStorage.getItem("current_user_id"));
    })
    
    this.clickEventLogin=    this.sharedService.getClickLoginEvent().subscribe((value)=>{
      this.connectedUserId= value;
    })
    
  }
  
  ngOnInit(): void {
  }
  
  
  /**
  * Récupération de la phrase en cours.
  * @param id id de la phrase
  */
  setPhrase(id: string | null){
    if (null != id) {
      this.idPhrase=id;
      this.http.get<IPhrase>(`${environment.apiUrl}/api/phrases/`+id)
      .pipe(
        catchError(() => {
          this.snackBarService.displayMessage(`Impossible de récupérer la phrase à compléter. ${environment.msgErrorIdentifyYourself}`);
          return throwError(() => new Error('ups sommething happend'));
        })
      )
      .subscribe(data => {
        this.phrase=data;
        console.log(this.phrase);
        this.stepWord=this.sharedService.getNextStepFromPhrase(this.phrase);
        console.log(this.stepWord);
        this.userAuthorizedToEditCurrentPhrase=this.sharedService.isUserAuthorizedToEditPhrase(this.phrase, this.connectedUserId);
      });
    } else {
      this.idPhrase=null;
      this.stepWord="Sujet";
      this.userAuthorizedToEditCurrentPhrase=true;
    }
  }
  
  async validateCurrentWord(word: string){
    let postId: string;
    if (word.trim() !=='') {
      if (this.idPhrase === null){
        this.sharedService.postNewPhrase(word, this.connectedUserId);
      } else {
        this.sharedService.updatePhrase(this.phrase, word, this.stepWord, this.connectedUserId);
      }
    } else {
        this.snackBarService.displayMessage("Le mot entré ne doit pas être vide.");
    }

    
  }

  refresh(): void {
    this.setPhrase(this.idPhrase);
  }
}

