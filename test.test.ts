import { it } from "node:test";
import minify from "./index.ts";
import { parse } from "node:path";
import { appendFileSync, readdir, statSync, rmSync } from "node:fs";

const dummy_data = `
fireplace hour sets born usually scared refer wide nearest chest pictured dollar plenty grade 

automobile horse relationship   hold mean gave donkey shop closely cap solution help heard receive those empty pot hunt obtain form said bell material start instrument honor pine journey rhyme verb done

    compound truck rate magic follow folks happened victory soap color stared evening drew size bad damage swung white win major location duck floor made firm adjective piece mostly potatoes lion sitting correct worth edge pile suddenly

experiment dozen early tail however shine    function refer thee mathematics vessels length lonely seat wear bean stay pot gun western shoulder visit machinery double certain strength
      grandmother army tie hay     harder earn meant about entire name

fruit enough contrast    creature known fall flower mighty film properly gold musical plane dish before trap correctly bicycle
     wolf selection pilot putting run
heading lost police mainly thank pond read suit smooth fur older nation felt

smallest pink similar setting does expect warm scale screen afraid familiar loss given practical
total     chief spirit accident carried variety bad straight gray grass recently author tired wind rest     diagram forty paid widely region studying tonight slow highway catch`;

const filePath = "./test.txt";
if (statSync(filePath).isFile()) {
  try {
    rmSync(filePath);
  } catch (e) {
    console.error("could not remove test file");
  }
}
if (statSync("./test.min.txt").isFile()) {
  try {
    rmSync("./test.min.txt");
  } catch (e) {
    console.error("could not remove test file");
  }
}

for (let i = 0; i < 100; i++) {
  try {
    appendFileSync(filePath, dummy_data, { encoding: "utf8" });
  } catch (e) {
    throw new Error(`failed at iteration ${i} for reason:\n ${e}`);
  }
}

it(
  "minifies content of a file and produce output file",
  { timeout: 500 },
  (t) => {
    console.time("minifying");
    minify(filePath);
    console.timeEnd("minifying");

    t.test("make sure output file is present", () => {
      const { name, dir, ext } = parse(filePath);
      readdir(dir, (e, files) => {
        if (e) throw "could not read directory";
        return files.includes(name + ".min" + ext);
      });
    });
  }
);
