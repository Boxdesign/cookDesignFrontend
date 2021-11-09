import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class SocketService {
  private socket: SocketIOClient.Socket; // The client instance of socket.io
  apiUrl:string;
  public messages = new Subject();
  public reconnectAttempts = 0;
  public maxReconnects = 6;

  constructor() {
    this.apiUrl = environment.apiURL;
  }

  authenticate(){
    this.socket = io.connect(this.apiUrl);

		this.socket.on('connect', () => {
			console.log('socket connected...')
		  this.socket.emit('authentication', {token: localStorage.getItem('token')});
		  this.socket.on('authenticated', () => {
		    console.log('Socket authenticated')
		  });
		});    
  	
		this.socket.on('unauthorized', (err) => {
		  console.log("There was an error with the authentication:", err.message);
		});	 

		this.socket.on('disconnect', (err) => {
			console.log('Socket disconnected!')
		}) 

    this.socket.on('cooksystem', (data) => {
      this.messages.next(data);    
    });  	
  }

	sendMessage(message){
	    this.socket.emit(localStorage.getItem('token'), message);    
	  }

	disconnect(){
		this.socket.disconnect();
	}
	  
	getMessages() {	
	  return this.messages;
	}

}