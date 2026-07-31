#!/usr/bin/env sh
# Refresh assets/ from the published subset of the notes library.
#
# The previous one-liner in package.json did `rm -rf assets/* && cp …` against a
# path that no longer existed after the library was reorganised — the delete is
# not guarded by the &&, so running it wiped every article and then failed to
# refill. Resolve the source FIRST and refuse to touch anything if it is gone.
set -eu

SOURCE="${ASSETS_SOURCE:-$HOME/Documents/Studio/Article/Atelier/Publications/@jterrazz}"
TARGET="$(CDPATH='' cd "$(dirname "$0")/.." && pwd)/assets"

if [ ! -d "$SOURCE" ]; then
    echo "sync: source not found: $SOURCE" >&2
    echo "sync: set ASSETS_SOURCE to the Publications/@jterrazz folder." >&2
    exit 1
fi

if [ -z "$(ls -A "$SOURCE" 2>/dev/null)" ]; then
    echo "sync: source is empty, refusing to clear $TARGET" >&2
    exit 1
fi

rm -rf "${TARGET:?}"/*
cp -R "$SOURCE"/. "$TARGET"/
find "$TARGET" -name '.DS_Store' -delete

echo "sync: $(find "$TARGET" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ') articles from $SOURCE"
