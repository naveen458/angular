import { Component, ElementRef, OnChanges, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { fromEvent } from 'rxjs';
import { of } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  // public userInput: string= ""; 

  @ViewChild('userInput', { static: true }) userInput: ElementRef;
  apiResponse: any;
  isSearching: boolean

  public _url = '/api/search?q=';

  constructor(private _http: HttpClient) { 
    this.isSearching = false;
    this.apiResponse = [];

    console.log(this.userInput);
  }
    ngOnInit() {

      console.log(this.userInput);
  
      fromEvent(this.userInput.nativeElement, 'keyup').pipe(
  
        // get value
        map((event: any) => {
          return event.target.value;
        })
        // if character length greater then 2
        , filter(res => res.length > 2)
  
        // Time in milliseconds between key events
        , debounceTime(200)
  
        // If previous query is diffent from current   
        , distinctUntilChanged()
  
        // subscription for response
      ).subscribe((text: string) => {
  
        this.isSearching = true;
  
        this.searchGetCall(text).subscribe((res) => {
          console.log('res', res);
          this.isSearching = false;
          this.apiResponse = res;
        }, (err) => {
          this.isSearching = false;
          console.log('error', err);
        });
  
      });
    }

  private searchGetCall(text: string) {
    return this._http.get(`${this._url}${text}`)
  }

}
