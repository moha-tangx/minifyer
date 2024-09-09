import { join, parse } from "node:path";
import { createReadStream, createWriteStream } from "node:fs";

/**
 * ASCII CODE
 * 13 => carriage return (\r)
 * 32 ==> space ( )
 * 10 ==> newline (\n)
 */

/**
 * minifies file and redirects the output to `filename.min` created in the directory of the original file
 * @param filePath path to file to be minified
 */
function minify(filePath: string) {
  const r_stream = createReadStream(filePath, { autoClose: true });
  const { dir, ext, name } = parse(filePath);
  const out_file_path = join(dir, name + ".min" + ext);
  const w_stream = createWriteStream(out_file_path, {
    encoding: "utf8",
    autoClose: true,
  });

  if (!r_stream.readable) console.error("is not read file", filePath);
  if (!w_stream.writable) console.error("could not write to output file");

  let read_bytes = 0;
  r_stream.on("data", (bytes) => {
    const chunk = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      const byte = +bytes[i];
      if (byte == 32 || byte == 10 || byte == 13) continue;
      chunk[read_bytes++] = byte;
    }
    w_stream.write(chunk.slice(0, read_bytes), (e) => {
      if (e) throw new Error("could not write to output file");
    });
  });
  r_stream.on("end", () => {
    r_stream.close(); // just want to make sure it is closed
    w_stream.close(); //...
    console.log(filePath, "minified into", out_file_path);
  });
}
// minify(process.argv[2]);

export default minify;
