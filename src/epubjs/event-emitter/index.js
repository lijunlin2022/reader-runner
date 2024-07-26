const { create, defineProperty, defineProperties } = Object;
const { apply, call } = Function.prototype;
const defaultDescriptor = { configurable: true, enumerable: false, writable: true };

// Helper function to check if a given argument is callable
function isCallable(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError(fn + ' is not a function');
  }
}

// Add an event listener
function on(eventType, listener) {
  isCallable(listener);
  let events;

  // Ensure the events storage object exists
  if (!Object.prototype.hasOwnProperty.call(this, '__events__')) {
    events = defaultDescriptor.value = create(null);
    defineProperty(this, '__events__', defaultDescriptor);
    defaultDescriptor.value = null;
  } else {
    events = this.__events__;
  }

  // Add listener to the specified event type
  if (!events[eventType]) {
    events[eventType] = listener;
  } else if (Array.isArray(events[eventType])) {
    events[eventType].push(listener);
  } else {
    events[eventType] = [events[eventType], listener];
  }

  return this;
}

// Add an event listener that will be called only once
function once(eventType, listener) {
  isCallable(listener);
  const self = this;

  function onceListener(...args) {
    off.call(self, eventType, onceListener);
    apply.call(listener, this, args);
  }

  onceListener.__originalListener__ = listener;
  on.call(this, eventType, onceListener);

  return this;
}

// Remove an event listener
function off(eventType, listener) {
  isCallable(listener);

  if (!Object.prototype.hasOwnProperty.call(this, '__events__')) {
    return this;
  }
  const events = this.__events__;
  const listeners = events[eventType];

  if (!listeners) {
    return this;
  }

  if (Array.isArray(listeners)) {
    for (let i = 0; i < listeners.length; i++) {
      const currentListener = listeners[i];
      if (currentListener === listener || currentListener.__originalListener__ === listener) {
        listeners.splice(i, 1);
        break;
      }
    }

    if (listeners.length === 0) {
      delete events[eventType];
    } else if (listeners.length === 1) {
      events[eventType] = listeners[0];
    }
  } else if (listeners === listener || listeners.__originalListener__ === listener) {
    delete events[eventType];
  }

  return this;
}

// Emit an event, calling all listeners for that event type
function emit(eventType, ...args) {
  if (!Object.prototype.hasOwnProperty.call(this, '__events__')) {
    return;
  }
  const listeners = this.__events__[eventType];

  if (!listeners) {
    return;
  }

  if (Array.isArray(listeners)) {
    listeners.slice().forEach(listener => apply.call(listener, this, args));
  } else {
    apply.call(listeners, this, args);
  }
}

const methods = { on, once, off, emit };

const descriptors = {
  on: { ...defaultDescriptor, value: on },
  once: { ...defaultDescriptor, value: once },
  off: { ...defaultDescriptor, value: off },
  emit: { ...defaultDescriptor, value: emit }
};

const baseObject = defineProperties({}, descriptors);

// Main export function to add event emitter methods to an object
export default function (obj) {
  return obj == null ? create(baseObject) : defineProperties(Object(obj), descriptors);
}

export { methods };
