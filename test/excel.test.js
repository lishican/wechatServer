const fs = require("fs");
const path = require("path");
const xlsx = require("node-xlsx");
require

let sheet = xlsx.parse(
  fs.readFileSync(path.resolve(__dirname, "./答题名单.xlsx"))
);
// console.log(sheet[0].data);
let order = {
  A: 0,
  B: 1,
  C: 2,
  D: 3
};
console.log( sheet[0].data)

let problemData = sheet[0].data.slice(1).map(v => {
  return {
    id:v[0],
    name:v[1]
  }
  // let a = [];
  // let correctAnswer = "";
  // if (v[3]==2) {
  //   console.log(11)
  //   a[0] = v[6];
  //   a[1] = v[7];
  //   correctAnswer = a[v[4] - 1];
  // } else if(v[3]==4) {
  //   a[0] = v[6].replace("A.", "");
  //   a[1] = v[7].replace("B.", "");
  //   a[2] = v[8].replace("C.", "");
  //   a[3] = v[9].replace("D.", "");
  //   correctAnswer = a[order[v[4]]];
  // }
  // return {
  //   orderNum: v[0],
  //   problem: v[1],
  //   answers: a,
  //   correctAnswer: correctAnswer,
  //   detail: v[5]||'略',
  //   time: v[2]
  // };
});

fs.writeFileSync(path.resolve(__dirname,'./problem.json'),JSON.stringify(problemData))


console.log(problemData);
