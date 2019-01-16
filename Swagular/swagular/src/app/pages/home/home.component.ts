import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'swag-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(public auth: AuthService, private chatService: ChatService) {
    chatService.messages.subscribe(msg => {
      console.log('Response from websocket: ' + msg);
    });
  }

  private message = {
    author: 'Gobbenobber',
    message: 'Hello there'
  };

  sendMsg() {
    console.log('new message from client to websocket: ', this.message);
    this.chatService.messages.next(this.message);
    this.message.message = '';
  }

  ngOnInit() {}
}
