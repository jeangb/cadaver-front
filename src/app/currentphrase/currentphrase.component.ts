import { Component, OnInit } from '@angular/core';
import { SharedService } from './../services/shared.service';
import { catchError, Subscription, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IPhrase } from '../models/models.module';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../services/snackbar.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  userAuthorizedToEditCurrentPhrase: boolean = false;
  userConnected: boolean = false;
  idPhrase: string | null = '';
  connectedUserId: number =Number(sessionStorage.getItem("current_user_id"));

  wordValidRegex = "^[ 'a-zA-ZÀ-ÿ0-9\u00f1\u00d1-]*$";

  wordForm = new FormGroup({
    wordinput: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(this.wordValidRegex)])
  });
  
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

  get wordinputControl(): FormControl {
    return this.wordForm.get('wordinput') as FormControl;
  }

  async validateCurrentWord(){

    if (this.wordinputControl.errors){
      if (this.wordinputControl.errors['required']) {
        this.snackBarService.displayMessage("Le mot entré ne doit pas être vide.");
      }
      // nothing to do
    } else {
      let word: string | null="";
      word = this.wordForm.get('wordinput')!.value;
      if (null!=word && word.trim() !=='') {
        if (this.idPhrase === null){
          this.sharedService.postNewPhrase(word, this.connectedUserId);
        } else {
          this.sharedService.updatePhrase(this.phrase, word, this.stepWord, this.connectedUserId);
        }
      } else {
          this.snackBarService.displayMessage("Le mot entré ne doit pas être vide.");
      }
      this.wordForm.reset();
    }
  }

  /**
  * Récupération de la phrase en cours.
  * @param id id de la phrase
  */
  setPhrase(id: string | null){
    this.wordForm.reset();
    if (null != id) {
      this.idPhrase=id;
      this.http.get<IPhrase>(`${environment.apiUrl}/api/phrases/`+id)
      .pipe(
        catchError(() => {
          this.snackBarService.displayMessage(`Impossible de récupérer la phrase à compléter. ${environment.msgErrorIdentifyYourself}`);
          this.userAuthorizedToEditCurrentPhrase=false;
          this.userConnected=false;
          this.enableOrDisableWordForm();
          return throwError(() => new Error('ups sommething happend'));
        })
      )
      .subscribe(data => {
        this.phrase=data;
        console.log(this.phrase);
        this.stepWord=this.sharedService.getNextStepFromPhrase(this.phrase);
        console.log(this.stepWord);
        this.userConnected=true;
        this.userAuthorizedToEditCurrentPhrase=this.sharedService.isUserAuthorizedToEditPhrase(this.phrase, this.connectedUserId);
        this.enableOrDisableWordForm();
      });
    } else {
      this.idPhrase=null;
      this.stepWord="Sujet";
      this.userAuthorizedToEditCurrentPhrase=true;
      this.userConnected=true;
      this.enableOrDisableWordForm()
    }
  }
  
  enableOrDisableWordForm() {
    if (this.userAuthorizedToEditCurrentPhrase) {
      this.wordForm.get('wordinput')?.enable();
    } else {
      this.wordForm.get('wordinput')?.disable();
    }
  }

  refresh(): void {
    this.setPhrase(this.idPhrase);
  }
}

