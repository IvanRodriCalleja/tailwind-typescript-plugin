import * as ts from 'typescript/lib/tsserverlibrary';

import { TailwindTypescriptPlugin } from './plugin/TailwindTypescriptPlugin';

export = (mod: { typescript: typeof ts }) => new TailwindTypescriptPlugin(mod.typescript);
