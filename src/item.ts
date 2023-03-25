import Box from './box.js';

export enum RotationType {
  whd = 0,
  hwd = 1,
  hdw = 2,
  dhw = 3,
  dwh = 4,
  wdh = 5,
}

export enum Axis {
  width = 0,
  height = 1,
  depth = 2,
}

export const StartPosition = [0, 0, 0];

export const RotationTypeStrings: Record<RotationType, string> = {
  [RotationType.whd]: '(w, h, d)',
  [RotationType.hwd]: '(h, w, d)',
  [RotationType.hdw]: '(h, d, w)',
  [RotationType.dhw]: '(d, h, w)',
  [RotationType.dwh]: '(d, w, h)',
  [RotationType.wdh]: '(w, d, h)',
};

export default class Item extends Box {
  private _allowedRotations: RotationType[] = [
    RotationType.whd,
    RotationType.hwd,
    RotationType.hdw,
    RotationType.dhw,
    RotationType.dwh,
    RotationType.wdh,
  ];

  private _rotationType: RotationType = RotationType.whd;

  private _position: number[] = []; // x, y, z

  constructor(name: string, w: number, h: number, d: number) {
    super(name, w, h, d);
  }

  public get allowedRotations() {
    return this._allowedRotations;
  }

  public get rotationType() {
    return this._rotationType;
  }

  public set rotationType(type: RotationType) {
    this._rotationType = type;
  }

  public get position() {
    return this._position;
  }

  public set position(position: number[]) {
    this._position = position;
  }

  public get rotationTypeString() {
    return RotationTypeStrings[this._rotationType];
  }

  public get dimension() {
    switch (this._rotationType) {
      case RotationType.whd:
        return [super.width, super.height, super.depth];
      case RotationType.hwd:
        return [super.height, super.width, super.depth];
      case RotationType.hdw:
        return [super.height, super.depth, super.width];
      case RotationType.dhw:
        return [super.depth, super.height, super.width];
      case RotationType.dwh:
        return [super.depth, super.width, super.height];
      case RotationType.wdh:
        return [super.width, super.depth, super.height];
    }
  }

  public doesIntersect(other: Item): boolean {
    return rectIntersect(this, other, Axis.width, Axis.height) &&
        rectIntersect(this, other, Axis.height, Axis.depth) &&
        rectIntersect(this, other, Axis.width, Axis.depth);
  }

  public toString(): string {
    return `Item: ${super.name} (${this.rotationTypeString} = ${this.dimension.join(' x ')})`;
  }
}

function rectIntersect (item1: Item, item2: Item, x: number, y: number): boolean {
  const d1: number[] = item1.dimension;
  const d2: number[] = item2.dimension;

  const cx1: number = item1.position[x] + d1[x] / 2;
  const cy1: number = item1.position[y] + d1[y] / 2;
  const cx2: number = item2.position[x] + d2[x] / 2;
  const cy2: number = item2.position[y] + d2[y] / 2;

  const ix: number = Math.max(cx1, cx2) - Math.min(cx1, cx2);
  const iy: number = Math.max(cy1, cy2) - Math.min(cy1, cy2);

  return ix < (d1[x] + d2[x]) / 2 && iy < (d1[y] + d2[y]) / 2;
}
