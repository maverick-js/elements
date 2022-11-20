import type { Constructor } from 'type-fest';

import { type JSX, onDispose } from '../runtime';

const DOM_EVENT = Symbol('DOM_EVENT'),
  DOMEventBase: Constructor<Event> = __SERVER__ ? (class Event {} as any) : Event;

export type DOMEventInit<Detail = unknown> = EventInit & {
  readonly detail?: Detail;
  readonly triggerEvent?: Event;
};

export class DOMEvent<Detail = unknown> extends DOMEventBase {
  /**
   * The event detail.
   */
  readonly detail?: Detail;

  /**
   * The preceding event that was responsible for this event being fired.
   */
  readonly triggerEvent?: Event;

  /**
   * Walks up the event chain (following each `triggerEvent`) and returns the origin event
   * that started the chain.
   */
  readonly originEvent!: Event;

  /**
   * Walks up the event chain (following each `triggerEvent`) and determines whether the initial
   * event was triggered by the end user (ie: check whether `isTrusted` on the `originEvent` `true`).
   */
  readonly isOriginTrusted!: boolean;

  constructor(type: string, init?: DOMEventInit<Detail>) {
    super(type, init);

    Object.defineProperty(this, DOM_EVENT, {
      get: () => true,
    });

    defineEventProperty(this, 'detail', () => init?.detail);
    defineEventProperty(this, 'triggerEvent', () => init?.triggerEvent);
    defineEventProperty(this, 'originEvent', () => getOriginEvent(this) ?? this);
    defineEventProperty(this, 'isOriginTrusted', () => getOriginEvent(this)?.isTrusted ?? false);
  }
}

/**
 * Whether the given `event` is a Maverick DOM Event class.
 */
export function isDOMEvent(event?: Event | null): event is DOMEvent<unknown> {
  return !!event?.[DOM_EVENT];
}

/**
 * Whether the given `event` is of the given `type`.
 */
export function isEventType<Type extends keyof MaverickEventRecord>(
  event: Event,
  type: Type,
): event is MaverickEventRecord[Type] {
  return event.type === type;
}

/**
 * Walks up the event chain (following each `triggerEvent`) and returns the origin event that
 * started the chain.
 */
export function getOriginEvent(event: DOMEvent): Event | undefined {
  let triggerEvent = event.triggerEvent as DOMEvent;

  while (triggerEvent && triggerEvent.triggerEvent) {
    triggerEvent = triggerEvent.triggerEvent as DOMEvent;
  }

  return triggerEvent;
}

/**
 * Walks an event chain on a given `event`, and invokes the given `callback` for each trigger event.
 *
 * @param event - The event on which to follow the chain.
 * @param callback - Invoked for each trigger event in the chain. If a `value` is returned by
 * this callback, the walk will end and `[event, value]` will be returned.
 */
export function walkTriggerEventChain<T>(
  event: Event,
  callback: (event: Event) => NonNullable<T> | void,
): [event: Event, value: NonNullable<T>] | undefined {
  if (!isDOMEvent(event)) return;

  let triggerEvent = event.triggerEvent as DOMEvent;

  while (triggerEvent) {
    const returnValue = callback(triggerEvent);
    if (returnValue) return [triggerEvent, returnValue];
    triggerEvent = triggerEvent.triggerEvent as DOMEvent;
  }

  return;
}

/**
 * Attempts to find a trigger event with a given `eventType` on the event chain.
 *
 * @param event - The event on which to look for a trigger event.
 * @param type - The type of event to find.
 */
export function findTriggerEvent<Type extends string>(
  event: Event,
  type: Type,
): (Type extends keyof MaverickEventRecord ? MaverickEventRecord[Type] : Event) | undefined {
  return walkTriggerEventChain(event, (e) => e.type === type)?.[0] as any;
}

/**
 * Whether a trigger event with the given `eventType` exists can be found in the event chain.
 *
 * @param event - The event on which to look for a trigger event.
 * @param type - The type of event to find.
 */
export function hasTriggerEvent(event: Event, type: string): boolean {
  return !!findTriggerEvent(event, type);
}

/**
 * Appends the given `triggerEvent` to the event chain. This means the new origin event will be
 * the origin of the given `triggerEvent`, or the `triggerEvent` itself (if no chain exists on the
 * trigger).
 *
 * @param event - The event on which to extend the trigger event chain.
 * @param triggerEvent - The trigger event that will becoming the new origin event.
 */
export function appendTriggerEvent(event: DOMEvent, triggerEvent?: Event) {
  const origin = (getOriginEvent(event) ?? event) as DOMEvent;
  defineEventProperty(origin, 'triggerEvent', () => triggerEvent);
}

export function defineEvent<Event>(
  init?: InferEventInit<Event>,
): Event extends DOMEvent ? Event : InferEventInit<Event> {
  return init as any;
}

export function defineEvents<EventRecord extends Record<string, DOMEvent>>(): EventRecord {
  // type macro which is compiled away.
  return null as any;
}

function defineEventProperty<T extends keyof DOMEvent>(
  event: DOMEvent,
  prop: T,
  value: () => DOMEvent[T],
) {
  Object.defineProperty(event, prop, {
    enumerable: true,
    configurable: true,
    get: value,
  });
}

export type InferEventDetail<Event> = Event extends DOMEvent<infer Detail>
  ? Detail
  : Event extends CustomEvent<infer Detail>
  ? Detail
  : never;

export type InferEventInit<Init> = Init extends Constructor<DOMEvent>
  ? DOMEventInit<InferEventDetail<InstanceType<Init>>>
  : Init extends DOMEvent
  ? DOMEventInit<InferEventDetail<Init>>
  : Init extends DOMEventInit
  ? Init
  : EventInit;

/**
 * Adds an event listener for the given `type`.
 *
 * This function is safe to use on the server.
 */
export function listen<Target extends EventTarget, EventType extends string>(
  target: Target,
  type: EventType,
  handler: JSX.TargetedEventHandler<
    Target,
    EventType extends keyof MaverickEventRecord ? MaverickEventRecord[EventType] : Event
  >,
  options?: AddEventListenerOptions | boolean,
) {
  if (__SERVER__) return;
  target.addEventListener(type, handler as any, options);
  onDispose(() => {
    target.removeEventListener(type, handler as any, options);
  });
}

export function isPointerEvent(event: Event | undefined): event is PointerEvent {
  return !!event?.type.startsWith('pointer');
}

export function isTouchEvent(event: Event | undefined): event is TouchEvent {
  return !!event?.type.startsWith('touch');
}

export function isMouseEvent(event: Event | undefined): event is MouseEvent {
  return /^(click|mouse)/.test(event?.type ?? '');
}

export function isKeyboardEvent(event: Event | undefined): event is KeyboardEvent {
  return !!event?.type.startsWith('key');
}

export function wasEnterKeyPressed(event: Event | undefined) {
  return isKeyboardEvent(event) && event.key === 'Enter';
}

export function wasEscapeKeyPressed(event: Event | undefined) {
  return isKeyboardEvent(event) && event.key === 'Escape';
}

export function isKeyboardClick(event: Event | undefined) {
  return isKeyboardEvent(event) && (event.key === 'Enter' || event.key === ' ');
}