#!/bin/bash

set -e -x
RootDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Generating model field name enums..."
ts-node $RootDir/src/db/kysely/generator.ts

npm run build

exit 0