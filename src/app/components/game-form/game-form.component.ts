import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef, Renderer2, AfterViewChecked } from '@angular/core';

import { GameOption } from 'src/app/common/GameOption';
import { CellModel } from 'src/app/common/CellModel';
import { CellClickPayload } from 'src/app/common/CellClickPayload';
import { CellCoords } from 'src/app/common/CellCoords';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss'],
  host: {
    '(window:resize)': 'onWindowResize($event)'
  }
})
export class GameFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  private _gameOption: GameOption;

  board: CellModel[] = [];
  flagCount = 0;
  elapsed = 0;
  gameOver = false;
  running = false;
  azimuth = ['ne', 'n', 'nw', 'w', 'e', 'sw', 's', 'se'];
  timerHandler: any = 0;

  @ViewChild('gameForm', { read: ElementRef }) gameForm: ElementRef;
  @ViewChild('configPanel', { read: ElementRef }) configPanel: ElementRef;

  constructor(private renderer: Renderer2) { }

  // life cycle plumbing

  ngOnInit(): void {
    this.initBoard();
  }

  ngAfterViewInit(): void {
    this.positionConfig();
  }

  ngAfterViewChecked(): void {
    this.positionConfig();
  }

  // event handlers

  public onWindowResize(): void {
    this.positionConfig();
  }

  public onOptionChanged = (go: GameOption) => {
    this._gameOption = Object.assign({}, go);
    this.restartGame();
  }

  public onToggleConfigClick = (): void => {
    if (this.configPanel.nativeElement.className === 'open') {
      this.renderer.addClass(this.configPanel.nativeElement, 'close');
      this.renderer.removeClass(this.configPanel.nativeElement, 'open');
    }
    else {
      this.renderer.addClass(this.configPanel.nativeElement, 'open');
      this.renderer.removeClass(this.configPanel.nativeElement, 'close');
    }
  }

  public onRestartClick = (): void => {
    this.restartGame();
  }

  public onCellClicked = (ccp: CellClickPayload): void => {
    if (ccp.IsRightClick) {
      this.cellRightClick(ccp.BoardIndex);
    }
    else {
      this.cellLeftClick(ccp.BoardIndex);
    }
  }

  // helpers

  public formWidth = (): number => {
    return this.GameOption.NbCol * 27 + 10;
  }

  // private code

  private restartGame(): void {
    clearInterval(this.timerHandler);
    this.timerHandler = 0;
    this.initBoard();
    this.gameOver = false;
    this.running = false;
    this.flagCount = 0;
    this.elapsed = 0;
  }

  private cellLeftClick(index: number): void {
    if (!this.gameOver) {
      if (!this.running) {
        this.running = true;
        this.bombSetup(index);
        this.timerSetup(true);
      }

      if (!this.board[index].IsRedFlagVisible) {
        if (this.board[index].IsBomb) {
          // boom
          console.log('boom!');
          this.boom(index);
          this.stopGame();
        }
        else {
          this.board[index].IsRedFlagVisible = false;
          this.board[index].CssClass = "empty-cell";
          this.board[index].IsCleared = true;
          const coords = this.getCellCoord(this.board[index].CellNo);
          const nearBombCount = this.getNearBombCount(coords);
          if (nearBombCount > 0) {
            this.board[index].Text = nearBombCount.toString();
            this.board[index].CellStyle = this.getStyleColorByNbBomb(nearBombCount);
          }
          else {
            this.clearEmptyAround(coords);
          }
        }
      }
    }
  } // cellLeftClick

  cellRightClick(index: number): void {
    if (this.running && !this.gameOver && !this.board[index].IsCleared) {
      this.board[index].IsRedFlagVisible = !this.board[index].IsRedFlagVisible;

      this.flagCount = this.board.filter(x => x.IsRedFlagVisible).length;
    }
  }

  private timerSetup(onoff: boolean): void {
    if (onoff) {
      if (this.timerHandler === 0) {
        this.timerHandler = setInterval(() => { this.incrementElapsed() }, 1000);
      }
    }
    else {
      clearInterval(this.timerHandler);
    }
  }

  incrementElapsed(): void {
    if (this.elapsed < this.GameOption.MaxSec) {
      this.elapsed++;
    }
    else {
      this.stopGame();
    }
  }

  private stopGame = (): void => {
    clearInterval(this.timerHandler);
    this.running = false;
    this.gameOver = true
  }

  // set bombs on board on first click
  bombSetup(firstClickedCellNo: number): void {
    this.setBombs(firstClickedCellNo);
    this.moveNearBombs(firstClickedCellNo);
  }

  getNearBombCount(coords: CellCoords): number {
    let nbBomb = 0;
    const surroundingBoardPos: number[] = this.computeSurroundingBoardPos(coords);
    surroundingBoardPos.forEach(n => {
      if (this.board[n].IsBomb) {
        nbBomb++;
      }
    });

    return nbBomb;
  }

  // clean around 'coords' up to cells with near bomb(s)
  private clearEmptyAround(coords: CellCoords): void {
    const pos = this.getBoardPos(coords);
    this.board[pos].IsCleared = true;
    this.board[pos].CssClass = "empty-cell";
    const nearBombCount = this.getNearBombCount(coords);
    if (nearBombCount > 0) {
      this.board[pos].Text = nearBombCount.toString();
      this.board[pos].CellStyle = this.getStyleColorByNbBomb(nearBombCount);
    }
    else {
      this.azimuth.forEach(aziStr => {
        const aziCoords: CellCoords = this.getAziCoords(coords, aziStr);
        if (aziCoords.valid) {
          const aziPos = this.getBoardPos(aziCoords);
          if (!this.board[aziPos].IsCleared && !this.board[aziPos].IsRedFlagVisible) {
            this.clearEmptyAround(aziCoords);
          }
        }
      });
    }
  }

  moveNearBombs(firstClickedCellNo: number) {
    const coords = this.getCellCoord(firstClickedCellNo);
    const surroundingBoardPos: number[] = this.computeSurroundingBoardPos(coords);

    this.azimuth.forEach(aziStr => {

      const aziCoords: CellCoords = this.getAziCoords(coords, aziStr);

      if (aziCoords.valid) {
        const curPos = this.getBoardPos(aziCoords);
        if (this.board[curPos].IsBomb) {
          this.board[curPos].IsBomb = false;

          let pos = this.getRandomPos();
          while (pos === firstClickedCellNo || surroundingBoardPos.indexOf(pos) !== -1 || this.board[pos].IsBomb) {
            pos = this.getRandomPos();
            console.log('moving bomb from %s %s to %s', aziStr, curPos, pos);
          }
          this.board[pos].IsBomb = true;
        }
      }

    });
  }

  getAziCoords(coords: CellCoords, aziStr: string): CellCoords {
    const newCoords = new CellCoords();

    switch (aziStr) {
      case 'ne':
        if (coords.RowPos > 1 && coords.ColPos > 1) {
          newCoords.RowPos = coords.RowPos - 1;
          newCoords.ColPos = coords.ColPos - 1;
          newCoords.valid = true;
        }
        break;

      case 'n':
        if (coords.RowPos > 1) {
          newCoords.RowPos = coords.RowPos - 1;
          newCoords.ColPos = coords.ColPos;
          newCoords.valid = true;
        }
        break;

      case 'nw':
        if (coords.RowPos > 1 && coords.ColPos < this.GameOption.NbCol) {
          newCoords.RowPos = coords.RowPos - 1;
          newCoords.ColPos = coords.ColPos + 1;
          newCoords.valid = true;
        }
        break;

      case 'w':
        if (coords.ColPos > 1) {
          newCoords.RowPos = coords.RowPos;
          newCoords.ColPos = coords.ColPos - 1;
          newCoords.valid = true;
        }
        break;

      case 'e':
        if (coords.ColPos < this.GameOption.NbCol) {
          newCoords.RowPos = coords.RowPos;
          newCoords.ColPos = coords.ColPos + 1;
          newCoords.valid = true;
        }
        break;

      case 'sw':
        if (coords.RowPos < this.GameOption.NbRow && coords.ColPos > 1) {
          newCoords.RowPos = coords.RowPos + 1;
          newCoords.ColPos = coords.ColPos - 1;
          newCoords.valid = true;
        }
        break;

      case 's':
        if (coords.RowPos < this.GameOption.NbRow) {
          newCoords.RowPos = coords.RowPos + 1;
          newCoords.ColPos = coords.ColPos;
          newCoords.valid = true;
        }
        break;

      case 'se':
        if (coords.RowPos < this.GameOption.NbRow && coords.ColPos < this.GameOption.NbCol) {
          newCoords.RowPos = coords.RowPos + 1;
          newCoords.ColPos = coords.ColPos + 1;
          newCoords.valid = true;
        }
        break;
    }

    return newCoords;
  }

  boom(currentCellNo: number): void {

    let nb = this.board.filter(x => x.IsRedFlagVisible).length;

    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i].IsBomb) {
        if (i === currentCellNo) {
          this.board[i].CssClass = "cellBombCur";
        }
        else if (!this.board[i].IsRedFlagVisible) {
          this.board[i].CssClass = "cellBomb";
        }
      }
      else if (this.board[i].IsRedFlagVisible) {
        this.board[i].IsRedFlagVisible = false;
        this.board[i].CssClass = "badCellBomb";
        nb--;
      }
    }

    this.flagCount = nb;
  }

  // get the board position by cell coord
  getBoardPos(coords: CellCoords): number {
    const rv = ((coords.RowPos - 1) * this.GameOption.NbCol) + (coords.ColPos - 1);

    return rv;
  }

  // get cell coord by board position
  getCellCoord(no: number): CellCoords {
    const cc = new CellCoords();

    cc.RowPos = Math.floor(no / this.GameOption.NbCol) + 1;
    cc.ColPos = (no % this.GameOption.NbCol) + 1;

    return cc;
  }

  // add the required bombs anywhere randomly on the board
  setBombs(firstClickedCellNo: number): void {
    if (this.GameOption.NbBomb < this.board.length) {
      for (let i = 0; i < this.GameOption.NbBomb; i++) {
        let pos = this.getRandomPos();
        while (pos === firstClickedCellNo || this.board[pos].IsBomb) {
          pos = this.getRandomPos();
        }
        this.board[pos].IsBomb = true;
      }
    }
  }

  computeSurroundingBoardPos(coords: CellCoords): number[] {
    const surroundingBoardPos: number[] = [];

    this.azimuth.forEach((aziStr) => {
      const aziCoords: CellCoords = this.getAziCoords(coords, aziStr);
      if (aziCoords.valid) {
        surroundingBoardPos.push(this.getBoardPos(aziCoords));
      }
    });

    return surroundingBoardPos;
  }

  // select text color by bomb count
  getStyleColorByNbBomb(nbBomb: number): object {
    let rv = {};

    switch (nbBomb) {
      case 1: rv = { color: 'blue' }; break;
      case 2: rv = { color: 'green' }; break;
      case 3: rv = { color: 'red' }; break;
      case 4: rv = { color: 'indigo' }; break;
      case 5: rv = { color: 'magenta' }; break;
      case 6: rv = { color: 'maroon' }; break;
      case 7: rv = { color: 'orangered' }; break;
      case 8: rv = { color: 'purple' }; break;
    }

    return rv;
  }

  // return a random where n >= 0 && n < board size
  private getRandomPos(): number {
    const rnd = Math.floor(Math.random() * this.board.length);

    return rnd;
  }

  // initialize the game 'logic' board as an array
  private initBoard = (): void => {
    this.board = [];
    let index = 0;
    for (let rowNo = 0; rowNo < this.GameOption.NbRow; rowNo++) {
      for (let colNo = 0; colNo < this.GameOption.NbCol; colNo++) {
        const cell = this.createCellModel(index, rowNo, colNo);
        this.board.push(cell);
        index++;
      }
    }
  } // initBoard

  // create and initialize one board cell
  private createCellModel = (index: number, rowNo: number, colNo: number): CellModel => {
    const cell = new CellModel();

    cell.CellId = `cell_${rowNo + 1}_${colNo + 1}`;
    cell.CellNo = index;
    cell.IsRedFlagVisible = false;
    cell.IsBomb = false;
    cell.IsCleared = false;
    cell.Text = '';
    cell.CssClass = 'cellUnclick'

    return cell;
  } // createCellModel

  private positionConfig(): void {
    const gameFormRect: DOMRect = this.gameForm.nativeElement.getBoundingClientRect();
    const configPanelRect: DOMRect = this.configPanel.nativeElement.getBoundingClientRect();

    this.renderer.setStyle(this.configPanel.nativeElement, 'top', (gameFormRect.top + 30) + 'px');
    this.renderer.setStyle(this.configPanel.nativeElement, 'left', (gameFormRect.right - configPanelRect.width) + 'px');
    this.renderer.setStyle(this.configPanel.nativeElement, 'visibility', 'visible');
  }

  // properties 

  @Input() set GameOption(value: GameOption) {
    this._gameOption = value;
  }
  get GameOption(): GameOption {
    return this._gameOption;
  }

} // class
