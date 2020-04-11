import { Component, Input, Output, EventEmitter } from '@angular/core';

import { GameOption } from 'src/app/common/GameOption';

@Component({
  selector: 'app-game-config',
  templateUrl: './game-config.component.html',
  styleUrls: ['./game-config.component.scss']
})
export class GameConfigComponent {

  private _gameOption: GameOption;

  @Output() optionChanged = new EventEmitter<GameOption>();

  constructor() { }

  // event handlers

  public inputModified = (): void => {
    if (this.validateBombCount()) {
      this.optionChanged.emit(this.GameOption);
    }
  }


  // private code

  // Max bomb count must be: board size minus 10
  validateBombCount(): boolean {
    return this.GameOption.NbBomb <= this.MaxBomb;
  }

  // properties

  get MaxBomb(): number {
    return (this.GameOption.NbCol * this.GameOption.NbRow) - 10;
  }

  @Input() set GameOption(value: GameOption) {
    this._gameOption = Object.assign({}, value);
  }
  get GameOption(): GameOption {
    return this._gameOption;
  }

} // class
