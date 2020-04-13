const reactive = require('./reactive.js');

const nodes = new reactive();

nodes.b = a => a + 1;
nodes.c = (b) => b + 1;
nodes.d = (a) => a + 1;
nodes.e = (b, d) => b + d;

nodes.log = e => console.warn(e);

nodes.a = 5;

console.log(nodes('debug'))
