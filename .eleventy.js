import { VentoPlugin } from "eleventy-plugin-vento"

// CUSTOM PLUGINS
import sassPlugin from "./src/_11ty/sassPlugin.js"

export default async function(eleventyConfig) {
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
