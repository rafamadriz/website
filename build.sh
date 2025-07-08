#!/usr/bin/env bash

# Modified script to install Zola and build a site. Originally made for Hugo.
# This is for deployment with Cloudflare workers.
# FORUM: https://www.answeroverflow.com/m/1387403036439089215
# SOURCE: https://github.com/willduncanphoto/hugo-worker/blob/aa55efc75673488da832b58568f3d22497e6275b/build.sh

main() {
    ZOLA_VERSION=0.20.0

    # Install Zola
    echo "Installing Zola v${ZOLA_VERSION}..."

    # -L: Follow redirects
    # -J: Use the header-provided filename
    # -O: Write output to file named as remote file
    curl -LJO https://github.com/getzola/zola/releases/download/v${ZOLA_VERSION}/zola-v${ZOLA_VERSION}-x86_64-unknown-linux-gnu.tar.gz

    # -x: extract files from an archive
    # -f: specify archive file or device
    tar -xf "zola-v${ZOLA_VERSION}-x86_64-unknown-linux-gnu.tar.gz"
    rm  zola-v${ZOLA_VERSION}-x86_64-unknown-linux-gnu.tar.gz

    # Verify installed versions
    echo "Verifying installations..."
    echo Zola: "$(./zola --version)"
    echo Node.js: "$(node --version)"

    # Build the site!
    ./zola build
}

set -euo pipefail
main "$@"
