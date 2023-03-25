import Bin from './Bin.js';
import Item, {
  StartPosition,
  Axis,
} from './Item.js';

export default class Packer {
  private _bins: Bin[] = [];
  private _items: Item[] = [];
  private _unfitItems: Item[] = [];

  public get bins() {
    return this._bins;
  }

  public get items() {
    return this._items;
  }

  public get unfitItems() {
    return this._unfitItems;
  }

  public addBin(bin: Bin) {
    this._bins.push(bin);
  }

  public addItem(item: Item) {
    this._items.push(item);
  }

  private findFittedBin(i: Item): Bin | undefined {
    for (const bin of this._bins) {
      if (!bin.putItem(i, StartPosition)) {
        continue;
      }

      if (bin.items.length === 1 && bin.items[0] === i) {
        bin.items = [];
      }
      return bin;
    }
  }

  private getBiggerBinThan(otherBin: Bin): Bin | undefined {
    return this._bins.find((b) => b.volume > otherBin.volume);
  }

  private unfitItem() {
    if (this.items.length === 0) {
      return;
    }
    this.unfitItems.push(this.items.shift()!);
  }

  private packToBin(b: Bin, items: Item[]): Item[] {
    let b2: Bin | undefined = undefined;
    const unpacked: Item[] = [];
    const fit: boolean = b.putItem(items[0], StartPosition);

    if (!fit) {
      const b2 = this.getBiggerBinThan(b);
      if (b2) {
        return this.packToBin(b2, items);
      }
      return this.items;
    }

    // Pack unpacked items.
    for (const item of this.items.slice(1)) {
      let fitted = false;

      // Try available pivots in current bin that are not intersect with
      // existing items in current bin.
      lookup:
      for (const axis of [Axis.width, Axis.height, Axis.depth]) {
        for (const itemB of b.items) {
          let itemPosition: number[];
          switch (axis) {
            case Axis.width:
              itemPosition = [itemB.position[0] + itemB.dimension[0], itemB.position[1], itemB.position[2]];
              break;
            case Axis.height:
              itemPosition = [itemB.position[0], itemB.position[1] + itemB.dimension[1], itemB.position[2]];
              break;
            case Axis.depth:
              itemPosition = [itemB.position[0], itemB.position[1], itemB.position[2] + itemB.dimension[2]];
              break;
          }

          if (b.putItem(item, itemPosition)) {
            fitted = true;
            break lookup;
          }
        }
      }

      if (!fitted) {
        while (b2 !== undefined) {
          b2 = this.getBiggerBinThan(b);
          if (b2) {
            b2.items.push(item);
            const left = this.packToBin(b2, b2.items);
            if (left.length === 0) {
              b = b2;
              fitted = true;
              break;
            }
          }
        }

        if (!fitted) {
          unpacked.push(item);
        }
      }
    }

    return unpacked;
  }

  public pack(): void {
    // Sort bins smallest to largest.
    this.bins.sort((a, b) => a.volume - b.volume);

    // Sort items largest to smallest.
    this.items.sort((a, b) => b.volume - a.volume);

    while (this.items.length > 0) {
      const bin = this.findFittedBin(this.items[0]);

      if (!bin) {
        this.unfitItem();
        continue;
      }
      this._items = this.packToBin(bin, this.items);
    }
  }
}