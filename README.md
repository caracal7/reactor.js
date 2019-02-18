# reactor.js

Lightweight ES6 javascript reactive programming library

## Installation

```
npm i @caracal7/reactor.js
```

## Usage

```
import Reactor from '@caracal7/reactor.js';

let dataflow = new Reactor();

dataflow.b = a => a + 1;
dataflow.c = b => b + 1;
dataflow.d = a => a + 1;
dataflow.e = (b, d) => b + d;

dataflow.log = e => console.warn(e);

dataflow.a = 5;
```

Library was created as fork of [`topologica`](https://github.com/datavis-tech/topologica), and provides similar
functionality, but with using ES6 proxy sugar.
