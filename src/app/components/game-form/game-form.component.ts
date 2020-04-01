import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';

import { GameOption } from 'src/app/common/GameOption';
import { CellModel } from 'src/app/common/CellModel';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss']
})
export class GameFormComponent implements OnInit, AfterViewInit {

  private _gameOption: GameOption;

  board: CellModel[] = [];
  flagCount = 0;
  elapsed = 0;
  gameOver = false;

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

  // event handlers

  onToggleConfigClick = (): void => {
    if (this.configPanel.nativeElement.className === 'open') {
      this.renderer.addClass(this.configPanel.nativeElement, 'close');
      this.renderer.removeClass(this.configPanel.nativeElement, 'open');
    }
    else {
      this.renderer.addClass(this.configPanel.nativeElement, 'open');
      this.renderer.removeClass(this.configPanel.nativeElement, 'close');
    }
  }

  onRestartClick = (): void => {
    console.log('on restart le jeu');
  }

  onCellClicked = (isRightClick: boolean): void => {
    // rendu ici. a vendredi. mercredi gin? jeudi gin?  vendredi jamais de gin!
    console.log('%s click cell', (isRightClick ? "right" : "left"));
  }

  // helpers

  formWidth = (): number => {
    return this.GameOption.NbCol * 27 + 10;
  }

  // private code

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
