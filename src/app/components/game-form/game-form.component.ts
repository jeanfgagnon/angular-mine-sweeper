import { Component, OnInit, Input } from '@angular/core';

import { GameOption } from 'src/app/common/GameOption';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss']
})
export class GameFormComponent implements OnInit {

  private _gameOption: GameOption;
  constructor() { }

  ngOnInit(): void {
    //
  }

  @Input() set GameOption(value: GameOption) {
    this._gameOption = value;
    console.log("Rendu ici. %s", JSON.stringify(this._gameOption));
  }
  get GameOption(): GameOption {
    return this._gameOption;
  }
}
