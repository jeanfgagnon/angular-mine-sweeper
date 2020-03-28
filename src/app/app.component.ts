import { Component, OnInit } from '@angular/core';

import { GameOption } from './common/GameOption';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ng-demineur';

  gameOption: GameOption;
    
  ngOnInit(): void {
    this.gameOption = new GameOption();
    this.gameOption.MaxSec = 999;
    this.gameOption.NbBomb = 99;
    this.gameOption.NbCol = 30;
    this.gameOption.NbRow = 16;
  }

}
