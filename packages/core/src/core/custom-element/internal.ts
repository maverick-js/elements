import type { AnyComponent } from '../component';

/** @internal */
export let $$_current_host_component: AnyComponent | null = null;

/** @internal */
export function $$_set_current_host_component(component: AnyComponent | null) {
  $$_current_host_component = component;
}
