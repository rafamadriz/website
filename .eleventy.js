import { VentoPlugin } from "eleventy-plugin-vento"

export default async function(eleventyConfig) {
    eleventyConfig.addPlugin(VentoPlugin) // recommended to load as the last plugin
}

export const config =  {
    dir: {
        input:  "src",
        output: "public",
    },
}
