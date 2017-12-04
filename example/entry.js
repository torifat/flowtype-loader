const { add } = require('./test');

add('x', 5);

function sub (a: number, b: number) {
  return a - b;
}

sub('1', 2);
