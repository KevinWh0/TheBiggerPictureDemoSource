//loadWorld("./assets/levels/e.txt");

let levelPrefix = `./assets/levels/`;
export let levels = {
  0: `level0.txt`,
  1: `level1.txt`,
  2: `level2.txt`,
  3: `level3.txt`,
};

export function getLevelPath(lvl) {
  try {
    //  console.log(Object.keys(levels).includes(lvl + ""));
    if (Object.keys(levels).includes(lvl + "")) {
      return function () {
        return `${levelPrefix}${levels[lvl]}`;
      };
    } else throw Error();
  } catch (err) {
    return function () {
      return `${levelPrefix}${levels[1]}`;
    };
  }
}
