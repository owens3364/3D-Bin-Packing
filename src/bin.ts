import { createLogger } from './log.js';
import Box from './box.js';
import Item, { RotationType } from './item.js';

const log = createLogger('3D: ');

export default class Bin extends Box {
  private _items: Item[] = [];

  constructor(name: string, w: number, h: number, d: number) {
    super(name, w, h, d);
  }

  public get items() {
    return this._items;
  }

  public set items(items: Item[]) {
    this._items = items;
  }

  /**
   * Calculate a score for a given item and rotation type.
   *
   * Scores are higher for rotations that closest match item dimensions to Bin dimensions.
   * For example, rotating the item so the longest side is aligned with the longest Bin side.
   *
   * Example (Bin is 11 x 8.5 x 5.5, Item is 8.1 x 5.2 x 5.2):
   *  Rotation 0:
   *    8.1 / 11  = 0.736
   *    5.2 / 8.5 = 0.612
   *    5.2 / 5.5 = 0.945
   *    -----------------
   *    0.736 ** 2 + 0.612 ** 2 + 0.945 ** 2 = 1.809
   *
   *  Rotation 1:
   *    8.1 / 8.5 = 0.953
   *    5.2 / 11 = 0.473
   *    5.2 / 5.5 = 0.945
   *    -----------------
   *    0.953 ** 2 + 0.473 ** 2 + 0.945 ** 2 = 2.025
   */
  private scoreRotation(item: Item, rotationType: RotationType): number {
    item.rotationType = rotationType;
    const d = item.dimension;

    // If the item doesn't fit in the Bin
    if ( super.width < d[0] || super.height < d[1] || super.depth < d[2] ) {
        return 0;
    }

    // Square the results to increase the impact of high values (e.g. > 0.8)
    const widthScore = Math.pow( d[0] / super.width, 2 );
    const heightScore = Math.pow( d[1] / super.height, 2 );
    const depthScore = Math.pow( d[2] / super.depth, 2 );

    return widthScore + heightScore + depthScore;
  }

  /**
   * Calculate the best rotation order for a given Item based on scoreRotation().
   * @return {Array} Rotation types sorted by their score, DESC
   */
  private getBestRotationOrder(item: Item): RotationType[] {
    const rotationScores = {};

    // Score all rotation types
    for (const rotation of item.allowedRotations) {
      rotationScores[rotation] = this.scoreRotation(item, rotation);
    }

    // Sort the rotation types (index of scores object) DESC
    // and ensure Int values (Object.keys returns strings)
    return Object.keys(rotationScores).sort((a, b) => {
      return rotationScores[b] - rotationScores[a];
    }).map(Number);
  }

  public putItem(item: Item, p: number[]): boolean {
    let fit = false;
    const rotations = this.getBestRotationOrder(item);
    item.position = p;

    for (const rotation of rotations) {
      item.rotationType = rotation;
      const d = item.dimension;

      if (super.width < p[0] + d[0] || super.height < p[1] + d[1] || super.depth < p[2] + d[2]) {
        fit = false;
      } else {
        fit = true;

        for (const otherItem of this.items) {
          if (otherItem.doesIntersect(item)) {
            fit = false;
            break;
          }
        }

        if (fit) {
          this.items.push(item);
        }
      }

      log('try to putItem', fit, 'item', item.toString(), 'box', this.toString());

      if (fit) {
        break;
      }
    }
    return fit;
  }

  private toString(): string {
    return `Bin: ${this.name} (W x H x D = ${super.width} x ${super.height} x ${super.depth})`;
  }
}