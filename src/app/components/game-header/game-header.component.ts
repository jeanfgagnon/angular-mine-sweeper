import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { GameOption } from 'src/app/common/GameOption';

@Component({
  selector: 'app-game-header',
  templateUrl: './game-header.component.html',
  styleUrls: ['./game-header.component.scss']
})
export class GameHeaderComponent implements OnInit {

  private _gameOption: GameOption;
  private _flagCount = 0;
  private _elapsed = 0;
  private _gameOver = false;

  @Output() toggleConfigClick: EventEmitter<any> = new EventEmitter();
  @Output() restartClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  // event handlers

  gearClicked = () : void => {
    this.toggleConfigClick.emit();
  }

  smileyClicked = () : void => {
    this.restartClick.emit();
  }

  // helpers

  gameStatus = () : string => {
    let rv = '';
    if (this.GameOver) {
      if (this.Elapsed >= this.GameOption.MaxSec) {
        rv = 'TIMEOUT!';
      }
      else {
        rv = 'BOOM!';
      }
    }

    return rv;
  }

  padNum = (num: number): string => {
    let rv: string;
    if (num < 10) {
      rv = '00' + num.toString();
    }
    else if (num < 100) {
      rv = '0' + num.toString();
    }
    else {
      rv = num.toString();
    }

    return rv;
  }

  // properties 
  
  @Input() set GameOption(value: GameOption) {
    this._gameOption = value;
    console.log("Rendu ici. %s", JSON.stringify(this._gameOption));
  }
  get GameOption(): GameOption {
    return this._gameOption;
  }

  // how many bomb flagged
  @Input() set FlagCount(value: number) {
    this._flagCount = value;
  }
  get FlagCount(): number {
    return this._flagCount;
  }

  // number of elapsed second
  @Input() set Elapsed(value: number) {
    this._elapsed = value;
  }
  get Elapsed(): number {
    return this._elapsed;
  }

  // game over, boom, timeout or win
  @Input() set GameOver(value: boolean) {
    this._gameOver = value;
  }
  get GameOver(): boolean {
    return this._gameOver;
  }
  
} // class
