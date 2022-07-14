import { Component, OnInit } from '@angular/core';
import { SharedService } from './../services/shared.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IPhrase } from '../models/models.module';
import { environment } from 'src/environments/environment';

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
  connectedUserId: number = 1;
  helpVisible=false;
  constructor(private http: HttpClient, private sharedService:SharedService) {
    this.clickEventPhraseSelected=    this.sharedService.getClickPhraseEvent().subscribe((value)=>{
      this.setPhrase(value);
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
    if (word !=='') {
      if (this.idPhrase === null){
        this.sharedService.postNewPhrase(word, this.connectedUserId);
        // await new Promise(f => setTimeout(f, 1000));
        // console.log("postId dans le composant : "+postId);
        // if(postId != null) {
        //   this.idPhrase=postId;
        //   this.sharedService.sendClickPhraseEvent(this.idPhrase);
        // }
      } else {
        this.sharedService.updatePhrase(this.phrase, word, this.stepWord, this.connectedUserId);
        // await new Promise(f => setTimeout(f, 1000));

        // this.sharedService.sendClickPhraseEvent(this.phrase.id);
      }
    }

    
  }
}

