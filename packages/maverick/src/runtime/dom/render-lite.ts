import { root as createRoot, Dispose } from '@maverick-js/signals';

import { unwrapDeep } from '../../std/signal';
import type { JSX } from '../jsx';
import { insertLite } from './insert-lite';
import { HydrateOptions, hydration, RenderOptions, runHydration } from './render';

export function hydrateLite(root: () => JSX.Element, options: HydrateOptions) {
  return runHydration(root, renderLite, options);
}

export function renderLite(root: () => JSX.Element, options: RenderOptions): Dispose {
  return createRoot((dispose) => {
    if (!hydration) {
      insertLite(options.target, root());
    } else {
      unwrapDeep(root);
    }

    return dispose;
  });
}
