import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap,} from 'rxjs/operators';
import { Contact } from './contact';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  
  private contactsUrl = 'api/contacts';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }
  
  private log(message: string) {
    this.messageService.add(`ContactService: ${message}`);
  }
  // get("/api/contacts")
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.contactsUrl)
            .pipe(
              catchError(this.handleError<Contact[]>('getContacts', []))
            );     
  }

  // post("/api/contacts")
  createContact(newContact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.contactsUrl, newContact)
            .pipe(
                catchError(this.handleError<Contact>('createContact'))
              );  
  }

  // get("/api/contacts/:id") endpoint not used by Angular app

  // delete("/api/contacts/:id")
  deleteContact(delContactId: String):Observable<String> {
    return this.http.delete<String>(this.contactsUrl + '/' + delContactId)
            .pipe(
              catchError(this.handleError<String>('deleteContact'))
            );
           
  }

  // put("/api/contacts/:id")
  updateContact(putContact: Contact): Observable<Contact> {
    var putUrl = this.contactsUrl + '/' + putContact._id;
    return this.http.put<Contact>(putUrl, putContact)
            .pipe(
              catchError(this.handleError<Contact>('updateContact'))
            );
  }
  
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
