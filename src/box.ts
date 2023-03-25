import { factoredInteger } from './utils.js';

export default class Box {
  private _name: string;
  private _width: number;
  private _height: number;
  private _depth: number;

  constructor(name: string, w: number, h: number, d: number) {
    this._name = name;
    this._width = factoredInteger( w );
    this._height = factoredInteger( h );
    this._depth = factoredInteger( d );
  }

  public get name() {
    return this._name;
  }

  public get width() {
    return this._width;
  }

  public get height() {
    return this._height;
  }

  public get depth() {
    return this._depth;
  }

  public get volume() {
    return this._width * this._height * this._depth;
  }
}