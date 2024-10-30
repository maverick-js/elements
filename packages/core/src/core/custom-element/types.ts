import type { Dispose, Maybe, Scope } from '@maverick-js/signals';

import type {
  AnyComponent,
  Component,
  InferComponentMembers,
  InferComponentProps,
  InferComponentState,
} from '../component';
import type { Store } from '../store';
import type { ReadSignalRecord } from '../types';
import type { Attributes } from './attrs';

export type MaverickCustomElement<T extends Component = AnyComponent> = HTMLElement &
  InferComponentMembers<T> & {
    /**
     * Whether this component should be kept-alive on DOM disconnection. If `true`, all child
     * host elements will also be kept alive and the instance will need to be manually destroyed. Do
     * note, this can be prevented by setting `forwardKeepAlive` to ``false`.
     *
     * Important to note that if a parent element is kept alive, calling destroy will also destroy
     * all child element instances.
     *
     * ```ts
     * // Destroy this component and all children.
     * element.destroy();
     * ```
     */
    keepAlive: boolean;

    /**
     * If this is `false`, children will _not_ adopt the `keepAlive` state of this element.
     *
     * @defaultValue true
     */
    forwardKeepAlive: boolean;

    /** Component instance. */
    readonly $: T;

    readonly scope: Scope;
    readonly connectScope: Scope | null;

    readonly $props: ReadSignalRecord<InferComponentProps<T>>;
    readonly $store: Store<InferComponentState<T>>;

    /**
     * Whether the element is managed by the Maverick DOM framework.
     */
    readonly isManaged: boolean;

    /**
     * This object contains the state of the component store.
     *
     * ```ts
     * const el = document.querySelector('foo-el');
     * el.state.foo;
     * ```
     */
    readonly state: InferComponentState<T> extends Record<string, never>
      ? never
      : Readonly<InferComponentState<T>>;

    /**
     * Called each time the element is added to the document. The specification recommends that, as
     * far as possible, developers should implement custom element setup in this callback rather
     * than the constructor.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks}
     */
    connectedCallback(): void;

    /**
     * Called each time the element is removed from the document.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks}
     */
    disconnectedCallback(): void;

    /**
     * Called each time the element is moved to a new document.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks}
     */
    adoptedCallback?(): void;

    /**
     * Enables subscribing to live updates of the component store.
     *
     * @example
     * ```ts
     * const el = document.querySelector('foo-el');
     * el.subscribe(({ foo, bar }) => {
     *   // Re-run when the value of foo or bar changes.
     * });
     * ```
     */
    subscribe: InferComponentState<T> extends Record<string, never>
      ? never
      : (callback: (state: Readonly<InferComponentState<T>>) => Maybe<Dispose>) => Dispose;

    /**
     * Destroy the underlying component instance.
     */
    destroy(): void;
  };

export interface MaverickCustomElementConstructor<T extends Component = AnyComponent> {
  new (): MaverickCustomElement<T>;
}

export interface CustomElementOptions<T extends Component = Component> {
  /**
   * The tag name of the custom element.
   */
  readonly name: string;
  /**
   * The HTML tag name to be used when custom elements are not being used as a compile target.
   */
  readonly fallbackTag: keyof HTMLElementTagNameMap;
  /**
   * Component property to attribute name and value conversions.
   */
  readonly attributes?: Attributes<InferComponentProps<T>>;
  /**
   * Option to define shadow DOM attachment mode:
   *
   * - If `true`, attaches a shadow DOM with default options.
   * - If `false`, no shadow DOM is attached.
   * - If `ShadowRootInit`, attaches with the specified configuration.
   */
  readonly shadowRoot?: boolean | ShadowRootInit;
  /**
   * Extend the element constructor. You can enhance the class with additional features and
   * add mixins as desired. A custom element constructor must be returned.
   */
  extend?(ctor: MaverickCustomElementConstructor<T>): CustomElementConstructor;
}
