import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPhrase, IUser, IWord } from '../models/models.module';
import { SnackbarService } from './snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private subjectPhrase = new Subject<any>();

  private subjectLogin = new Subject<any>();

  private subjectRefreshInProgress = new Subject<boolean>();

  private subjectRefreshHistory = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private snackBarService: SnackbarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  sendClickPhraseEvent(id: string | null) {
    this.subjectPhrase.next(id);
  }
  getClickPhraseEvent(): Observable<any> {
    return this.subjectPhrase.asObservable();
  }

  sendClickLoginEvent(id: number) {
    this.subjectLogin.next(id);
  }
  getClickLoginEvent(): Observable<any> {
    return this.subjectLogin.asObservable();
  }

  sendClickRefreshInProgress() {
    this.subjectRefreshInProgress.next(true);
  }

  getClickRefreshInProgress(): Observable<any> {
    return this.subjectRefreshInProgress.asObservable();
  }

  sendClickRefreshHistory() {
    this.subjectRefreshHistory.next(true);
  }

  getClickRefreshHistory(): Observable<any> {
    return this.subjectRefreshHistory.asObservable();
  }
  /**
   *
   * @param phrase IPhrase
   * @returns le prochain mot à rentrer dans une IPhrase.
   */
  getNextStepFromPhrase(phrase: IPhrase) {
    if (null == phrase.subject) {
      return 'Sujet';
    } else if (null == phrase.verb) {
      return 'Verbe';
    } else if (null == phrase.directObject) {
      return "Complément d'objet direct";
    } else if (null == phrase.circumstantialObject) {
      return "Complément d'objet circonstantiel";
    }
    return '';
  }

  /**
   *
   * @param phrase IPhrase
   * @returns l'auteur du dernier mot rentré.
   */
  getAuthorIdFromLastStep(phrase: IPhrase) {
    if (null === phrase.subject) {
      return null;
    } else if (null === phrase.verb) {
      return phrase.subject.user.id;
    } else if (null == phrase.directObject) {
      return phrase.verb.user.id;
    } else if (null == phrase.circumstantialObject) {
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
    return userId != this.getAuthorIdFromLastStep(phrase);
  }

  isConnectedUserPartOfAuthors(phrase: IPhrase, idConnectedUser: any) {
    let arraysIdAuthorsPhrase = new Array<number>();
    if (null != phrase.subject) {
      arraysIdAuthorsPhrase.push(phrase.subject.user.id);
    }
    if (null != phrase.verb) {
      arraysIdAuthorsPhrase.push(phrase.verb.user.id);
    }
    if (null != phrase.directObject) {
      arraysIdAuthorsPhrase.push(phrase.directObject.user.id);
    }
    if (null != phrase.circumstantialObject) {
      arraysIdAuthorsPhrase.push(phrase.circumstantialObject.user.id);
    }
    let arrayDistinctsUserIds = arraysIdAuthorsPhrase.filter(
      (n, i) => arraysIdAuthorsPhrase.indexOf(n) === i
    );

    return arrayDistinctsUserIds.includes(Number(idConnectedUser));
  }

  /**
   * Créer une nouvelle phrase (POST dans l'api REST)
   * avec uniquement un sujet à partir de celui passé en paramètre.
   * @param subject
   * @param authorId
   */
  postNewPhrase(subject: string, authorId: number) {
    let postId;
    let errorMessage = '';

    const headers = { 'Content-Type': 'application/json', charset: 'utf8' };

    let newPhrase = {} as IPhrase;
    let sujet = {} as IWord;
    let user = {} as IUser;
    sujet.libelle = subject;
    user.id = authorId;
    sujet.user = user;
    newPhrase.subject = sujet;

    this.http
      .post<IPhrase>(`${environment.apiUrl}/api/phrases`, newPhrase, {
        headers,
      })
      .subscribe({
        next: (data) => {
          postId = data.id;
          console.log('postId dans le suscribe : ' + postId);
          this.sendClickPhraseEvent(postId);
          this.sendClickRefreshInProgress();
          // return postId;
        },
        error: (error) => {
          errorMessage = error.message;
          console.error('There was an error!', error);
          this.snackBarService.displayMessage(
            `Impossible d'entrer le mot. ${environment.msgErrorIdentifyYourself}`
          );
          // return null;
        },
      });

    return '';
    // return null;
  }

  updatePhrase(
    phrase: IPhrase,
    word: string,
    currentWordStep: string,
    connectedUserId: number
  ) {
    let idPhrase = phrase.id;
    console.log('PUT : ' + idPhrase + ' (' + currentWordStep + ')');
    console.log(phrase);
    // phrase.verb=
    let currentWord = {} as IWord;
    let user = {} as IUser;
    currentWord.libelle = word;
    user.id = connectedUserId;
    currentWord.user = user;
    if (currentWordStep === 'Verbe') {
      phrase.verb = currentWord;
    } else if (currentWordStep === "Complément d'objet direct") {
      phrase.directObject = currentWord;
    } else if (currentWordStep === "Complément d'objet circonstantiel") {
      phrase.circumstantialObject = currentWord;
    }

    const headers = { 'Content-Type': 'application/json', charset: 'utf8' };

    this.http
      .put<IPhrase>(`${environment.apiUrl}/api/phrases/` + phrase.id, phrase, {
        headers,
      })
      .subscribe({
        next: (data) => {
          // return data.id;
          this.sendClickPhraseEvent(data.id);
          this.sendClickRefreshInProgress();

          if (data.circumstantialObject != null) {
            this.sendClickRefreshHistory();
            this.scrollAndFocusToPhraseFromId(data.id);
          }
        },
        error: (error) => {
          console.error('There was an error!', error);
          this.snackBarService.displayMessage(
            `Impossible d'entrer le mot. ${environment.msgErrorIdentifyYourself}`
          );
          return null;
        },
      });
  }


  /**
   * Récupère dans les query params
   * l'id_phrase s'il existe, puis scroll et met le focus sur la phrase correspondant.
   */
  public scrollAndFocusToPhraseFromQueryParam():void {
    this.route.queryParams
      .subscribe(params => {
        // Récupère dans les querys params l'id de la phrase
        let id = "phrase_" + params['id_phrase'];

        // Scroll et met le focus sur la phrase
        let scrollOk=this.scrollAndFocusToPhraseFromId(id);
        if (scrollOk) {
          // Supprime dans l'URL les querys params
          this.router.navigate([], {
            queryParams: {
              'id_phrase': null
            },
            queryParamsHandling: 'merge'
          });
        }
      });
  }

  public scrollAndFocusToPhraseFromId(idPhrase: string):boolean {
    // Cherche dans le DOM la phrase correspondant à l'id
    let getMeTo = document.getElementById(idPhrase);
    if (null !== getMeTo) {

      // Scroll sur la phrase
      getMeTo.scrollIntoView({
        behavior: 'smooth'
      });
      let parentTr = getMeTo.parentElement;

      // Highlight (à l'aide de css) la ligne du tableau correspondant à la phrase
      if (null != parentTr) {
        let classParent = parentTr.getAttribute("class");
        parentTr.setAttribute("class", classParent + " row-is-redirected-to");

        return true;
      }
    }

    return false;
  }
}
