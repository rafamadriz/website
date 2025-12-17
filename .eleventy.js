import { VentoPlugin } from "eleventy-plugin-vento"

// CUSTOM PLUGINS
import sassPlugin from "./src/_11ty/sassPlugin.js"

export default async function(eleventyConfig) {
    // COLLECTIONS
    eleventyConfig.addCollection("posts", function(CollectionApi) {
        return CollectionApi
            .getFilteredByGlob("./src/blog/**/*.md")
            .filter(page => page.inputPath != "./src/blog/index.md")
            .reverse()
    })

    // PLUGINS
    eleventyConfig.addPlugin(sassPlugin),
    eleventyConfig.addPlugin(VentoPlugin) // recommended to load as the last plugin
}

export const config =  {
    dir: {
        input:  "src",
        output: "public",
    },
}
