// SOURCE: modified from https://github.com/uncenter/uncenter.dev/blob/dcf43f951e305cafc785ce728894140b0a95104e/src/_data/inlined.js
import { readdir } from "node:fs/promises"
import path from "node:path"
import * as sass from "sass"

const STYLES_PATH = "./src/css/"

export default async () => {
	const css = {}
	for (const file of await readdir(STYLES_PATH)) {
                if (file.startsWith("_")) continue
		css[path.parse(file).name] = sass.compile(path.join(STYLES_PATH, file)).css
	}

	return { css }
};
