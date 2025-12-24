import markedFootnote from 'https://cdn.jsdelivr.net/npm/marked-footnote@1.4.0/+esm';
import { gfmHeadingId } from "https://cdn.jsdelivr.net/npm/marked-gfm-heading-id@4.1.3/+esm";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

marked.use(gfmHeadingId())

marked.use(markedFootnote({
    footnoteDivider: true,
    sectionClass: "footnotes prose"
}))

export class MarkedEngine implements Lume.Engine {
    render(content: string, _data: Record<string, unknown>, _filename: string) {
        return marked(content);
    }

    deleteCache() {}

    addHelper() {}
}
