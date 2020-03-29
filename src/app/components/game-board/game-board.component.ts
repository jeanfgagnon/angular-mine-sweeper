import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { GameOption } from 'src/app/common/GameOption';
import { CellModel } from 'src/app/common/CellModel';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

  private _gameOption: GameOption;
  private _board: CellModel[];

  @Output() click: EventEmitter<boolean> = new EventEmitter<boolean>();
 
  constructor() { }

  // life cycle plumbing
  
  ngOnInit(): void {
  }

  // properties

  @Input() set Board(value: CellModel[]) {
    this._board = value;
  }
  get Board(): CellModel[] {
    return this._board;
  }

  @Input() set GameOption(value: GameOption) {
    this._gameOption = value;
  }
  get GameOption(): GameOption {
    return this._gameOption;
  }
}
