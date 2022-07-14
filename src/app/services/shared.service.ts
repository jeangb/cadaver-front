import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPhrase, IUser, IWord } from '../models/models.module';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  
  private subjectPhrase = new Subject<any>();
  
  private subjectLogin = new Subject<any>();
  
  constructor(private http: HttpClient) { }
  
  sendClickPhraseEvent(id:string | null) {
    this.subjectPhrase.next(id);
  }
  getClickPhraseEvent(): Observable<any>{ 
    return this.subjectPhrase.asObservable();
  }
  
  sendClickLoginEvent(id:string) {
    this.subjectLogin.next(id);
  }
  getClickLoginEvent(): Observable<any>{ 
    return this.subjectLogin.asObservable();
  }
  /**
  * 
  * @param phrase IPhrase
  * @returns le prochain mot à rentrer dans une IPhrase.
  */
  getNextStepFromPhrase(phrase: IPhrase){
    if(null==phrase.subject) {
      return "Sujet";
    } else if (null==phrase.verb) {
      return "Verbe";
    } else if (null==phrase.directObject) {
      return "Complément d'objet direct";
    } else if(null==phrase.circumstantialObject) {
      return "Complément d'objet circonstantiel";
    }
    return "";
  }
  
  /**
  * 
  * @param phrase IPhrase
  * @returns l'auteur du dernier mot rentré.
  */
  getAuthorIdFromLastStep(phrase: IPhrase) {
    if(null===phrase.subject) {
      return null;
    } else if (null===phrase.verb) {
      return phrase.subject.user.id;
    } else if (null==phrase.directObject) {
      return phrase.verb.user.id;
    } else if(null==phrase.circumstantialObject) {
      return phrase.directObject.user.id;
    }
    return null;
  }
  
  /**
  * 
  * @param phrase IPhrase
  * @param userId id de l'utilisateur connecté
  * @returns vrai si l'utilisateur connecté n'est pas l'auteur du dernier mot rentré sur la phrase.
  */
  isUserAuthorizedToEditPhrase(phrase: IPhrase, userId: number) {
    return userId !=  this.getAuthorIdFromLastStep(phrase);
  }
  
  
  /**
  * Créer une nouvelle phrase (POST dans l'api REST)
  * avec uniquement un sujet à partir de celui passé en paramètre.
  * @param subject 
  * @param authorId
  */
  postNewPhrase(subject: string, authorId: number) {
    
    let postId;
    let errorMessage='';
    
    const headers = { 'Content-Type': 'application/json', 'charset': 'utf8' };
    
    let newPhrase = {} as IPhrase;
    let sujet = {} as IWord;
    let user = {} as IUser;
    sujet.libelle=subject;
    user.id=authorId;
    sujet.user=user;
    newPhrase.subject=sujet;
    
    
    this.http.post<IPhrase>(`${environment.apiUrl}/api/phrases`, newPhrase, { headers }).subscribe({
    next: data => {
      postId = data.id;
      console.log("postId dans le suscribe : "+ postId);
      this.sendClickPhraseEvent(postId)
      // return postId;
    },
    error: error => {
      errorMessage = error.message;
      console.error('There was an error!', error);
      // return null;
    }
  })
  
  return "";
  // return null;
  
}

updatePhrase(phrase: IPhrase, word: string, currentWordStep: string, connectedUserId: number) {
  let idPhrase = phrase.id;
  console.log("PUT : "+idPhrase +" ("+currentWordStep+")");
  console.log(phrase);
  // phrase.verb=
  let currentWord = {} as IWord;
  let user = {} as IUser;
  currentWord.libelle=word;
  user.id=connectedUserId;
  currentWord.user=user;
  if (currentWordStep==="Verbe") {
    phrase.verb=currentWord;
  }
  else if (currentWordStep==="Complément d'objet direct") {
    phrase.directObject=currentWord;
  }
  else if (currentWordStep==="Complément d'objet circonstantiel") {
    phrase.circumstantialObject=currentWord;
  }
  
  const headers = { 'Content-Type': 'application/json', 'charset': 'utf8' };
  
  this.http.put<IPhrase>(`${environment.apiUrl}/api/phrases/`+phrase.id, phrase, { headers }).subscribe({
  next: data => {
    // return data.id;
    this.sendClickPhraseEvent(data.id);
  },
  error: error => {
    console.error('There was an error!', error);
    return null;
  }
})
}
}
