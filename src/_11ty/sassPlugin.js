import path from "node:path";
import * as sass from "sass";

export default function (eleventyConfig) {
    eleventyConfig.addTemplateFormats("scss")

    eleventyConfig.addExtension("scss", {
        outputFileExtension: "css",

        // opt-out of Eleventy Layouts
        useLayouts: false,

        compile: function (inputContent, inputPath) {
            let parsed = path.parse(inputPath);
            // Don’t compile file names that start with an underscore
            if(parsed.name.startsWith("_")) {
                return
            }

            let result = sass.compileString(inputContent, {
                loadPaths: [
                    parsed.dir || ".",
                    this.config.dir.includes,
                ]
            });

            // Map dependencies for incremental builds
            this.addDependencies(inputPath, result.loadedUrls);

            return () => {
                return result.css
            }
        },
    })
}
