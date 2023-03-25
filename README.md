# 3D Bin Packing
[![npm version](http://img.shields.io/npm/v/binpackingjs.svg?style=flat)](https://npmjs.org/package/binpackingjs "View this project on npm")
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

3D Bin Packing is a fork of [this bin packing implementation](https://github.com/macder/binpackingjs).

3D Bin Packing only includes the algorithm for 3D bin packing and removes the weight considerations.
It is also written more cleanly and in TypeScript so that it is easier to understand and use.

## Usage

```typescript
import { Bin, Item, Packer } from '@owens3364/3d-bin-packing';

const bin1 = new Bin('Le petite box', 296, 296, 8);
const item1 = new Item('Item 1', 250, 250, 2);
const item2 = new Item('Item 2', 250, 250, 2);
const item3 = new Item('Item 3', 250, 250, 2);
const packer = new Packer();

packer.addBin(bin1);
packer.addItem(item1);
packer.addItem(item2);
packer.addItem(item3);

// pack items into bin1
packer.pack();

// item1, item2, item3
console.log(bin1.items);

// items will be empty, all items was packed
console.log(packer.items);

// unfitItems will be empty, all items fit into bin1
console.log(packer.unfitItems)
```

## Contributing

Pull requests are welcome. For major changes,
please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)