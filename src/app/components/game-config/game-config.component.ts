import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { GameOption } from 'src/app/common/GameOption';

@Component({
  selector: 'app-game-config',
  templateUrl: './game-config.component.html',
  styleUrls: ['./game-config.component.scss']
})
export class GameConfigComponent implements OnInit {

  private _gameOption: GameOption;

  @Output() optionChanged = new EventEmitter<GameOption>();

  constructor() { }

  ngOnInit(): void {
  }

  // event handlers
  inputModified = (): void => {
    this.optionChanged.emit(this.GameOption);
  }

  // properties

  @Input() set GameOption(value: GameOption) {
    this._gameOption = Object.assign({}, value);
  }
  get GameOption(): GameOption {
    return this._gameOption;
  }

}
