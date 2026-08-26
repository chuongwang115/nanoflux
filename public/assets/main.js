// node_modules/esm-env/true.js
var true_default = true;
// node_modules/svelte/src/internal/shared/utils.js
var is_array = Array.isArray;
var index_of = Array.prototype.indexOf;
var includes = Array.prototype.includes;
var array_from = Array.from;
var object_keys = Object.keys;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
var get_descriptors = Object.getOwnPropertyDescriptors;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var get_prototype_of = Object.getPrototypeOf;
var is_extensible = Object.isExtensible;
function is_function(thing) {
  return typeof thing === "function";
}
var noop = () => {};
function run(fn) {
  return fn();
}
function run_all(arr) {
  for (var i = 0;i < arr.length; i++) {
    arr[i]();
  }
}
function deferred() {
  var resolve;
  var reject;
  var promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
function to_array(value, n) {
  if (Array.isArray(value)) {
    return value;
  }
  if (n === undefined || !(Symbol.iterator in value)) {
    return Array.from(value);
  }
  const array = [];
  for (const element of value) {
    array.push(element);
    if (array.length === n)
      break;
  }
  return array;
}

// node_modules/svelte/src/internal/client/constants.js
var DERIVED = 1 << 1;
var EFFECT = 1 << 2;
var RENDER_EFFECT = 1 << 3;
var MANAGED_EFFECT = 1 << 24;
var BLOCK_EFFECT = 1 << 4;
var BRANCH_EFFECT = 1 << 5;
var ROOT_EFFECT = 1 << 6;
var BOUNDARY_EFFECT = 1 << 7;
var CONNECTED = 1 << 9;
var CLEAN = 1 << 10;
var DIRTY = 1 << 11;
var MAYBE_DIRTY = 1 << 12;
var INERT = 1 << 13;
var DESTROYED = 1 << 14;
var REACTION_RAN = 1 << 15;
var DESTROYING = 1 << 25;
var EFFECT_TRANSPARENT = 1 << 16;
var EAGER_EFFECT = 1 << 17;
var HEAD_EFFECT = 1 << 18;
var EFFECT_PRESERVED = 1 << 19;
var USER_EFFECT = 1 << 20;
var EFFECT_OFFSCREEN = 1 << 25;
var WAS_MARKED = 1 << 16;
var REACTION_IS_UPDATING = 1 << 21;
var ASYNC = 1 << 22;
var ERROR_VALUE = 1 << 23;
var STATE_SYMBOL = Symbol("$state");
var LEGACY_PROPS = Symbol("legacy props");
var LOADING_ATTR_SYMBOL = Symbol("");
var PROXY_PATH_SYMBOL = Symbol("proxy path");
var ATTRIBUTES_CACHE = Symbol("attributes");
var CLASS_CACHE = Symbol("class");
var STYLE_CACHE = Symbol("style");
var TEXT_CACHE = Symbol("text");
var FORM_RESET_HANDLER = Symbol("form reset");
var HMR_ANCHOR = Symbol("hmr anchor");
var STALE_REACTION = new class StaleReactionError extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
};
var IS_XHTML = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

// node_modules/svelte/src/internal/shared/errors.js
function invariant_violation(message) {
  if (true_default) {
    const error = new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app — please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${message}"
https://svelte.dev/e/invariant_violation`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/invariant_violation`);
  }
}
function lifecycle_outside_component(name) {
  if (true_default) {
    const error = new Error(`lifecycle_outside_component
\`${name}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
  }
}

// node_modules/svelte/src/internal/client/errors.js
function async_derived_orphan() {
  if (true_default) {
    const error = new Error(`async_derived_orphan
Cannot create a \`$derived(...)\` with an \`await\` expression outside of an effect tree
https://svelte.dev/e/async_derived_orphan`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/async_derived_orphan`);
  }
}
function bind_invalid_checkbox_value() {
  if (true_default) {
    const error = new Error(`bind_invalid_checkbox_value
Using \`bind:value\` together with a checkbox input is not allowed. Use \`bind:checked\` instead
https://svelte.dev/e/bind_invalid_checkbox_value`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/bind_invalid_checkbox_value`);
  }
}
function derived_references_self() {
  if (true_default) {
    const error = new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/derived_references_self`);
  }
}
function each_key_duplicate(a, b, value) {
  if (true_default) {
    const error = new Error(`each_key_duplicate
${value ? `Keyed each block has duplicate key \`${value}\` at indexes ${a} and ${b}` : `Keyed each block has duplicate key at indexes ${a} and ${b}`}
https://svelte.dev/e/each_key_duplicate`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/each_key_duplicate`);
  }
}
function each_key_volatile(index, a, b) {
  if (true_default) {
    const error = new Error(`each_key_volatile
Keyed each block has key that is not idempotent — the key for item at index ${index} was \`${a}\` but is now \`${b}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/each_key_volatile`);
  }
}
function effect_in_teardown(rune) {
  if (true_default) {
    const error = new Error(`effect_in_teardown
\`${rune}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_in_teardown`);
  }
}
function effect_in_unowned_derived() {
  if (true_default) {
    const error = new Error(`effect_in_unowned_derived
Effect cannot be created inside a \`$derived\` value that was not itself created inside an effect
https://svelte.dev/e/effect_in_unowned_derived`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
  }
}
function effect_orphan(rune) {
  if (true_default) {
    const error = new Error(`effect_orphan
\`${rune}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_orphan`);
  }
}
function effect_update_depth_exceeded() {
  if (true_default) {
    const error = new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
  }
}
function hydration_failed() {
  if (true_default) {
    const error = new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/hydration_failed`);
  }
}
function invalid_snippet() {
  if (true_default) {
    const error = new Error(`invalid_snippet
Could not \`{@render}\` snippet due to the expression being \`null\` or \`undefined\`. Consider using optional chaining \`{@render snippet?.()}\`
https://svelte.dev/e/invalid_snippet`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/invalid_snippet`);
  }
}
function props_invalid_value(key) {
  if (true_default) {
    const error = new Error(`props_invalid_value
Cannot do \`bind:${key}={undefined}\` when \`${key}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/props_invalid_value`);
  }
}
function props_rest_readonly(property) {
  if (true_default) {
    const error = new Error(`props_rest_readonly
Rest element properties of \`$props()\` such as \`${property}\` are readonly
https://svelte.dev/e/props_rest_readonly`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/props_rest_readonly`);
  }
}
function rune_outside_svelte(rune) {
  if (true_default) {
    const error = new Error(`rune_outside_svelte
The \`${rune}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/rune_outside_svelte`);
  }
}
function state_descriptors_fixed() {
  if (true_default) {
    const error = new Error(`state_descriptors_fixed
Property descriptors defined on \`$state\` objects must contain \`value\` and always be \`enumerable\`, \`configurable\` and \`writable\`.
https://svelte.dev/e/state_descriptors_fixed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
  }
}
function state_prototype_fixed() {
  if (true_default) {
    const error = new Error(`state_prototype_fixed
Cannot set prototype of \`$state\` object
https://svelte.dev/e/state_prototype_fixed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
  }
}
function state_unsafe_mutation() {
  if (true_default) {
    const error = new Error(`state_unsafe_mutation
Updating state inside \`$derived(...)\`, \`$inspect(...)\` or a template expression is forbidden. If the value should not be reactive, declare it without \`$state\`
https://svelte.dev/e/state_unsafe_mutation`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
  }
}
function svelte_boundary_reset_onerror() {
  if (true_default) {
    const error = new Error(`svelte_boundary_reset_onerror
A \`<svelte:boundary>\` \`reset\` function cannot be called while an error is still being handled
https://svelte.dev/e/svelte_boundary_reset_onerror`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
  }
}

// node_modules/svelte/src/constants.js
var EACH_ITEM_REACTIVE = 1;
var EACH_INDEX_REACTIVE = 1 << 1;
var EACH_IS_CONTROLLED = 1 << 2;
var EACH_IS_ANIMATED = 1 << 3;
var EACH_ITEM_IMMUTABLE = 1 << 4;
var PROPS_IS_IMMUTABLE = 1;
var PROPS_IS_RUNES = 1 << 1;
var PROPS_IS_UPDATED = 1 << 2;
var PROPS_IS_BINDABLE = 1 << 3;
var PROPS_IS_LAZY_INITIAL = 1 << 4;
var TRANSITION_OUT = 1 << 1;
var TRANSITION_GLOBAL = 1 << 2;
var TEMPLATE_FRAGMENT = 1;
var TEMPLATE_USE_IMPORT_NODE = 1 << 1;
var TEMPLATE_USE_SVG = 1 << 2;
var TEMPLATE_USE_MATHML = 1 << 3;
var HYDRATION_START = "[";
var HYDRATION_START_ELSE = "[!";
var HYDRATION_START_FAILED = "[?";
var HYDRATION_END = "]";
var HYDRATION_ERROR = {};
var ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
var ELEMENT_IS_INPUT = 1 << 2;
var UNINITIALIZED = Symbol("uninitialized");
var FILENAME = Symbol("filename");
var HMR = Symbol("hmr");
var NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
var NAMESPACE_SVG = "http://www.w3.org/2000/svg";
var ATTACHMENT_KEY = "@attach";

// node_modules/svelte/src/internal/client/warnings.js
var bold = "font-weight: bold";
var normal = "font-weight: normal";
function await_reactivity_loss(name) {
  if (true_default) {
    console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${name}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/await_reactivity_loss`);
  }
}
function await_waterfall(name, location) {
  if (true_default) {
    console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${name}\` (${location}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/await_waterfall`);
  }
}
function derived_inert() {
  if (true_default) {
    console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/derived_inert`);
  }
}
function hydration_attribute_changed(attribute, html, value) {
  if (true_default) {
    console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${attribute}\` attribute on \`${html}\` changed its value between server and client renders. The client value, \`${value}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/hydration_attribute_changed`);
  }
}
function hydration_mismatch(location) {
  if (true_default) {
    console.warn(`%c[svelte] hydration_mismatch
%c${location ? `Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${location}` : "Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/hydration_mismatch`);
  }
}
function lifecycle_double_unmount() {
  if (true_default) {
    console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/lifecycle_double_unmount`);
  }
}
function select_multiple_invalid_value() {
  if (true_default) {
    console.warn(`%c[svelte] select_multiple_invalid_value
%cThe \`value\` property of a \`<select multiple>\` element should be an array, but it received a non-array value. The selection will be kept as is.
https://svelte.dev/e/select_multiple_invalid_value`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
  }
}
function state_proxy_equality_mismatch(operator) {
  if (true_default) {
    console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${operator}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/state_proxy_equality_mismatch`);
  }
}
function state_proxy_unmount() {
  if (true_default) {
    console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/state_proxy_unmount`);
  }
}
function svelte_boundary_reset_noop() {
  if (true_default) {
    console.warn(`%c[svelte] svelte_boundary_reset_noop
%cA \`<svelte:boundary>\` \`reset\` function only resets the boundary the first time it is called
https://svelte.dev/e/svelte_boundary_reset_noop`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
  }
}

// node_modules/svelte/src/internal/client/dom/hydration.js
var hydrating = false;
function set_hydrating(value) {
  hydrating = value;
}
var hydrate_node;
function set_hydrate_node(node) {
  if (node === null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return hydrate_node = node;
}
function hydrate_next() {
  return set_hydrate_node(get_next_sibling(hydrate_node));
}
function reset(node) {
  if (!hydrating)
    return;
  if (get_next_sibling(hydrate_node) !== null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  hydrate_node = node;
}
function next(count = 1) {
  if (hydrating) {
    var i = count;
    var node = hydrate_node;
    while (i--) {
      node = get_next_sibling(node);
    }
    hydrate_node = node;
  }
}
function skip_nodes(remove = true) {
  var depth = 0;
  var node = hydrate_node;
  while (true) {
    if (node.nodeType === COMMENT_NODE) {
      var data = node.data;
      if (data === HYDRATION_END) {
        if (depth === 0)
          return node;
        depth -= 1;
      } else if (data === HYDRATION_START || data === HYDRATION_START_ELSE || data[0] === "[" && !isNaN(Number(data.slice(1)))) {
        depth += 1;
      }
    }
    var next2 = get_next_sibling(node);
    if (remove)
      node.remove();
    node = next2;
  }
}
function read_hydration_instruction(node) {
  if (!node || node.nodeType !== COMMENT_NODE) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return node.data;
}

// node_modules/svelte/src/internal/client/reactivity/equality.js
function equals(value) {
  return value === this.v;
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}

// node_modules/svelte/src/internal/flags/index.js
var async_mode_flag = false;
var legacy_mode_flag = false;
var tracing_mode_flag = false;
function enable_legacy_mode_flag() {
  legacy_mode_flag = true;
}

// node_modules/svelte/src/internal/client/dev/tracing.js
var tracing_expressions = null;
function tag(source, label) {
  source.label = label;
  tag_proxy(source.v, label);
  return source;
}
function tag_proxy(value, label) {
  value?.[PROXY_PATH_SYMBOL]?.(label);
  return value;
}

// node_modules/svelte/src/internal/shared/dev.js
function get_error(label) {
  const error = new Error;
  const stack = get_stack();
  if (stack.length === 0) {
    return null;
  }
  stack.unshift(`
`);
  define_property(error, "stack", {
    value: stack.join(`
`)
  });
  define_property(error, "name", {
    value: label
  });
  return error;
}
function get_stack() {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;
  const stack = new Error().stack;
  Error.stackTraceLimit = limit;
  if (!stack)
    return [];
  const lines = stack.split(`
`);
  const new_lines = [];
  for (let i = 0;i < lines.length; i++) {
    const line = lines[i];
    const posixified = line.replaceAll("\\", "/");
    if (line.trim() === "Error") {
      continue;
    }
    if (line.includes("validate_each_keys")) {
      return [];
    }
    if (posixified.includes("svelte/src/internal") || posixified.includes("node_modules/.vite")) {
      continue;
    }
    new_lines.push(line);
  }
  return new_lines;
}
function invariant(condition, message) {
  if (!true_default) {
    throw new Error("invariant(...) was not guarded by if (DEV)");
  }
  if (!condition)
    invariant_violation(message);
}

// node_modules/svelte/src/internal/shared/context.js
function get_parent_context(context) {
  let parent = context.p;
  while (parent !== null && parent.c === null) {
    parent = parent.p;
  }
  return parent?.c ?? null;
}
function get_or_init_context_map(context, name) {
  if (context === null) {
    lifecycle_outside_component(name);
  }
  return context.c ??= new Map(get_parent_context(context) || undefined);
}

// node_modules/svelte/src/internal/client/context.js
var component_context = null;
function set_component_context(context) {
  component_context = context;
}
var dev_stack = null;
function set_dev_stack(stack) {
  dev_stack = stack;
}
var dev_current_component_function = null;
function set_dev_current_component_function(fn) {
  dev_current_component_function = fn;
}
function getContext(key) {
  const context_map = get_or_init_context_map(component_context, "getContext");
  const result = context_map.get(key);
  return result;
}
function push(props, runes = false, fn) {
  component_context = {
    p: component_context,
    i: false,
    c: null,
    e: null,
    s: props,
    x: null,
    r: active_effect,
    l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null
  };
  if (true_default) {
    component_context.function = fn;
    dev_current_component_function = fn;
  }
}
function pop(component) {
  var context = component_context;
  var effects = context.e;
  if (effects !== null) {
    context.e = null;
    for (var fn of effects) {
      create_user_effect(fn);
    }
  }
  if (component !== undefined) {
    context.x = component;
  }
  context.i = true;
  component_context = context.p;
  if (true_default) {
    dev_current_component_function = component_context?.function ?? null;
  }
  return component ?? {};
}
function is_runes() {
  return !legacy_mode_flag || component_context !== null && component_context.l === null;
}

// node_modules/svelte/src/internal/client/dom/task.js
var micro_tasks = [];
function run_micro_tasks() {
  var tasks = micro_tasks;
  micro_tasks = [];
  run_all(tasks);
}
function queue_micro_task(fn) {
  if (micro_tasks.length === 0 && !is_flushing_sync) {
    var tasks = micro_tasks;
    queueMicrotask(() => {
      if (tasks === micro_tasks)
        run_micro_tasks();
    });
  }
  micro_tasks.push(fn);
}
function flush_tasks() {
  while (micro_tasks.length > 0) {
    run_micro_tasks();
  }
}

// node_modules/svelte/src/internal/client/error-handling.js
var adjustments = new WeakMap;
function handle_error(error) {
  var effect = active_effect;
  if (effect === null) {
    active_reaction.f |= ERROR_VALUE;
    return error;
  }
  if (true_default && error instanceof Error && !adjustments.has(error)) {
    adjustments.set(error, get_adjustments(error, effect));
  }
  if ((effect.f & REACTION_RAN) === 0 && (effect.f & EFFECT) === 0) {
    if (true_default && !effect.parent && error instanceof Error) {
      apply_adjustments(error);
    }
    throw error;
  }
  invoke_error_boundary(error, effect);
}
function invoke_error_boundary(error, effect) {
  if (effect !== null && (effect.f & DESTROYED) !== 0) {
    return;
  }
  while (effect !== null) {
    if ((effect.f & BOUNDARY_EFFECT) !== 0) {
      if ((effect.f & REACTION_RAN) === 0) {
        throw error;
      }
      try {
        effect.b.error(error);
        return;
      } catch (e) {
        error = e;
      }
    }
    effect = effect.parent;
  }
  if (true_default && error instanceof Error) {
    apply_adjustments(error);
  }
  throw error;
}
function get_adjustments(error, effect) {
  const message_descriptor = get_descriptor(error, "message");
  if (message_descriptor && !message_descriptor.configurable)
    return;
  var indent = is_firefox ? "  " : "\t";
  var component_stack = `
${indent}in ${effect.fn?.name || "<unknown>"}`;
  var context = effect.ctx;
  while (context !== null) {
    component_stack += `
${indent}in ${context.function?.[FILENAME].split("/").pop()}`;
    context = context.p;
  }
  return {
    message: error.message + `
${component_stack}
`,
    stack: error.stack?.split(`
`).filter((line) => !line.includes("svelte/src/internal")).join(`
`)
  };
}
function apply_adjustments(error) {
  const adjusted = adjustments.get(error);
  if (adjusted) {
    define_property(error, "message", {
      value: adjusted.message
    });
    define_property(error, "stack", {
      value: adjusted.stack
    });
  }
}

// node_modules/svelte/src/internal/client/reactivity/status.js
var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
function set_signal_status(signal, status) {
  signal.f = signal.f & STATUS_MASK | status;
}
function update_derived_status(derived) {
  if ((derived.f & CONNECTED) !== 0 || derived.deps === null) {
    set_signal_status(derived, CLEAN);
  } else {
    set_signal_status(derived, MAYBE_DIRTY);
  }
}

// node_modules/svelte/src/internal/client/reactivity/utils.js
function clear_marked(deps) {
  if (deps === null)
    return;
  for (const dep of deps) {
    if ((dep.f & DERIVED) === 0 || (dep.f & WAS_MARKED) === 0) {
      continue;
    }
    dep.f ^= WAS_MARKED;
    clear_marked(dep.deps);
  }
}
function defer_effect(effect, dirty_effects, maybe_dirty_effects) {
  if ((effect.f & DIRTY) !== 0) {
    dirty_effects.add(effect);
  } else if ((effect.f & MAYBE_DIRTY) !== 0) {
    maybe_dirty_effects.add(effect);
  }
  clear_marked(effect.deps);
  set_signal_status(effect, CLEAN);
}

// node_modules/svelte/src/store/utils.js
function subscribe_to_store(store, run2, invalidate) {
  if (store == null) {
    run2(undefined);
    if (invalidate)
      invalidate(undefined);
    return noop;
  }
  const unsub = untrack(() => store.subscribe(run2, invalidate));
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}

// node_modules/svelte/src/store/shared/index.js
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop = null;
  const subscribers = new Set;
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0;i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
function get(store) {
  let value;
  subscribe_to_store(store, (_) => value = _)();
  return value;
}

// node_modules/svelte/src/internal/client/reactivity/store.js
var legacy_is_updating_store = false;
var is_store_binding = false;
var IS_UNMOUNTED = Symbol("unmounted");
function store_get(store, store_name, stores) {
  const entry = stores[store_name] ??= {
    store: null,
    source: mutable_source(undefined),
    unsubscribe: noop
  };
  if (true_default) {
    entry.source.label = store_name;
  }
  if (entry.store !== store && !(IS_UNMOUNTED in stores)) {
    entry.unsubscribe();
    entry.store = store ?? null;
    if (store == null) {
      entry.source.v = undefined;
      entry.unsubscribe = noop;
    } else {
      var is_synchronous_callback = true;
      entry.unsubscribe = subscribe_to_store(store, (v) => {
        if (is_synchronous_callback) {
          entry.source.v = v;
        } else {
          set(entry.source, v);
        }
      });
      is_synchronous_callback = false;
    }
  }
  if (store && IS_UNMOUNTED in stores) {
    return get(store);
  }
  return get2(entry.source);
}
function setup_stores() {
  const stores = {};
  function cleanup() {
    teardown(() => {
      for (var store_name in stores) {
        const ref = stores[store_name];
        ref.unsubscribe();
      }
      define_property(stores, IS_UNMOUNTED, {
        enumerable: false,
        value: true
      });
    });
  }
  return [stores, cleanup];
}
function capture_store_binding(fn) {
  var previous_is_store_binding = is_store_binding;
  try {
    is_store_binding = false;
    return [fn(), is_store_binding];
  } finally {
    is_store_binding = previous_is_store_binding;
  }
}

// node_modules/svelte/src/internal/client/dom/elements/misc.js
function autofocus(dom, value) {
  if (value) {
    const body = document.body;
    dom.autofocus = true;
    queue_micro_task(() => {
      if (document.activeElement === body) {
        dom.focus();
      }
    });
  }
}
function remove_textarea_child(dom) {
  if (hydrating && get_first_child(dom) !== null) {
    clear_text_content(dom);
  }
}
var listening_to_form_reset = false;
function add_form_reset_listener() {
  if (!listening_to_form_reset) {
    listening_to_form_reset = true;
    document.addEventListener("reset", (evt) => {
      Promise.resolve().then(() => {
        if (!evt.defaultPrevented) {
          for (const e of evt.target.elements) {
            e[FORM_RESET_HANDLER]?.();
          }
        }
      });
    }, { capture: true });
  }
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function without_reactive_context(fn) {
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    return fn();
  } finally {
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
function listen_to_event_and_reset_event(element, event, handler, on_reset = handler) {
  element.addEventListener(event, () => without_reactive_context(handler));
  const prev = element[FORM_RESET_HANDLER];
  if (prev) {
    element[FORM_RESET_HANDLER] = () => {
      prev();
      on_reset(true);
    };
  } else {
    element[FORM_RESET_HANDLER] = () => on_reset(true);
  }
  add_form_reset_listener();
}

// node_modules/svelte/src/reactivity/create-subscriber.js
function createSubscriber(start) {
  let subscribers = 0;
  let version = source(0);
  let stop;
  if (true_default) {
    tag(version, "createSubscriber version");
  }
  return () => {
    if (effect_tracking()) {
      get2(version);
      render_effect(() => {
        if (subscribers === 0) {
          stop = untrack(() => start(() => increment(version)));
        }
        subscribers += 1;
        return () => {
          queue_micro_task(() => {
            subscribers -= 1;
            if (subscribers === 0) {
              stop?.();
              stop = undefined;
              increment(version);
            }
          });
        };
      });
    }
  };
}

// node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;
function boundary(node, props, children, transform_error) {
  new Boundary(node, props, children, transform_error);
}

class Boundary {
  parent;
  is_pending = false;
  transform_error;
  #anchor;
  #hydrate_open = hydrating ? hydrate_node : null;
  #props;
  #children;
  #effect;
  #main_effect = null;
  #pending_effect = null;
  #failed_effect = null;
  #offscreen_fragment = null;
  #local_pending_count = 0;
  #pending_count = 0;
  #pending_count_update_queued = false;
  #dirty_effects = new Set;
  #maybe_dirty_effects = new Set;
  #effect_pending = null;
  #effect_pending_subscriber = createSubscriber(() => {
    this.#effect_pending = source(this.#local_pending_count);
    if (true_default) {
      tag(this.#effect_pending, "$effect.pending()");
    }
    return () => {
      this.#effect_pending = null;
    };
  });
  constructor(node, props, children, transform_error) {
    this.#anchor = node;
    this.#props = props;
    this.#children = (anchor) => {
      var effect = active_effect;
      effect.b = this;
      effect.f |= BOUNDARY_EFFECT;
      children(anchor);
    };
    this.parent = active_effect.b;
    this.transform_error = transform_error ?? this.parent?.transform_error ?? ((e) => e);
    this.#effect = block(() => {
      if (hydrating) {
        const comment = this.#hydrate_open;
        hydrate_next();
        const server_rendered_pending = comment.data === HYDRATION_START_ELSE;
        const server_rendered_failed = comment.data.startsWith(HYDRATION_START_FAILED);
        if (server_rendered_failed) {
          const serialized_error = JSON.parse(comment.data.slice(HYDRATION_START_FAILED.length));
          this.#hydrate_failed_content(serialized_error);
        } else if (server_rendered_pending) {
          this.#hydrate_pending_content();
        } else {
          this.#hydrate_resolved_content();
        }
      } else {
        this.#render();
      }
    }, flags);
    if (hydrating) {
      this.#anchor = hydrate_node;
    }
  }
  #hydrate_resolved_content() {
    try {
      this.#main_effect = branch(() => this.#children(this.#anchor));
    } catch (error) {
      this.error(error);
    }
  }
  #hydrate_failed_content(error) {
    const failed = this.#props.failed;
    const { reset: reset2, invoke_onerror } = this.#create_reset(error);
    queue_micro_task(invoke_onerror);
    if (!failed)
      return;
    this.#failed_effect = branch(() => {
      failed(this.#anchor, () => error, () => reset2);
    });
  }
  #create_reset(error) {
    var did_reset = false;
    var calling_on_error = false;
    const reset2 = () => {
      if (did_reset) {
        svelte_boundary_reset_noop();
        return;
      }
      did_reset = true;
      if (calling_on_error) {
        svelte_boundary_reset_onerror();
      }
      if (this.#failed_effect !== null) {
        pause_effect(this.#failed_effect, () => {
          this.#failed_effect = null;
        });
      }
      this.#run(() => {
        this.#render();
      });
    };
    const invoke_onerror = () => {
      try {
        calling_on_error = true;
        this.#props.onerror?.(error, reset2);
        calling_on_error = false;
      } catch (err) {
        invoke_error_boundary(err, this.#effect && this.#effect.parent);
      }
    };
    return { reset: reset2, invoke_onerror };
  }
  #hydrate_pending_content() {
    const pending = this.#props.pending;
    if (!pending)
      return;
    this.is_pending = true;
    this.#pending_effect = branch(() => pending(this.#anchor));
    queue_micro_task(() => {
      var fragment = this.#offscreen_fragment = document.createDocumentFragment();
      var anchor = create_text();
      fragment.append(anchor);
      this.#main_effect = this.#run(() => {
        return branch(() => this.#children(anchor));
      });
      if (this.#pending_count === 0) {
        this.#anchor.before(fragment);
        this.#offscreen_fragment = null;
        pause_effect(this.#pending_effect, () => {
          this.#pending_effect = null;
        });
        this.#resolve(current_batch);
      }
    });
  }
  #render() {
    try {
      this.is_pending = this.has_pending_snippet();
      this.#pending_count = 0;
      this.#local_pending_count = 0;
      this.#main_effect = branch(() => {
        this.#children(this.#anchor);
      });
      if (this.#pending_count > 0) {
        var fragment = this.#offscreen_fragment = document.createDocumentFragment();
        move_effect(this.#main_effect, fragment);
        const pending = this.#props.pending;
        this.#pending_effect = branch(() => pending(this.#anchor));
      } else {
        this.#resolve(current_batch);
      }
    } catch (error) {
      this.error(error);
    }
  }
  #resolve(batch) {
    this.is_pending = false;
    batch.transfer_effects(this.#dirty_effects, this.#maybe_dirty_effects);
  }
  defer_effect(effect) {
    defer_effect(effect, this.#dirty_effects, this.#maybe_dirty_effects);
  }
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!this.#props.pending;
  }
  #run(fn) {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_ctx = component_context;
    set_active_effect(this.#effect);
    set_active_reaction(this.#effect);
    set_component_context(this.#effect.ctx);
    try {
      Batch.ensure();
      return fn();
    } catch (e) {
      handle_error(e);
      return null;
    } finally {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_ctx);
    }
  }
  #update_pending_count(d, batch) {
    if (!this.has_pending_snippet()) {
      if (this.parent) {
        this.parent.#update_pending_count(d, batch);
      }
      return;
    }
    this.#pending_count += d;
    if (this.#pending_count === 0) {
      this.#resolve(batch);
      if (this.#pending_effect) {
        pause_effect(this.#pending_effect, () => {
          this.#pending_effect = null;
        });
      }
      if (this.#offscreen_fragment) {
        this.#anchor.before(this.#offscreen_fragment);
        this.#offscreen_fragment = null;
      }
    }
  }
  update_pending_count(d, batch) {
    this.#update_pending_count(d, batch);
    this.#local_pending_count += d;
    if (!this.#effect_pending || this.#pending_count_update_queued)
      return;
    this.#pending_count_update_queued = true;
    queue_micro_task(() => {
      this.#pending_count_update_queued = false;
      if (this.#effect_pending) {
        internal_set(this.#effect_pending, this.#local_pending_count);
      }
    });
  }
  get_effect_pending() {
    this.#effect_pending_subscriber();
    return get2(this.#effect_pending);
  }
  error(error) {
    if (!this.#props.onerror && !this.#props.failed) {
      throw error;
    }
    if (current_batch?.is_fork) {
      if (this.#main_effect)
        current_batch.skip_effect(this.#main_effect);
      if (this.#pending_effect)
        current_batch.skip_effect(this.#pending_effect);
      if (this.#failed_effect)
        current_batch.skip_effect(this.#failed_effect);
      current_batch.oncommit(() => {
        this.#handle_error(error);
      });
    } else {
      this.#handle_error(error);
    }
  }
  #handle_error(error) {
    if (this.#main_effect) {
      destroy_effect(this.#main_effect);
      this.#main_effect = null;
    }
    if (this.#pending_effect) {
      destroy_effect(this.#pending_effect);
      this.#pending_effect = null;
    }
    if (this.#failed_effect) {
      destroy_effect(this.#failed_effect);
      this.#failed_effect = null;
    }
    if (hydrating) {
      set_hydrate_node(this.#hydrate_open);
      next();
      set_hydrate_node(skip_nodes());
    }
    let failed = this.#props.failed;
    const handle_error_result = (transformed_error) => {
      const { reset: reset2, invoke_onerror } = this.#create_reset(transformed_error);
      invoke_onerror();
      if (failed) {
        this.#failed_effect = this.#run(() => {
          try {
            return branch(() => {
              var effect = active_effect;
              effect.b = this;
              effect.f |= BOUNDARY_EFFECT;
              failed(this.#anchor, () => transformed_error, () => reset2);
            });
          } catch (error2) {
            invoke_error_boundary(error2, this.#effect.parent);
            return null;
          }
        });
      }
    };
    queue_micro_task(() => {
      var result;
      try {
        result = this.transform_error(error);
      } catch (e) {
        invoke_error_boundary(e, this.#effect && this.#effect.parent);
        return;
      }
      if (result !== null && typeof result === "object" && typeof result.then === "function") {
        result.then(handle_error_result, (e) => invoke_error_boundary(e, this.#effect && this.#effect.parent));
      } else {
        handle_error_result(result);
      }
    });
  }
}

// node_modules/svelte/src/internal/client/reactivity/async.js
function flatten(blockers, sync, async, fn) {
  const d = is_runes() ? derived : derived_safe_equal;
  var pending = blockers.filter((b) => !b.settled);
  var deriveds = sync.map(d);
  if (true_default) {
    deriveds.forEach((d2, i) => {
      d2.label = sync[i].toString().replace("() => ", "").replaceAll("$.eager(() => ", "$state.eager(").replace(/\$\.get\((.+?)\)/g, (_, id) => id);
    });
  }
  if (async.length === 0 && pending.length === 0) {
    fn(deriveds);
    return;
  }
  var parent = active_effect;
  var restore = capture();
  var blocker_promise = pending.length === 1 ? pending[0].promise : pending.length > 1 ? Promise.all(pending.map((b) => b.promise)) : null;
  function finish(async2) {
    if ((parent.f & DESTROYED) !== 0) {
      return;
    }
    restore();
    try {
      fn([...deriveds, ...async2]);
    } catch (error) {
      invoke_error_boundary(error, parent);
    }
    unset_context();
  }
  var decrement_pending = increment_pending();
  if (async.length === 0) {
    blocker_promise.then(() => finish([])).finally(decrement_pending);
    return;
  }
  function run2() {
    Promise.all(async.map((expression) => async_derived(expression))).then(finish).catch((error) => invoke_error_boundary(error, parent)).finally(decrement_pending);
  }
  if (blocker_promise) {
    blocker_promise.then(() => {
      restore();
      run2();
      unset_context();
    });
  } else {
    run2();
  }
}
function capture() {
  var previous_effect = active_effect;
  var previous_reaction = active_reaction;
  var previous_component_context = component_context;
  var previous_batch = current_batch;
  if (true_default) {
    var previous_dev_stack = dev_stack;
  }
  return function restore(activate_batch = true) {
    set_active_effect(previous_effect);
    set_active_reaction(previous_reaction);
    set_component_context(previous_component_context);
    if (activate_batch && (previous_effect.f & DESTROYED) === 0) {
      previous_batch?.activate();
      previous_batch?.apply();
    }
    if (true_default) {
      set_reactivity_loss_tracker(null);
      set_dev_stack(previous_dev_stack);
    }
  };
}
function unset_context(deactivate_batch = true) {
  set_active_effect(null);
  set_active_reaction(null);
  set_component_context(null);
  if (deactivate_batch)
    current_batch?.deactivate();
  if (true_default) {
    set_reactivity_loss_tracker(null);
    set_dev_stack(null);
  }
}
function increment_pending() {
  var effect = active_effect;
  var boundary2 = effect.b;
  var batch = current_batch;
  var blocking = !!boundary2?.is_rendered();
  boundary2?.update_pending_count(1, batch);
  batch.increment(blocking, effect);
  return () => {
    boundary2?.update_pending_count(-1, batch);
    batch.decrement(blocking, effect);
  };
}

// node_modules/svelte/src/internal/client/reactivity/deriveds.js
var reactivity_loss_tracker = null;
function set_reactivity_loss_tracker(v) {
  reactivity_loss_tracker = v;
}
var recent_async_deriveds = new Set;
function derived(fn) {
  var flags2 = DERIVED | DIRTY;
  if (active_effect !== null) {
    active_effect.f |= EFFECT_PRESERVED;
  }
  const signal = {
    ctx: component_context,
    deps: null,
    effects: null,
    equals,
    f: flags2,
    fn,
    reactions: null,
    rv: 0,
    v: UNINITIALIZED,
    wv: 0,
    parent: active_effect,
    ac: null
  };
  if (true_default && tracing_mode_flag) {
    signal.created = get_error("created at");
  }
  return signal;
}
var OBSOLETE = Symbol("obsolete");
function async_derived(fn, label, location) {
  let parent = active_effect;
  if (parent === null) {
    async_derived_orphan();
  }
  var promise = undefined;
  var signal = source(UNINITIALIZED);
  if (true_default)
    signal.label = label ?? fn.toString();
  var should_suspend = !active_reaction;
  var deferreds = new Set;
  async_effect(() => {
    var effect = active_effect;
    if (true_default) {
      reactivity_loss_tracker = { effect, effect_deps: new Set, warned: false };
    }
    var d = deferred();
    promise = d.promise;
    try {
      Promise.resolve(fn()).then(d.resolve, (e) => {
        if (e !== STALE_REACTION)
          d.reject(e);
      }).finally(unset_context);
    } catch (error) {
      d.reject(error);
      unset_context();
    }
    if (true_default) {
      if (reactivity_loss_tracker) {
        if (effect.deps !== null) {
          for (let i = 0;i < skipped_deps; i += 1) {
            reactivity_loss_tracker.effect_deps.add(effect.deps[i]);
          }
        }
        if (new_deps !== null) {
          for (let i = 0;i < new_deps.length; i += 1) {
            reactivity_loss_tracker.effect_deps.add(new_deps[i]);
          }
        }
      }
      reactivity_loss_tracker = null;
    }
    var batch = current_batch;
    if (should_suspend) {
      if ((effect.f & REACTION_RAN) !== 0) {
        var decrement_pending = increment_pending();
      }
      if (parent.b?.is_rendered()) {
        batch.async_deriveds.get(effect)?.reject(OBSOLETE);
      } else {
        for (const d2 of deferreds.values()) {
          d2.reject(OBSOLETE);
        }
      }
      deferreds.add(d);
      batch.async_deriveds.set(effect, d);
    }
    const handler = (value, error = undefined) => {
      if (true_default) {
        reactivity_loss_tracker = null;
      }
      decrement_pending?.();
      deferreds.delete(d);
      if (error === OBSOLETE)
        return;
      batch.activate();
      if (error) {
        signal.f |= ERROR_VALUE;
        internal_set(signal, error);
      } else {
        if ((signal.f & ERROR_VALUE) !== 0) {
          signal.f ^= ERROR_VALUE;
        }
        if (true_default && location !== undefined && !signal.equals(value)) {
          recent_async_deriveds.add(signal);
          setTimeout(() => {
            if (recent_async_deriveds.has(signal) && (effect.f & DESTROYED) === 0) {
              await_waterfall(signal.label, location);
              recent_async_deriveds.delete(signal);
            }
          });
        }
        internal_set(signal, value);
      }
      batch.deactivate();
    };
    d.promise.then(handler, (e) => handler(null, e || "unknown"));
  });
  teardown(() => {
    for (const d of deferreds) {
      d.reject(OBSOLETE);
    }
  });
  if (true_default) {
    signal.f |= ASYNC;
  }
  return new Promise((fulfil) => {
    function next2(p) {
      function go() {
        if (p === promise) {
          fulfil(signal);
        } else {
          next2(promise);
        }
      }
      p.then(go, go);
    }
    next2(promise);
  });
}
function user_derived(fn) {
  const d = derived(fn);
  if (!async_mode_flag)
    push_reaction_value(d);
  return d;
}
function derived_safe_equal(fn) {
  const signal = derived(fn);
  signal.equals = safe_equals;
  return signal;
}
function destroy_derived_effects(derived2) {
  var effects = derived2.effects;
  if (effects !== null) {
    derived2.effects = null;
    for (var i = 0;i < effects.length; i += 1) {
      destroy_effect(effects[i]);
    }
  }
}
var stack = [];
function execute_derived(derived2) {
  var value;
  var prev_active_effect = active_effect;
  var parent = derived2.parent;
  if (!is_destroying_effect && parent !== null && derived2.v !== UNINITIALIZED && (parent.f & (DESTROYED | INERT)) !== 0) {
    derived_inert();
    return derived2.v;
  }
  set_active_effect(parent);
  if (true_default) {
    let prev_eager_effects = eager_effects;
    set_eager_effects(new Set);
    try {
      if (includes.call(stack, derived2)) {
        derived_references_self();
      }
      stack.push(derived2);
      derived2.f &= ~WAS_MARKED;
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
      set_eager_effects(prev_eager_effects);
      stack.pop();
    }
  } else {
    try {
      derived2.f &= ~WAS_MARKED;
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
    }
  }
  return value;
}
function update_derived(derived2) {
  var value = execute_derived(derived2);
  if (!derived2.equals(value)) {
    derived2.wv = increment_write_version();
    if (!current_batch?.is_fork || derived2.deps === null) {
      if (current_batch !== null) {
        current_batch.capture(derived2, value, true);
        previous_batch?.capture(derived2, value, true);
      } else {
        derived2.v = value;
      }
      if (derived2.deps === null) {
        set_signal_status(derived2, CLEAN);
        return;
      }
    }
  }
  if (is_destroying_effect) {
    return;
  }
  if (batch_values !== null) {
    if (effect_tracking() || current_batch?.is_fork) {
      batch_values.set(derived2, value);
    }
  } else {
    update_derived_status(derived2);
  }
}
function freeze_derived_effects(derived2) {
  if (derived2.effects === null)
    return;
  for (const e of derived2.effects) {
    if (e.teardown || e.ac) {
      e.teardown?.();
      if (e.ac !== null) {
        without_reactive_context(() => {
          e.ac.abort(STALE_REACTION);
          e.ac = null;
        });
      }
      if (e.fn !== null)
        e.teardown = noop;
      remove_reactions(e, 0);
      destroy_effect_children(e);
    }
  }
}
function unfreeze_derived_effects(derived2) {
  if (derived2.effects === null)
    return;
  for (const e of derived2.effects) {
    if (e.teardown && e.fn !== null) {
      update_effect(e);
    }
  }
}

// node_modules/svelte/src/internal/client/reactivity/batch.js
var first_batch = null;
var last_batch = null;
var current_batch = null;
var previous_batch = null;
var batch_values = null;
var last_scheduled_effect = null;
var is_flushing_sync = false;
var is_processing = false;
var collected_effects = null;
var legacy_updates = null;
var flush_count = 0;
var source_stacks = new Set;
var uid = 1;

class Batch {
  id = uid++;
  #started = false;
  linked = true;
  #prev = null;
  #next = null;
  async_deriveds = new Map;
  current = new Map;
  previous = new Map;
  #commit_callbacks = new Set;
  #discard_callbacks = new Set;
  #pending = 0;
  #blocking_pending = new Map;
  #deferred = null;
  #roots = [];
  #new_effects = [];
  #dirty_effects = new Set;
  #maybe_dirty_effects = new Set;
  #skipped_branches = new Map;
  #unskipped_branches = new Set;
  is_fork = false;
  #decrement_queued = false;
  constructor() {
    if (last_batch === null) {
      first_batch = last_batch = this;
    } else {
      last_batch.#next = this;
      this.#prev = last_batch;
    }
    last_batch = this;
  }
  #is_deferred() {
    if (this.is_fork)
      return true;
    for (const effect of this.#blocking_pending.keys()) {
      var e = effect;
      var skipped = false;
      while (e.parent !== null) {
        if (this.#skipped_branches.has(e)) {
          skipped = true;
          break;
        }
        e = e.parent;
      }
      if (!skipped) {
        return true;
      }
    }
    return false;
  }
  skip_effect(effect) {
    if (!this.#skipped_branches.has(effect)) {
      this.#skipped_branches.set(effect, { d: [], m: [] });
    }
    this.#unskipped_branches.delete(effect);
  }
  unskip_effect(effect, callback = (e) => this.schedule(e)) {
    var tracked = this.#skipped_branches.get(effect);
    if (tracked) {
      this.#skipped_branches.delete(effect);
      for (var e of tracked.d) {
        set_signal_status(e, DIRTY);
        callback(e);
      }
      for (e of tracked.m) {
        set_signal_status(e, MAYBE_DIRTY);
        callback(e);
      }
    }
    this.#unskipped_branches.add(effect);
  }
  #process() {
    this.#started = true;
    if (flush_count++ > 1000) {
      this.#unlink();
      infinite_loop_guard();
    }
    if (true_default) {
      for (const value of this.current.keys()) {
        source_stacks.add(value);
      }
    }
    for (const e of this.#dirty_effects) {
      this.#maybe_dirty_effects.delete(e);
      set_signal_status(e, DIRTY);
      this.schedule(e);
    }
    for (const e of this.#maybe_dirty_effects) {
      set_signal_status(e, MAYBE_DIRTY);
      this.schedule(e);
    }
    const roots = this.#roots;
    this.#roots = [];
    this.apply();
    var effects = collected_effects = [];
    var render_effects = [];
    var updates = legacy_updates = [];
    for (const root of roots) {
      try {
        this.#traverse(root, effects, render_effects);
      } catch (e) {
        reset_all(root);
        if (!this.#is_deferred())
          this.discard();
        throw e;
      }
    }
    current_batch = null;
    if (updates.length > 0) {
      var batch = Batch.ensure();
      for (const e of updates) {
        batch.schedule(e);
      }
    }
    collected_effects = null;
    legacy_updates = null;
    if (this.#is_deferred()) {
      this.#defer_effects(render_effects);
      this.#defer_effects(effects);
      for (const [e, t] of this.#skipped_branches) {
        reset_branch(e, t);
      }
      if (updates.length > 0) {
        current_batch.#process();
      }
      return;
    }
    const earlier_batch = this.#find_earlier_batch();
    if (earlier_batch) {
      this.#defer_effects(render_effects);
      this.#defer_effects(effects);
      earlier_batch.#merge(this);
      return;
    }
    this.#dirty_effects.clear();
    this.#maybe_dirty_effects.clear();
    for (const fn of this.#commit_callbacks)
      fn(this);
    this.#commit_callbacks.clear();
    previous_batch = this;
    flush_queued_effects(render_effects);
    flush_queued_effects(effects);
    previous_batch = null;
    this.#deferred?.resolve();
    var next_batch = current_batch;
    if (this.#pending === 0 && (this.#roots.length === 0 || next_batch !== null)) {
      this.#unlink();
      if (async_mode_flag) {
        this.#commit();
        current_batch = next_batch;
      }
    }
    if (this.#roots.length > 0) {
      if (next_batch !== null) {
        const batch2 = next_batch;
        batch2.#roots.push(...this.#roots.filter((r) => !batch2.#roots.includes(r)));
      } else {
        next_batch = this;
      }
    }
    if (next_batch !== null) {
      old_values.clear();
      next_batch.#process();
    }
  }
  #traverse(root, effects, render_effects) {
    root.f ^= CLEAN;
    var effect = root.first;
    while (effect !== null) {
      var flags2 = effect.f;
      var is_branch = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags2 & CLEAN) !== 0;
      var skip = is_skippable_branch || (flags2 & INERT) !== 0 || this.#skipped_branches.has(effect);
      if (!skip && effect.fn !== null) {
        if (is_branch) {
          effect.f ^= CLEAN;
        } else if ((flags2 & EFFECT) !== 0) {
          effects.push(effect);
        } else if (async_mode_flag && (flags2 & (RENDER_EFFECT | MANAGED_EFFECT)) !== 0) {
          render_effects.push(effect);
        } else if (is_dirty(effect)) {
          if ((flags2 & BLOCK_EFFECT) !== 0)
            this.#maybe_dirty_effects.add(effect);
          update_effect(effect);
        }
        var child = effect.first;
        if (child !== null) {
          effect = child;
          continue;
        }
      }
      while (effect !== null) {
        var next2 = effect.next;
        if (next2 !== null) {
          effect = next2;
          break;
        }
        effect = effect.parent;
      }
    }
  }
  #find_earlier_batch() {
    var batch = this.#prev;
    while (batch !== null) {
      if (!batch.is_fork) {
        for (const [value, [, is_derived]] of this.current) {
          if (batch.current.has(value) && !is_derived) {
            return batch;
          }
        }
      }
      batch = batch.#prev;
    }
    return null;
  }
  #merge(batch) {
    for (const [source2, value] of batch.current) {
      if (!this.previous.has(source2) && batch.previous.has(source2)) {
        this.previous.set(source2, batch.previous.get(source2));
      }
      this.current.set(source2, value);
    }
    for (const [effect, deferred2] of batch.async_deriveds) {
      const d = this.async_deriveds.get(effect);
      if (d)
        deferred2.promise.then(d.resolve).catch(d.reject);
    }
    batch.async_deriveds.clear();
    this.transfer_effects(batch.#dirty_effects, batch.#maybe_dirty_effects);
    const mark = (value) => {
      var reactions = value.reactions;
      if (reactions === null)
        return;
      if ((value.f & DERIVED) !== 0 && (value.f & (DIRTY | MAYBE_DIRTY)) === 0) {
        return;
      }
      for (const reaction of reactions) {
        var flags2 = reaction.f;
        if ((flags2 & DERIVED) !== 0) {
          mark(reaction);
        } else {
          var effect = reaction;
          if (flags2 & (ASYNC | BLOCK_EFFECT) && !this.async_deriveds.has(effect)) {
            this.#maybe_dirty_effects.delete(effect);
            set_signal_status(effect, DIRTY);
            this.schedule(effect);
          }
        }
      }
    };
    for (const source2 of this.current.keys()) {
      mark(source2);
    }
    this.oncommit(() => batch.discard());
    batch.#unlink();
    current_batch = this;
    this.#process();
  }
  #defer_effects(effects) {
    for (var i = 0;i < effects.length; i += 1) {
      defer_effect(effects[i], this.#dirty_effects, this.#maybe_dirty_effects);
    }
  }
  capture(source2, value, is_derived = false) {
    if (source2.v !== UNINITIALIZED && !this.previous.has(source2)) {
      this.previous.set(source2, source2.v);
    }
    if ((source2.f & ERROR_VALUE) === 0) {
      this.current.set(source2, [value, is_derived]);
      batch_values?.set(source2, value);
    }
    if (!this.is_fork) {
      source2.v = value;
    }
  }
  activate() {
    current_batch = this;
  }
  deactivate() {
    current_batch = null;
    batch_values = null;
  }
  flush() {
    try {
      if (true_default) {
        source_stacks.clear();
      }
      is_processing = true;
      current_batch = this;
      this.#process();
    } finally {
      flush_count = 0;
      last_scheduled_effect = null;
      collected_effects = null;
      legacy_updates = null;
      is_processing = false;
      current_batch = null;
      batch_values = null;
      old_values.clear();
      if (true_default) {
        for (const source2 of source_stacks) {
          source2.updated = null;
        }
      }
    }
  }
  discard() {
    for (const fn of this.#discard_callbacks)
      fn(this);
    this.#discard_callbacks.clear();
    for (const deferred2 of this.async_deriveds.values()) {
      deferred2.reject(OBSOLETE);
    }
    this.#unlink();
    this.#deferred?.resolve();
  }
  register_created_effect(effect) {
    this.#new_effects.push(effect);
  }
  #commit() {
    for (let batch = first_batch;batch !== null; batch = batch.#next) {
      var is_earlier = batch.id < this.id;
      var sources = [];
      for (const [source3, [value, is_derived]] of this.current) {
        if (batch.current.has(source3)) {
          var batch_value = batch.current.get(source3)[0];
          if (is_earlier && value !== batch_value) {
            batch.current.set(source3, [value, is_derived]);
          } else {
            continue;
          }
        }
        sources.push(source3);
      }
      if (is_earlier) {
        for (const [effect, deferred2] of this.async_deriveds) {
          const d = batch.async_deriveds.get(effect);
          if (d)
            deferred2.promise.then(d.resolve).catch(d.reject);
        }
      }
      var current = [...batch.current.keys()].filter((source3) => !batch.current.get(source3)[1]);
      if (!batch.#started || current.length === 0)
        continue;
      var others = current.filter((source3) => !this.current.has(source3));
      if (others.length === 0) {
        if (is_earlier) {
          batch.discard();
        }
      } else if (sources.length > 0) {
        if (true_default && !batch.#decrement_queued) {
          invariant(batch.#roots.length === 0, "Batch has scheduled roots");
        }
        if (is_earlier) {
          for (const unskipped of this.#unskipped_branches) {
            batch.unskip_effect(unskipped, (e) => {
              if ((e.f & (BLOCK_EFFECT | ASYNC)) !== 0) {
                batch.schedule(e);
              } else {
                batch.#defer_effects([e]);
              }
            });
          }
        }
        batch.activate();
        var marked = new Set;
        var checked = new Map;
        for (var source2 of sources) {
          mark_effects(source2, others, marked, checked);
        }
        checked = new Map;
        var current_unequal = [...batch.current].filter(([c, v1]) => {
          const v2 = this.current.get(c);
          if (!v2)
            return true;
          return v2[0] !== v1[0] || v2[1] !== v1[1];
        }).map(([c]) => c);
        if (current_unequal.length > 0) {
          for (const effect of this.#new_effects) {
            if ((effect.f & (DESTROYED | INERT | EAGER_EFFECT)) === 0 && depends_on(effect, current_unequal, checked)) {
              if ((effect.f & (ASYNC | BLOCK_EFFECT)) !== 0) {
                set_signal_status(effect, DIRTY);
                batch.schedule(effect);
              } else {
                batch.#dirty_effects.add(effect);
              }
            }
          }
        }
        if (batch.#roots.length > 0 && !batch.#decrement_queued) {
          batch.apply();
          for (var root of batch.#roots) {
            batch.#traverse(root, [], []);
          }
          batch.#roots = [];
        }
        batch.deactivate();
      }
    }
  }
  increment(blocking, effect) {
    this.#pending += 1;
    if (blocking) {
      let blocking_pending_count = this.#blocking_pending.get(effect) ?? 0;
      this.#blocking_pending.set(effect, blocking_pending_count + 1);
    }
  }
  decrement(blocking, effect) {
    this.#pending -= 1;
    if (blocking) {
      let blocking_pending_count = this.#blocking_pending.get(effect) ?? 0;
      if (blocking_pending_count === 1) {
        this.#blocking_pending.delete(effect);
      } else {
        this.#blocking_pending.set(effect, blocking_pending_count - 1);
      }
    }
    if (this.#decrement_queued)
      return;
    this.#decrement_queued = true;
    queue_micro_task(() => {
      this.#decrement_queued = false;
      if (this.linked) {
        this.flush();
      }
    });
  }
  transfer_effects(dirty_effects, maybe_dirty_effects) {
    for (const e of dirty_effects) {
      this.#dirty_effects.add(e);
    }
    for (const e of maybe_dirty_effects) {
      this.#maybe_dirty_effects.add(e);
    }
    dirty_effects.clear();
    maybe_dirty_effects.clear();
  }
  oncommit(fn) {
    this.#commit_callbacks.add(fn);
  }
  ondiscard(fn) {
    this.#discard_callbacks.add(fn);
  }
  settled() {
    return (this.#deferred ??= deferred()).promise;
  }
  static ensure() {
    if (current_batch === null) {
      const batch = current_batch = new Batch;
      if (!is_processing && !is_flushing_sync) {
        queue_micro_task(() => {
          if (!batch.#started) {
            batch.flush();
          }
        });
      }
    }
    return current_batch;
  }
  apply() {
    if (!async_mode_flag || !this.is_fork && this.#prev === null && this.#next === null) {
      batch_values = null;
      return;
    }
    batch_values = new Map;
    for (const [source2, [value]] of this.current) {
      batch_values.set(source2, value);
    }
    for (let batch = first_batch;batch !== null; batch = batch.#next) {
      if (batch === this || batch.is_fork)
        continue;
      var intersects = false;
      if (batch.id < this.id) {
        for (const [source2, [, is_derived]] of batch.current) {
          if (is_derived)
            continue;
          if (this.current.has(source2)) {
            intersects = true;
            break;
          }
        }
      }
      if (!intersects) {
        for (const [source2, previous] of batch.previous) {
          if (!batch_values.has(source2)) {
            batch_values.set(source2, previous);
          }
        }
      }
    }
  }
  schedule(effect) {
    last_scheduled_effect = effect;
    if (effect.b?.is_pending && (effect.f & (EFFECT | RENDER_EFFECT | MANAGED_EFFECT)) !== 0 && (effect.f & REACTION_RAN) === 0) {
      effect.b.defer_effect(effect);
      return;
    }
    var e = effect;
    while (e.parent !== null) {
      e = e.parent;
      var flags2 = e.f;
      if (collected_effects !== null && e === active_effect) {
        if (async_mode_flag)
          return;
        if ((active_reaction === null || (active_reaction.f & DERIVED) === 0) && !legacy_is_updating_store) {
          return;
        }
      }
      if ((flags2 & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags2 & CLEAN) === 0) {
          return;
        }
        e.f ^= CLEAN;
      }
    }
    this.#roots.push(e);
  }
  #unlink() {
    if (!this.linked)
      return;
    var prev = this.#prev;
    var next2 = this.#next;
    if (prev === null) {
      first_batch = next2;
    } else {
      prev.#next = next2;
    }
    if (next2 === null) {
      last_batch = prev;
    } else {
      next2.#prev = prev;
    }
    this.linked = false;
  }
}
function flushSync(fn) {
  var was_flushing_sync = is_flushing_sync;
  is_flushing_sync = true;
  try {
    var result;
    if (fn) {
      if (current_batch !== null && !current_batch.is_fork) {
        current_batch.flush();
      }
      result = fn();
    }
    while (true) {
      flush_tasks();
      if (current_batch === null) {
        return result;
      }
      current_batch.flush();
    }
  } finally {
    is_flushing_sync = was_flushing_sync;
  }
}
function infinite_loop_guard() {
  if (true_default) {
    var updates = new Map;
    for (const source2 of current_batch.current.keys()) {
      for (const [stack2, update2] of source2.updated ?? []) {
        var entry = updates.get(stack2);
        if (!entry) {
          entry = { error: update2.error, count: 0 };
          updates.set(stack2, entry);
        }
        entry.count += update2.count;
      }
    }
    for (const update2 of updates.values()) {
      if (update2.error) {
        console.error(update2.error);
      }
    }
  }
  try {
    effect_update_depth_exceeded();
  } catch (error) {
    if (true_default) {
      define_property(error, "stack", { value: "" });
    }
    invoke_error_boundary(error, last_scheduled_effect);
  }
}
var eager_block_effects = null;
function flush_queued_effects(effects) {
  var length = effects.length;
  if (length === 0)
    return;
  var i = 0;
  while (i < length) {
    var effect = effects[i++];
    if ((effect.f & (DESTROYED | INERT)) === 0 && is_dirty(effect)) {
      eager_block_effects = new Set;
      update_effect(effect);
      if (effect.deps === null && effect.first === null && effect.nodes === null && effect.teardown === null && effect.ac === null) {
        unlink_effect(effect);
      }
      if (eager_block_effects?.size > 0) {
        old_values.clear();
        for (const e of eager_block_effects) {
          if ((e.f & (DESTROYED | INERT)) !== 0)
            continue;
          const ordered_effects = [e];
          let ancestor = e.parent;
          while (ancestor !== null) {
            if (eager_block_effects.has(ancestor)) {
              eager_block_effects.delete(ancestor);
              ordered_effects.push(ancestor);
            }
            ancestor = ancestor.parent;
          }
          for (let j = ordered_effects.length - 1;j >= 0; j--) {
            const e2 = ordered_effects[j];
            if ((e2.f & (DESTROYED | INERT)) !== 0)
              continue;
            update_effect(e2);
          }
        }
        eager_block_effects.clear();
      }
    }
  }
  eager_block_effects = null;
}
function mark_effects(value, sources, marked, checked) {
  if (marked.has(value))
    return;
  marked.add(value);
  if (value.reactions !== null) {
    for (const reaction of value.reactions) {
      const flags2 = reaction.f;
      if ((flags2 & DERIVED) !== 0) {
        mark_effects(reaction, sources, marked, checked);
      } else if ((flags2 & (ASYNC | BLOCK_EFFECT)) !== 0 && (flags2 & DIRTY) === 0 && depends_on(reaction, sources, checked)) {
        set_signal_status(reaction, DIRTY);
        schedule_effect(reaction);
      }
    }
  }
}
function depends_on(reaction, sources, checked) {
  const depends = checked.get(reaction);
  if (depends !== undefined)
    return depends;
  if (reaction.deps !== null) {
    for (const dep of reaction.deps) {
      if (includes.call(sources, dep)) {
        return true;
      }
      if ((dep.f & DERIVED) !== 0 && depends_on(dep, sources, checked)) {
        checked.set(dep, true);
        return true;
      }
    }
  }
  checked.set(reaction, false);
  return false;
}
function schedule_effect(effect) {
  current_batch.schedule(effect);
}
var version_map = new Map;
function reset_branch(effect, tracked) {
  if ((effect.f & BRANCH_EFFECT) !== 0 && (effect.f & CLEAN) !== 0) {
    return;
  }
  if ((effect.f & DIRTY) !== 0) {
    tracked.d.push(effect);
  } else if ((effect.f & MAYBE_DIRTY) !== 0) {
    tracked.m.push(effect);
  }
  set_signal_status(effect, CLEAN);
  var e = effect.first;
  while (e !== null) {
    reset_branch(e, tracked);
    e = e.next;
  }
}
function reset_all(effect) {
  set_signal_status(effect, CLEAN);
  var e = effect.first;
  while (e !== null) {
    reset_all(e);
    e = e.next;
  }
}

// node_modules/svelte/src/internal/client/reactivity/sources.js
var eager_effects = new Set;
var old_values = new Map;
function set_eager_effects(v) {
  eager_effects = v;
}
var eager_effects_deferred = false;
function set_eager_effects_deferred() {
  eager_effects_deferred = true;
}
function source(v, stack2) {
  var signal = {
    f: 0,
    v,
    reactions: null,
    equals,
    rv: 0,
    wv: 0
  };
  if (true_default && tracing_mode_flag) {
    signal.created = stack2 ?? get_error("created at");
    signal.updated = null;
    signal.set_during_effect = false;
    signal.trace = null;
  }
  return signal;
}
function state(v, stack2) {
  const s = source(v, stack2);
  push_reaction_value(s);
  return s;
}
function mutable_source(initial_value, immutable = false, trackable = true) {
  const s = source(initial_value);
  if (!immutable) {
    s.equals = safe_equals;
  }
  if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) {
    (component_context.l.s ??= []).push(s);
  }
  return s;
}
function set(source2, value, should_proxy = false) {
  if (active_reaction !== null && (!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 && (current_sources === null || !current_sources.has(source2))) {
    state_unsafe_mutation();
  }
  let new_value = should_proxy ? proxy(value) : value;
  if (true_default) {
    tag_proxy(new_value, source2.label);
  }
  return internal_set(source2, new_value, legacy_updates);
}
function internal_set(source2, value, updated_during_traversal = null) {
  if (!source2.equals(value)) {
    if (is_destroying_effect) {
      old_values.set(source2, value);
    } else if (!old_values.has(source2)) {
      old_values.set(source2, source2.v);
    }
    var batch = Batch.ensure();
    batch.capture(source2, value);
    if (true_default) {
      if (tracing_mode_flag || active_effect !== null) {
        source2.updated ??= new Map;
        const count = (source2.updated.get("")?.count ?? 0) + 1;
        source2.updated.set("", { error: null, count });
        if (tracing_mode_flag || count > 5) {
          const error = get_error("updated at");
          if (error !== null) {
            let entry = source2.updated.get(error.stack);
            if (!entry) {
              entry = { error, count: 0 };
              source2.updated.set(error.stack, entry);
            }
            entry.count++;
          }
        }
      }
      if (active_effect !== null) {
        source2.set_during_effect = true;
      }
    }
    if ((source2.f & DERIVED) !== 0) {
      const derived2 = source2;
      if ((source2.f & DIRTY) !== 0) {
        execute_derived(derived2);
      }
      if (batch_values === null) {
        update_derived_status(derived2);
      }
    }
    source2.wv = increment_write_version();
    mark_reactions(source2, DIRTY, updated_during_traversal);
    if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
      if (untracked_writes === null) {
        set_untracked_writes([source2]);
      } else {
        untracked_writes.push(source2);
      }
    }
    if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
      flush_eager_effects();
    }
  }
  return value;
}
function flush_eager_effects() {
  eager_effects_deferred = false;
  for (const effect of eager_effects) {
    if ((effect.f & CLEAN) !== 0) {
      set_signal_status(effect, MAYBE_DIRTY);
    }
    let dirty;
    try {
      dirty = is_dirty(effect);
    } catch {
      dirty = true;
    }
    if (dirty) {
      update_effect(effect);
    }
  }
  eager_effects.clear();
}
function increment(source2) {
  set(source2, source2.v + 1);
}
function mark_reactions(signal, status, updated_during_traversal) {
  var reactions = signal.reactions;
  if (reactions === null)
    return;
  var runes = is_runes();
  var length = reactions.length;
  for (var i = 0;i < length; i++) {
    var reaction = reactions[i];
    var flags2 = reaction.f;
    if (!runes && reaction === active_effect)
      continue;
    var not_dirty = (flags2 & DIRTY) === 0;
    if (not_dirty) {
      set_signal_status(reaction, status);
    }
    if ((flags2 & EAGER_EFFECT) !== 0) {
      eager_effects.add(reaction);
    } else if ((flags2 & DERIVED) !== 0) {
      var derived2 = reaction;
      batch_values?.delete(derived2);
      if ((flags2 & WAS_MARKED) === 0) {
        if (flags2 & CONNECTED && (active_effect === null || (active_effect.f & REACTION_IS_UPDATING) === 0)) {
          reaction.f |= WAS_MARKED;
        }
        mark_reactions(derived2, MAYBE_DIRTY, updated_during_traversal);
      }
    } else if (not_dirty) {
      var effect = reaction;
      if ((flags2 & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
        eager_block_effects.add(effect);
      }
      if (updated_during_traversal !== null) {
        updated_during_traversal.push(effect);
      } else {
        schedule_effect(effect);
      }
    }
  }
}

// node_modules/svelte/src/internal/client/proxy.js
var regex_is_valid_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function proxy(value) {
  if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
    return value;
  }
  const prototype = get_prototype_of(value);
  if (prototype !== object_prototype && prototype !== array_prototype) {
    return value;
  }
  var sources = new Map;
  var is_proxied_array = is_array(value);
  var version = state(0);
  var stack2 = true_default && tracing_mode_flag ? get_error("created at") : null;
  var parent_version = update_version;
  var with_parent = (fn) => {
    if (update_version === parent_version) {
      return fn();
    }
    var reaction = active_reaction;
    var version2 = update_version;
    set_active_reaction(null);
    set_update_version(parent_version);
    var result = fn();
    set_active_reaction(reaction);
    set_update_version(version2);
    return result;
  };
  if (is_proxied_array) {
    sources.set("length", state(value.length, stack2));
    if (true_default) {
      value = inspectable_array(value);
    }
  }
  var path = "";
  let updating = false;
  function update_path(new_path) {
    if (updating)
      return;
    updating = true;
    path = new_path;
    tag(version, `${path} version`);
    for (const [prop, source2] of sources) {
      tag(source2, get_label(path, prop));
    }
    updating = false;
  }
  return new Proxy(value, {
    defineProperty(_, prop, descriptor) {
      if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
        state_descriptors_fixed();
      }
      var s = sources.get(prop);
      if (s === undefined) {
        with_parent(() => {
          var s2 = state(descriptor.value, stack2);
          sources.set(prop, s2);
          if (true_default && typeof prop === "string") {
            tag(s2, get_label(path, prop));
          }
          return s2;
        });
      } else {
        set(s, descriptor.value, true);
      }
      return true;
    },
    deleteProperty(target, prop) {
      var s = sources.get(prop);
      if (s === undefined) {
        if (prop in target) {
          const s2 = with_parent(() => state(UNINITIALIZED, stack2));
          sources.set(prop, s2);
          increment(version);
          if (true_default) {
            tag(s2, get_label(path, prop));
          }
        }
      } else {
        set(s, UNINITIALIZED);
        increment(version);
      }
      return true;
    },
    get(target, prop, receiver) {
      if (prop === STATE_SYMBOL) {
        return value;
      }
      if (true_default && prop === PROXY_PATH_SYMBOL) {
        return update_path;
      }
      var s = sources.get(prop);
      var exists = prop in target;
      if (s === undefined && (!exists || get_descriptor(target, prop)?.writable)) {
        s = with_parent(() => {
          var p = proxy(exists ? target[prop] : UNINITIALIZED);
          var s2 = state(p, stack2);
          if (true_default) {
            tag(s2, get_label(path, prop));
          }
          return s2;
        });
        sources.set(prop, s);
      }
      if (s !== undefined) {
        var v = get2(s);
        return v === UNINITIALIZED ? undefined : v;
      }
      return Reflect.get(target, prop, receiver);
    },
    getOwnPropertyDescriptor(target, prop) {
      var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
      if (descriptor && "value" in descriptor) {
        var s = sources.get(prop);
        if (s)
          descriptor.value = get2(s);
      } else if (descriptor === undefined) {
        var source2 = sources.get(prop);
        var value2 = source2?.v;
        if (source2 !== undefined && value2 !== UNINITIALIZED) {
          return {
            enumerable: true,
            configurable: true,
            value: value2,
            writable: true
          };
        }
      }
      return descriptor;
    },
    has(target, prop) {
      if (prop === STATE_SYMBOL) {
        return true;
      }
      var s = sources.get(prop);
      var has = s !== undefined && s.v !== UNINITIALIZED || Reflect.has(target, prop);
      if (s !== undefined || active_effect !== null && (!has || get_descriptor(target, prop)?.writable)) {
        if (s === undefined) {
          s = with_parent(() => {
            var p = has ? proxy(target[prop]) : UNINITIALIZED;
            var s2 = state(p, stack2);
            if (true_default) {
              tag(s2, get_label(path, prop));
            }
            return s2;
          });
          sources.set(prop, s);
        }
        var value2 = get2(s);
        if (value2 === UNINITIALIZED) {
          return false;
        }
      }
      return has;
    },
    set(target, prop, value2, receiver) {
      var s = sources.get(prop);
      var has = prop in target;
      if (is_proxied_array && prop === "length") {
        for (var i = value2;i < s.v; i += 1) {
          var other_s = sources.get(i + "");
          if (other_s !== undefined) {
            set(other_s, UNINITIALIZED);
          } else if (i in target) {
            other_s = with_parent(() => state(UNINITIALIZED, stack2));
            sources.set(i + "", other_s);
            if (true_default) {
              tag(other_s, get_label(path, i));
            }
          }
        }
      }
      if (s === undefined) {
        if (!has || get_descriptor(target, prop)?.writable) {
          s = with_parent(() => state(undefined, stack2));
          if (true_default) {
            tag(s, get_label(path, prop));
          }
          set(s, proxy(value2));
          sources.set(prop, s);
        }
      } else {
        has = s.v !== UNINITIALIZED;
        var p = with_parent(() => proxy(value2));
        set(s, p);
      }
      var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
      if (descriptor?.set) {
        descriptor.set.call(receiver, value2);
      }
      if (!has) {
        if (is_proxied_array && typeof prop === "string") {
          var ls = sources.get("length");
          var n = Number(prop);
          if (Number.isInteger(n) && n >= ls.v) {
            set(ls, n + 1);
          }
        }
        increment(version);
      }
      return true;
    },
    ownKeys(target) {
      get2(version);
      var own_keys = Reflect.ownKeys(target).filter((key2) => {
        var source3 = sources.get(key2);
        return source3 === undefined || source3.v !== UNINITIALIZED;
      });
      for (var [key, source2] of sources) {
        if (source2.v !== UNINITIALIZED && !(key in target)) {
          own_keys.push(key);
        }
      }
      return own_keys;
    },
    setPrototypeOf() {
      state_prototype_fixed();
    }
  });
}
function get_label(path, prop) {
  if (typeof prop === "symbol")
    return `${path}[Symbol(${prop.description ?? ""})]`;
  if (regex_is_valid_identifier.test(prop))
    return `${path}.${prop}`;
  return /^\d+$/.test(prop) ? `${path}[${prop}]` : `${path}['${prop}']`;
}
function get_proxied_value(value) {
  try {
    if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
      return value[STATE_SYMBOL];
    }
  } catch {}
  return value;
}
function is(a, b) {
  return Object.is(get_proxied_value(a), get_proxied_value(b));
}
var ARRAY_MUTATING_METHODS = new Set([
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift"
]);
function inspectable_array(array) {
  return new Proxy(array, {
    get(target, prop, receiver) {
      var value = Reflect.get(target, prop, receiver);
      if (!ARRAY_MUTATING_METHODS.has(prop)) {
        return value;
      }
      return function(...args) {
        set_eager_effects_deferred();
        var result = value.apply(this, args);
        flush_eager_effects();
        return result;
      };
    }
  });
}

// node_modules/svelte/src/internal/client/dev/equality.js
function init_array_prototype_warnings() {
  const array_prototype2 = Array.prototype;
  const cleanup = Array.__svelte_cleanup;
  if (cleanup) {
    cleanup();
  }
  const { indexOf, lastIndexOf, includes: includes2 } = array_prototype2;
  array_prototype2.indexOf = function(item, from_index) {
    const index = indexOf.call(this, item, from_index);
    if (index === -1) {
      for (let i = from_index ?? 0;i < this.length; i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.indexOf(...)");
          break;
        }
      }
    }
    return index;
  };
  array_prototype2.lastIndexOf = function(item, from_index) {
    const index = lastIndexOf.call(this, item, from_index ?? this.length - 1);
    if (index === -1) {
      for (let i = 0;i <= (from_index ?? this.length - 1); i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.lastIndexOf(...)");
          break;
        }
      }
    }
    return index;
  };
  array_prototype2.includes = function(item, from_index) {
    const has = includes2.call(this, item, from_index);
    if (!has) {
      for (let i = 0;i < this.length; i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.includes(...)");
          break;
        }
      }
    }
    return has;
  };
  Array.__svelte_cleanup = () => {
    array_prototype2.indexOf = indexOf;
    array_prototype2.lastIndexOf = lastIndexOf;
    array_prototype2.includes = includes2;
  };
}

// node_modules/svelte/src/internal/client/dom/operations.js
var $window;
var $document;
var is_firefox;
var first_child_getter;
var next_sibling_getter;
function init_operations() {
  if ($window !== undefined) {
    return;
  }
  $window = window;
  $document = document;
  is_firefox = /Firefox/.test(navigator.userAgent);
  var element_prototype = Element.prototype;
  var node_prototype = Node.prototype;
  var text_prototype = Text.prototype;
  first_child_getter = get_descriptor(node_prototype, "firstChild").get;
  next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
  if (is_extensible(element_prototype)) {
    element_prototype[CLASS_CACHE] = undefined;
    element_prototype[ATTRIBUTES_CACHE] = null;
    element_prototype[STYLE_CACHE] = undefined;
    element_prototype.__e = undefined;
  }
  if (is_extensible(text_prototype)) {
    text_prototype[TEXT_CACHE] = undefined;
  }
  if (true_default) {
    element_prototype.__svelte_meta = null;
    init_array_prototype_warnings();
  }
}
function create_text(value = "") {
  return document.createTextNode(value);
}
function get_first_child(node) {
  return first_child_getter.call(node);
}
function get_next_sibling(node) {
  return next_sibling_getter.call(node);
}
function child(node, is_text) {
  if (!hydrating) {
    return get_first_child(node);
  }
  var child2 = get_first_child(hydrate_node);
  if (child2 === null) {
    child2 = hydrate_node.appendChild(create_text());
  } else if (is_text && child2.nodeType !== TEXT_NODE) {
    var text = create_text();
    child2?.before(text);
    set_hydrate_node(text);
    return text;
  }
  if (is_text) {
    merge_text_nodes(child2);
  }
  set_hydrate_node(child2);
  return child2;
}
function first_child(node, is_text = false) {
  if (!hydrating) {
    var first = get_first_child(node);
    if (first instanceof Comment && first.data === "")
      return get_next_sibling(first);
    return first;
  }
  if (is_text) {
    if (hydrate_node?.nodeType !== TEXT_NODE) {
      var text = create_text();
      hydrate_node?.before(text);
      set_hydrate_node(text);
      return text;
    }
    merge_text_nodes(hydrate_node);
  }
  return hydrate_node;
}
function sibling(node, count = 1, is_text = false) {
  let next_sibling = hydrating ? hydrate_node : node;
  var last_sibling;
  while (count--) {
    last_sibling = next_sibling;
    next_sibling = get_next_sibling(next_sibling);
  }
  if (!hydrating) {
    return next_sibling;
  }
  if (is_text) {
    if (next_sibling?.nodeType !== TEXT_NODE) {
      var text = create_text();
      if (next_sibling === null) {
        last_sibling?.after(text);
      } else {
        next_sibling.before(text);
      }
      set_hydrate_node(text);
      return text;
    }
    merge_text_nodes(next_sibling);
  }
  set_hydrate_node(next_sibling);
  return next_sibling;
}
function clear_text_content(node) {
  node.textContent = "";
}
function should_defer_append() {
  if (!async_mode_flag)
    return false;
  if (eager_block_effects !== null)
    return false;
  var flags2 = active_effect.f;
  return (flags2 & REACTION_RAN) !== 0;
}
function create_element(tag2, namespace, is2) {
  if (namespace == null || namespace === NAMESPACE_HTML) {
    return is2 ? document.createElement(tag2, { is: is2 }) : document.createElement(tag2);
  }
  return is2 ? document.createElementNS(namespace, tag2, { is: is2 }) : document.createElementNS(namespace, tag2);
}
function merge_text_nodes(text) {
  if (text.nodeValue.length < 65536) {
    return;
  }
  let next2 = text.nextSibling;
  while (next2 !== null && next2.nodeType === TEXT_NODE) {
    next2.remove();
    text.nodeValue += next2.nodeValue;
    next2 = text.nextSibling;
  }
}

// node_modules/svelte/src/internal/client/reactivity/effects.js
function validate_effect(rune) {
  if (active_effect === null) {
    if (active_reaction === null) {
      effect_orphan(rune);
    }
    effect_in_unowned_derived();
  }
  if (is_destroying_effect) {
    effect_in_teardown(rune);
  }
}
function push_effect(effect, parent_effect) {
  var parent_last = parent_effect.last;
  if (parent_last === null) {
    parent_effect.last = parent_effect.first = effect;
  } else {
    parent_last.next = effect;
    effect.prev = parent_last;
    parent_effect.last = effect;
  }
}
function create_effect(type, fn) {
  var parent = active_effect;
  if (true_default) {
    while (parent !== null && (parent.f & EAGER_EFFECT) !== 0) {
      parent = parent.parent;
    }
  }
  if (parent !== null && (parent.f & INERT) !== 0) {
    type |= INERT;
  }
  var effect = {
    ctx: component_context,
    deps: null,
    nodes: null,
    f: type | DIRTY | CONNECTED,
    first: null,
    fn,
    last: null,
    next: null,
    parent,
    b: parent && parent.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  if (true_default) {
    effect.component_function = dev_current_component_function;
  }
  current_batch?.register_created_effect(effect);
  var e = effect;
  if ((type & EFFECT) !== 0) {
    if (collected_effects !== null) {
      collected_effects.push(effect);
    } else {
      Batch.ensure().schedule(effect);
    }
  } else if (fn !== null) {
    try {
      update_effect(effect);
    } catch (e2) {
      destroy_effect(effect);
      throw e2;
    }
    if (e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && (e.f & EFFECT_PRESERVED) === 0) {
      e = e.first;
      if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
        e.f |= EFFECT_TRANSPARENT;
      }
    }
  }
  if (e !== null) {
    e.parent = parent;
    if (parent !== null) {
      push_effect(e, parent);
    }
    if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
      var derived2 = active_reaction;
      (derived2.effects ??= []).push(e);
    }
  }
  return effect;
}
function effect_tracking() {
  return active_reaction !== null && !untracking;
}
function teardown(fn) {
  const effect = create_effect(RENDER_EFFECT, null);
  set_signal_status(effect, CLEAN);
  effect.teardown = fn;
  return effect;
}
function user_effect(fn) {
  validate_effect("$effect");
  if (true_default) {
    define_property(fn, "name", {
      value: "$effect"
    });
  }
  var flags2 = active_effect.f;
  var defer = !active_reaction && (flags2 & BRANCH_EFFECT) !== 0 && component_context !== null && !component_context.i;
  if (defer) {
    var context = component_context;
    (context.e ??= []).push(fn);
  } else {
    return create_user_effect(fn);
  }
}
function create_user_effect(fn) {
  return create_effect(EFFECT | USER_EFFECT, fn);
}
function user_pre_effect(fn) {
  validate_effect("$effect.pre");
  if (true_default) {
    define_property(fn, "name", {
      value: "$effect.pre"
    });
  }
  return create_effect(RENDER_EFFECT | USER_EFFECT, fn);
}
function effect_root(fn) {
  Batch.ensure();
  const effect = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
  return () => {
    destroy_effect(effect);
  };
}
function component_root(fn) {
  Batch.ensure();
  const effect = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
  return (options = {}) => {
    return new Promise((fulfil) => {
      if (options.outro) {
        pause_effect(effect, () => {
          destroy_effect(effect);
          fulfil(undefined);
        });
      } else {
        destroy_effect(effect);
        fulfil(undefined);
      }
    });
  };
}
function effect(fn) {
  return create_effect(EFFECT, fn);
}
function async_effect(fn) {
  return create_effect(ASYNC | EFFECT_PRESERVED, fn);
}
function render_effect(fn, flags2 = 0) {
  return create_effect(RENDER_EFFECT | flags2, fn);
}
function template_effect(fn, sync = [], async = [], blockers = []) {
  flatten(blockers, sync, async, (values) => {
    create_effect(RENDER_EFFECT, () => {
      fn(...values.map(get2));
    });
  });
}
function block(fn, flags2 = 0) {
  var effect2 = create_effect(BLOCK_EFFECT | flags2, fn);
  if (true_default) {
    effect2.dev_stack = dev_stack;
  }
  return effect2;
}
function managed(fn, flags2 = 0) {
  var effect2 = create_effect(MANAGED_EFFECT | flags2, fn);
  if (true_default) {
    effect2.dev_stack = dev_stack;
  }
  return effect2;
}
function branch(fn) {
  return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn);
}
function execute_effect_teardown(effect2) {
  var teardown2 = effect2.teardown;
  if (teardown2 !== null) {
    const previously_destroying_effect = is_destroying_effect;
    const previous_reaction = active_reaction;
    set_is_destroying_effect(true);
    set_active_reaction(null);
    try {
      teardown2.call(null);
    } finally {
      set_is_destroying_effect(previously_destroying_effect);
      set_active_reaction(previous_reaction);
    }
  }
}
function destroy_effect_children(signal, remove_dom = false) {
  var effect2 = signal.first;
  signal.first = signal.last = null;
  while (effect2 !== null) {
    const controller = effect2.ac;
    if (controller !== null) {
      without_reactive_context(() => {
        controller.abort(STALE_REACTION);
      });
    }
    var next2 = effect2.next;
    if ((effect2.f & ROOT_EFFECT) !== 0) {
      effect2.parent = null;
    } else {
      destroy_effect(effect2, remove_dom);
    }
    effect2 = next2;
  }
}
function destroy_block_effect_children(signal) {
  var effect2 = signal.first;
  while (effect2 !== null) {
    var next2 = effect2.next;
    if ((effect2.f & BRANCH_EFFECT) === 0) {
      destroy_effect(effect2);
    }
    effect2 = next2;
  }
}
function destroy_effect(effect2, remove_dom = true) {
  var removed = false;
  if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes !== null && effect2.nodes.end !== null) {
    remove_effect_dom(effect2.nodes.start, effect2.nodes.end);
    removed = true;
  }
  effect2.f |= DESTROYING;
  destroy_effect_children(effect2, remove_dom && !removed);
  remove_reactions(effect2, 0);
  var transitions = effect2.nodes && effect2.nodes.t;
  if (transitions !== null) {
    for (const transition of transitions) {
      transition.stop();
    }
  }
  execute_effect_teardown(effect2);
  effect2.f ^= DESTROYING;
  effect2.f |= DESTROYED;
  var parent = effect2.parent;
  if (parent !== null && parent.first !== null) {
    unlink_effect(effect2);
  }
  if (true_default) {
    effect2.component_function = null;
  }
  effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes = effect2.ac = effect2.b = null;
}
function remove_effect_dom(node, end) {
  while (node !== null) {
    var next2 = node === end ? null : get_next_sibling(node);
    node.remove();
    node = next2;
  }
}
function unlink_effect(effect2) {
  var parent = effect2.parent;
  var prev = effect2.prev;
  var next2 = effect2.next;
  if (prev !== null)
    prev.next = next2;
  if (next2 !== null)
    next2.prev = prev;
  if (parent !== null) {
    if (parent.first === effect2)
      parent.first = next2;
    if (parent.last === effect2)
      parent.last = prev;
  }
}
function pause_effect(effect2, callback, destroy = true) {
  var transitions = [];
  pause_children(effect2, transitions, true);
  var fn = () => {
    if (destroy)
      destroy_effect(effect2);
    if (callback)
      callback();
  };
  var remaining = transitions.length;
  if (remaining > 0) {
    var check = () => --remaining || fn();
    for (var transition of transitions) {
      transition.out(check);
    }
  } else {
    fn();
  }
}
function pause_children(effect2, transitions, local) {
  if ((effect2.f & INERT) !== 0)
    return;
  effect2.f ^= INERT;
  var t = effect2.nodes && effect2.nodes.t;
  if (t !== null) {
    for (const transition of t) {
      if (transition.is_global || local) {
        transitions.push(transition);
      }
    }
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    if ((child2.f & ROOT_EFFECT) === 0) {
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0 && (effect2.f & BLOCK_EFFECT) !== 0;
      pause_children(child2, transitions, transparent ? local : false);
    }
    child2 = sibling2;
  }
}
function resume_effect(effect2) {
  resume_children(effect2, true);
}
function resume_children(effect2, local) {
  if ((effect2.f & INERT) === 0)
    return;
  effect2.f ^= INERT;
  if ((effect2.f & CLEAN) === 0) {
    set_signal_status(effect2, DIRTY);
    Batch.ensure().schedule(effect2);
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
    resume_children(child2, transparent ? local : false);
    child2 = sibling2;
  }
  var t = effect2.nodes && effect2.nodes.t;
  if (t !== null) {
    for (const transition of t) {
      if (transition.is_global || local) {
        transition.in();
      }
    }
  }
}
function move_effect(effect2, fragment) {
  if (!effect2.nodes)
    return;
  var node = effect2.nodes.start;
  var end = effect2.nodes.end;
  while (node !== null) {
    var next2 = node === end ? null : get_next_sibling(node);
    fragment.append(node);
    node = next2;
  }
}

// node_modules/svelte/src/internal/client/legacy.js
var captured_signals = null;

// node_modules/svelte/src/internal/client/runtime.js
var is_updating_effect = false;
var is_destroying_effect = false;
function set_is_destroying_effect(value) {
  is_destroying_effect = value;
}
var active_reaction = null;
var untracking = false;
function set_active_reaction(reaction) {
  active_reaction = reaction;
}
var active_effect = null;
function set_active_effect(effect2) {
  active_effect = effect2;
}
var current_sources = null;
function push_reaction_value(value) {
  if (active_reaction !== null && (!async_mode_flag || (active_reaction.f & DERIVED) !== 0)) {
    (current_sources ??= new Set).add(value);
  }
}
var new_deps = null;
var skipped_deps = 0;
var untracked_writes = null;
function set_untracked_writes(value) {
  untracked_writes = value;
}
var write_version = 1;
var read_version = 0;
var update_version = read_version;
function set_update_version(value) {
  update_version = value;
}
function increment_write_version() {
  return ++write_version;
}
function is_dirty(reaction) {
  var flags2 = reaction.f;
  if ((flags2 & DIRTY) !== 0) {
    return true;
  }
  if (flags2 & DERIVED) {
    reaction.f &= ~WAS_MARKED;
  }
  if ((flags2 & MAYBE_DIRTY) !== 0) {
    var dependencies = reaction.deps;
    var length = dependencies.length;
    for (var i = 0;i < length; i++) {
      var dependency = dependencies[i];
      if (is_dirty(dependency)) {
        update_derived(dependency);
      }
      if (dependency.wv > reaction.wv) {
        return true;
      }
    }
    if ((flags2 & CONNECTED) !== 0 && batch_values === null) {
      set_signal_status(reaction, CLEAN);
    }
  }
  return false;
}
function schedule_possible_effect_self_invalidation(signal, effect2, root = true) {
  var reactions = signal.reactions;
  if (reactions === null)
    return;
  if (!async_mode_flag && current_sources !== null && current_sources.has(signal)) {
    return;
  }
  for (var i = 0;i < reactions.length; i++) {
    var reaction = reactions[i];
    if ((reaction.f & DERIVED) !== 0) {
      schedule_possible_effect_self_invalidation(reaction, effect2, false);
    } else if (effect2 === reaction) {
      if (root) {
        set_signal_status(reaction, DIRTY);
      } else if ((reaction.f & CLEAN) !== 0) {
        set_signal_status(reaction, MAYBE_DIRTY);
      }
      schedule_effect(reaction);
    }
  }
}
function update_reaction(reaction) {
  var previous_deps = new_deps;
  var previous_skipped_deps = skipped_deps;
  var previous_untracked_writes = untracked_writes;
  var previous_reaction = active_reaction;
  var previous_sources = current_sources;
  var previous_component_context = component_context;
  var previous_untracking = untracking;
  var previous_update_version = update_version;
  var flags2 = reaction.f;
  new_deps = null;
  skipped_deps = 0;
  untracked_writes = null;
  active_reaction = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
  current_sources = null;
  set_component_context(reaction.ctx);
  untracking = false;
  update_version = ++read_version;
  if (reaction.ac !== null) {
    without_reactive_context(() => {
      reaction.ac.abort(STALE_REACTION);
    });
    reaction.ac = null;
  }
  try {
    reaction.f |= REACTION_IS_UPDATING;
    var fn = reaction.fn;
    var result = fn();
    reaction.f |= REACTION_RAN;
    var deps = reaction.deps;
    var is_fork = current_batch?.is_fork;
    if (new_deps !== null) {
      var i;
      if (!is_fork) {
        remove_reactions(reaction, skipped_deps);
      }
      if (deps !== null && skipped_deps > 0) {
        deps.length = skipped_deps + new_deps.length;
        for (i = 0;i < new_deps.length; i++) {
          deps[skipped_deps + i] = new_deps[i];
        }
      } else {
        reaction.deps = deps = new_deps;
      }
      if (effect_tracking() && (reaction.f & CONNECTED) !== 0) {
        for (i = skipped_deps;i < deps.length; i++) {
          (deps[i].reactions ??= []).push(reaction);
        }
      }
    } else if (!is_fork && deps !== null && skipped_deps < deps.length) {
      remove_reactions(reaction, skipped_deps);
      deps.length = skipped_deps;
    }
    if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
      for (i = 0;i < untracked_writes.length; i++) {
        schedule_possible_effect_self_invalidation(untracked_writes[i], reaction);
      }
    }
    if (previous_reaction !== null && previous_reaction !== reaction) {
      read_version++;
      if (previous_reaction.deps !== null) {
        for (let i2 = 0;i2 < previous_skipped_deps; i2 += 1) {
          previous_reaction.deps[i2].rv = read_version;
        }
      }
      if (previous_deps !== null) {
        for (const dep of previous_deps) {
          dep.rv = read_version;
        }
      }
      if (untracked_writes !== null) {
        if (previous_untracked_writes === null) {
          previous_untracked_writes = untracked_writes;
        } else {
          previous_untracked_writes.push(...untracked_writes);
        }
      }
    }
    if ((reaction.f & ERROR_VALUE) !== 0) {
      reaction.f ^= ERROR_VALUE;
    }
    return result;
  } catch (error) {
    return handle_error(error);
  } finally {
    reaction.f ^= REACTION_IS_UPDATING;
    new_deps = previous_deps;
    skipped_deps = previous_skipped_deps;
    untracked_writes = previous_untracked_writes;
    active_reaction = previous_reaction;
    current_sources = previous_sources;
    set_component_context(previous_component_context);
    untracking = previous_untracking;
    update_version = previous_update_version;
  }
}
function remove_reaction(signal, dependency) {
  let reactions = dependency.reactions;
  if (reactions !== null) {
    var index = index_of.call(reactions, signal);
    if (index !== -1) {
      var new_length = reactions.length - 1;
      if (new_length === 0) {
        reactions = dependency.reactions = null;
      } else {
        reactions[index] = reactions[new_length];
        reactions.pop();
      }
    }
  }
  if (reactions === null && (dependency.f & DERIVED) !== 0 && (new_deps === null || !includes.call(new_deps, dependency))) {
    var derived2 = dependency;
    if ((derived2.f & CONNECTED) !== 0) {
      derived2.f ^= CONNECTED;
      derived2.f &= ~WAS_MARKED;
    }
    if (derived2.v !== UNINITIALIZED) {
      update_derived_status(derived2);
    }
    if (derived2.ac !== null) {
      without_reactive_context(() => {
        derived2.ac.abort(STALE_REACTION);
        derived2.ac = null;
        set_signal_status(derived2, DIRTY);
      });
    }
    freeze_derived_effects(derived2);
    remove_reactions(derived2, 0);
  }
}
function remove_reactions(signal, start_index) {
  var dependencies = signal.deps;
  if (dependencies === null)
    return;
  for (var i = start_index;i < dependencies.length; i++) {
    remove_reaction(signal, dependencies[i]);
  }
}
function update_effect(effect2) {
  var flags2 = effect2.f;
  if ((flags2 & DESTROYED) !== 0) {
    return;
  }
  set_signal_status(effect2, CLEAN);
  var previous_effect = active_effect;
  var was_updating_effect = is_updating_effect;
  active_effect = effect2;
  is_updating_effect = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0;
  if (true_default) {
    var previous_component_fn = dev_current_component_function;
    set_dev_current_component_function(effect2.component_function);
    var previous_stack = dev_stack;
    set_dev_stack(effect2.dev_stack ?? dev_stack);
  }
  try {
    if ((flags2 & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
      destroy_block_effect_children(effect2);
    } else {
      destroy_effect_children(effect2);
    }
    execute_effect_teardown(effect2);
    var teardown2 = update_reaction(effect2);
    effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
    effect2.wv = write_version;
    if (true_default && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) {
      for (var dep of effect2.deps) {
        if (dep.set_during_effect) {
          dep.wv = increment_write_version();
          dep.set_during_effect = false;
        }
      }
    }
  } finally {
    is_updating_effect = was_updating_effect;
    active_effect = previous_effect;
    if (true_default) {
      set_dev_current_component_function(previous_component_fn);
      set_dev_stack(previous_stack);
    }
  }
}
async function tick() {
  if (async_mode_flag) {
    return new Promise((f) => {
      requestAnimationFrame(() => f());
      setTimeout(() => f());
    });
  }
  await Promise.resolve();
  flushSync();
}
function get2(signal) {
  var flags2 = signal.f;
  var is_derived = (flags2 & DERIVED) !== 0;
  captured_signals?.add(signal);
  if (active_reaction !== null && !untracking) {
    var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
    if (!destroyed && (current_sources === null || !current_sources.has(signal))) {
      var deps = active_reaction.deps;
      if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else {
            new_deps.push(signal);
          }
        }
      } else {
        active_reaction.deps ??= [];
        if (!includes.call(active_reaction.deps, signal)) {
          active_reaction.deps.push(signal);
        }
        var reactions = signal.reactions;
        if (reactions === null) {
          signal.reactions = [active_reaction];
        } else if (!includes.call(reactions, active_reaction)) {
          reactions.push(active_reaction);
        }
      }
    }
  }
  if (true_default) {
    if (!untracking && reactivity_loss_tracker && current_batch === null && previous_batch === null && !reactivity_loss_tracker.warned && (reactivity_loss_tracker.effect.f & REACTION_IS_UPDATING) === 0 && !reactivity_loss_tracker.effect_deps.has(signal)) {
      reactivity_loss_tracker.warned = true;
      await_reactivity_loss(signal.label);
      var trace = get_error("traced at");
      if (trace)
        console.warn(trace);
    }
    recent_async_deriveds.delete(signal);
    if (tracing_mode_flag && !untracking && tracing_expressions !== null && active_reaction !== null && tracing_expressions.reaction === active_reaction) {
      if (signal.trace) {
        signal.trace();
      } else {
        trace = get_error("traced at");
        if (trace) {
          var entry = tracing_expressions.entries.get(signal);
          if (entry === undefined) {
            entry = { traces: [] };
            tracing_expressions.entries.set(signal, entry);
          }
          var last = entry.traces[entry.traces.length - 1];
          if (trace.stack !== last?.stack) {
            entry.traces.push(trace);
          }
        }
      }
    }
  }
  if (is_destroying_effect && old_values.has(signal)) {
    return old_values.get(signal);
  }
  if (is_derived) {
    var derived2 = signal;
    if (is_destroying_effect) {
      var value = derived2.v;
      if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
        value = execute_derived(derived2);
      }
      old_values.set(derived2, value);
      return value;
    }
    var should_connect = (derived2.f & CONNECTED) === 0 && !untracking && active_reaction !== null && (is_updating_effect || (active_reaction.f & CONNECTED) !== 0);
    var is_new = (derived2.f & REACTION_RAN) === 0;
    if (is_dirty(derived2)) {
      if (should_connect) {
        derived2.f |= CONNECTED;
      }
      update_derived(derived2);
    }
    if (should_connect && !is_new) {
      unfreeze_derived_effects(derived2);
      reconnect(derived2);
    }
  }
  if (batch_values?.has(signal)) {
    return batch_values.get(signal);
  }
  if ((signal.f & ERROR_VALUE) !== 0) {
    throw signal.v;
  }
  return signal.v;
}
function reconnect(derived2) {
  derived2.f |= CONNECTED;
  if (derived2.deps === null)
    return;
  for (const dep of derived2.deps) {
    (dep.reactions ??= []).push(derived2);
    if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
      unfreeze_derived_effects(dep);
      reconnect(dep);
    }
  }
}
function depends_on_old_values(derived2) {
  if (derived2.v === UNINITIALIZED)
    return true;
  if (derived2.deps === null)
    return false;
  for (const dep of derived2.deps) {
    if (old_values.has(dep)) {
      return true;
    }
    if ((dep.f & DERIVED) !== 0 && depends_on_old_values(dep)) {
      return true;
    }
  }
  return false;
}
function untrack(fn) {
  var previous_untracking = untracking;
  try {
    untracking = true;
    return fn();
  } finally {
    untracking = previous_untracking;
  }
}
function deep_read_state(value) {
  if (typeof value !== "object" || !value || value instanceof EventTarget) {
    return;
  }
  if (STATE_SYMBOL in value) {
    deep_read(value);
  } else if (!Array.isArray(value)) {
    for (let key in value) {
      const prop = value[key];
      if (typeof prop === "object" && prop && STATE_SYMBOL in prop) {
        deep_read(prop);
      }
    }
  }
}
function deep_read(value, visited = new Set) {
  if (typeof value === "object" && value !== null && !(value instanceof EventTarget) && !visited.has(value)) {
    visited.add(value);
    if (value instanceof Date) {
      value.getTime();
    }
    for (let key in value) {
      try {
        deep_read(value[key], visited);
      } catch (e) {}
    }
    const proto = get_prototype_of(value);
    if (proto !== Object.prototype && proto !== Array.prototype && proto !== Map.prototype && proto !== Set.prototype && proto !== Date.prototype) {
      const descriptors = get_descriptors(proto);
      for (let key in descriptors) {
        const get3 = descriptors[key].get;
        if (get3) {
          try {
            get3.call(value);
          } catch (e) {}
        }
      }
    }
  }
}
// node_modules/svelte/src/utils.js
function is_capture_event(name) {
  return name.endsWith("capture") && name !== "gotpointercapture" && name !== "lostpointercapture";
}
var DELEGATED_EVENTS = [
  "beforeinput",
  "click",
  "change",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart"
];
function can_delegate_event(event_name) {
  return DELEGATED_EVENTS.includes(event_name);
}
var DOM_BOOLEAN_ATTRIBUTES = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "webkitdirectory",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback"
];
var ATTRIBUTE_ALIASES = {
  formnovalidate: "formNoValidate",
  ismap: "isMap",
  nomodule: "noModule",
  playsinline: "playsInline",
  readonly: "readOnly",
  defaultvalue: "defaultValue",
  defaultchecked: "defaultChecked",
  srcobject: "srcObject",
  novalidate: "noValidate",
  allowfullscreen: "allowFullscreen",
  disablepictureinpicture: "disablePictureInPicture",
  disableremoteplayback: "disableRemotePlayback"
};
function normalize_attribute(name) {
  name = name.toLowerCase();
  return ATTRIBUTE_ALIASES[name] ?? name;
}
var DOM_PROPERTIES = [
  ...DOM_BOOLEAN_ATTRIBUTES,
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  "readOnly",
  "value",
  "volume",
  "defaultValue",
  "defaultChecked",
  "srcObject",
  "noValidate",
  "allowFullscreen",
  "disablePictureInPicture",
  "disableRemotePlayback"
];
var PASSIVE_EVENTS = ["touchstart", "touchmove"];
function is_passive_event(name) {
  return PASSIVE_EVENTS.includes(name);
}
var STATE_CREATION_RUNES = [
  "$state",
  "$state.raw",
  "$derived",
  "$derived.by"
];
var RUNES = [
  ...STATE_CREATION_RUNES,
  "$state.eager",
  "$state.snapshot",
  "$props",
  "$props.id",
  "$bindable",
  "$effect",
  "$effect.pre",
  "$effect.tracking",
  "$effect.root",
  "$effect.pending",
  "$inspect",
  "$inspect().with",
  "$inspect.trace",
  "$host"
];
var RAW_TEXT_ELEMENTS = ["textarea", "script", "style", "title"];
function is_raw_text_element(name) {
  return RAW_TEXT_ELEMENTS.includes(name);
}
// node_modules/svelte/src/internal/client/dev/css.js
var all_styles = new Map;
// node_modules/svelte/src/internal/client/dom/elements/events.js
var event_symbol = Symbol("events");
var all_registered_events = new Set;
var root_event_handles = new Set;
function replay_events(dom) {
  if (!hydrating)
    return;
  dom.removeAttribute("onload");
  dom.removeAttribute("onerror");
  const event = dom.__e;
  if (event !== undefined) {
    dom.__e = undefined;
    queueMicrotask(() => {
      if (dom.isConnected) {
        dom.dispatchEvent(event);
      }
    });
  }
}
function create_event(event_name, dom, handler, options = {}) {
  function target_handler(event) {
    if (!options.capture) {
      handle_event_propagation.call(dom, event);
    }
    if (!event.cancelBubble) {
      return without_reactive_context(() => {
        return handler?.call(this, event);
      });
    }
  }
  if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") {
    queue_micro_task(() => {
      dom.addEventListener(event_name, target_handler, options);
    });
  } else {
    dom.addEventListener(event_name, target_handler, options);
  }
  return target_handler;
}
function event(event_name, dom, handler, capture2, passive) {
  var options = { capture: capture2, passive };
  var target_handler = create_event(event_name, dom, handler, options);
  if (dom === document.body || dom === window || dom === document || dom instanceof HTMLMediaElement) {
    teardown(() => {
      dom.removeEventListener(event_name, target_handler, options);
    });
  }
}
function delegated(event_name, element, handler) {
  (element[event_symbol] ??= {})[event_name] = handler;
}
function delegate(events) {
  for (var i = 0;i < events.length; i++) {
    all_registered_events.add(events[i]);
  }
  for (var fn of root_event_handles) {
    fn(events);
  }
}
var last_propagated_event = null;
var last_propagated_event_clear_scheduled = false;
function handle_event_propagation(event2) {
  var handler_element = this;
  var owner_document = handler_element.ownerDocument;
  var event_name = event2.type;
  var path = event2.composedPath?.() || [];
  var current_target = path[0] || event2.target;
  last_propagated_event = event2;
  if (!last_propagated_event_clear_scheduled) {
    last_propagated_event_clear_scheduled = true;
    setTimeout(() => {
      last_propagated_event_clear_scheduled = false;
      last_propagated_event = null;
    });
  }
  var path_idx = 0;
  var handled_at = last_propagated_event === event2 && event2[event_symbol];
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (at_idx !== -1 && (handler_element === document || handler_element === window)) {
      event2[event_symbol] = handler_element;
      return;
    }
    var handler_idx = path.indexOf(handler_element);
    if (handler_idx === -1) {
      return;
    }
    if (at_idx <= handler_idx) {
      path_idx = at_idx;
    }
  }
  current_target = path[path_idx] || event2.target;
  if (current_target === handler_element)
    return;
  define_property(event2, "currentTarget", {
    configurable: true,
    get() {
      return current_target || owner_document;
    }
  });
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    var throw_error;
    var other_errors = [];
    while (current_target !== null) {
      if (current_target === handler_element)
        break;
      try {
        var delegated2 = current_target[event_symbol]?.[event_name];
        if (delegated2 != null && (!current_target.disabled || event2.target === current_target)) {
          delegated2.call(current_target, event2);
        }
      } catch (error) {
        if (throw_error) {
          other_errors.push(error);
        } else {
          throw_error = error;
        }
      }
      if (event2.cancelBubble)
        break;
      path_idx++;
      current_target = path_idx < path.length ? path[path_idx] : null;
    }
    if (throw_error) {
      for (let error of other_errors) {
        queueMicrotask(() => {
          throw error;
        });
      }
      throw throw_error;
    }
  } finally {
    event2[event_symbol] = handler_element;
    delete event2.currentTarget;
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}

// node_modules/svelte/src/internal/client/dom/reconciler.js
var policy = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
  createHTML: (html) => {
    return html;
  }
});
function create_trusted_html(html) {
  return policy?.createHTML(html) ?? html;
}
function create_fragment_from_html(html) {
  var elem = create_element("template");
  elem.innerHTML = create_trusted_html(html.replaceAll("<!>", "<!---->"));
  return elem.content;
}

// node_modules/svelte/src/internal/client/dom/template.js
function assign_nodes(start, end) {
  var effect2 = active_effect;
  if (effect2.nodes === null) {
    effect2.nodes = { start, end, a: null, t: null };
  }
}
function from_html(content, flags2) {
  var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
  var use_import_node = (flags2 & TEMPLATE_USE_IMPORT_NODE) !== 0;
  var node;
  var has_start = !content.startsWith("<!>");
  return () => {
    if (hydrating) {
      assign_nodes(hydrate_node, null);
      return hydrate_node;
    }
    if (node === undefined) {
      node = create_fragment_from_html(has_start ? content : "<!>" + content);
      if (!is_fragment)
        node = get_first_child(node);
    }
    var clone = use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true);
    if (is_fragment) {
      var start = get_first_child(clone);
      var end = clone.lastChild;
      assign_nodes(start, end);
    } else {
      assign_nodes(clone, clone);
    }
    return clone;
  };
}
function from_namespace(content, flags2, ns = "svg") {
  var has_start = !content.startsWith("<!>");
  var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
  var wrapped = `<${ns}>${has_start ? content : "<!>" + content}</${ns}>`;
  var node;
  return () => {
    if (hydrating) {
      assign_nodes(hydrate_node, null);
      return hydrate_node;
    }
    if (!node) {
      var fragment = create_fragment_from_html(wrapped);
      var root = get_first_child(fragment);
      if (is_fragment) {
        node = document.createDocumentFragment();
        while (get_first_child(root)) {
          node.appendChild(get_first_child(root));
        }
      } else {
        node = get_first_child(root);
      }
    }
    var clone = node.cloneNode(true);
    if (is_fragment) {
      var start = get_first_child(clone);
      var end = clone.lastChild;
      assign_nodes(start, end);
    } else {
      assign_nodes(clone, clone);
    }
    return clone;
  };
}
function from_svg(content, flags2) {
  return from_namespace(content, flags2, "svg");
}
function text(value = "") {
  if (!hydrating) {
    var t = create_text(value + "");
    assign_nodes(t, t);
    return t;
  }
  var node = hydrate_node;
  if (node.nodeType !== TEXT_NODE) {
    node.before(node = create_text());
    set_hydrate_node(node);
  } else {
    merge_text_nodes(node);
  }
  assign_nodes(node, node);
  return node;
}
function append(anchor, dom) {
  if (hydrating) {
    var effect2 = active_effect;
    if ((effect2.f & REACTION_RAN) === 0 || effect2.nodes.end === null) {
      effect2.nodes.end = hydrate_node;
    }
    hydrate_next();
    return;
  }
  if (anchor === null) {
    return;
  }
  anchor.before(dom);
}

// node_modules/svelte/src/internal/client/render.js
var should_intro = true;
function set_should_intro(value) {
  should_intro = value;
}
function set_text(text2, value) {
  var str = value == null ? "" : typeof value === "object" ? `${value}` : value;
  if (str !== (text2[TEXT_CACHE] ??= text2.nodeValue)) {
    text2[TEXT_CACHE] = str;
    text2.nodeValue = `${str}`;
  }
}
function mount(component, options) {
  return _mount(component, options);
}
function hydrate(component, options) {
  init_operations();
  options.intro = options.intro ?? false;
  const target = options.target;
  const was_hydrating = hydrating;
  const previous_hydrate_node = hydrate_node;
  try {
    var anchor = get_first_child(target);
    while (anchor && (anchor.nodeType !== COMMENT_NODE || anchor.data !== HYDRATION_START)) {
      anchor = get_next_sibling(anchor);
    }
    if (!anchor) {
      throw HYDRATION_ERROR;
    }
    set_hydrating(true);
    set_hydrate_node(anchor);
    const instance = _mount(component, { ...options, anchor });
    set_hydrating(false);
    return instance;
  } catch (error) {
    if (error instanceof Error && error.message.split(`
`).some((line) => line.startsWith("https://svelte.dev/e/"))) {
      throw error;
    }
    if (error !== HYDRATION_ERROR) {
      console.warn("Failed to hydrate: ", error);
    }
    if (options.recover === false) {
      hydration_failed();
    }
    init_operations();
    clear_text_content(target);
    set_hydrating(false);
    return mount(component, options);
  } finally {
    set_hydrating(was_hydrating);
    set_hydrate_node(previous_hydrate_node);
  }
}
var listeners = new Map;
function _mount(Component, { target, anchor, props = {}, events, context, intro = true, transformError }) {
  init_operations();
  var component = undefined;
  var unmount = component_root(() => {
    var anchor_node = anchor ?? target.appendChild(create_text());
    boundary(anchor_node, {
      pending: () => {}
    }, (anchor_node2) => {
      push({});
      var ctx = component_context;
      if (context)
        ctx.c = context;
      if (events) {
        props.$$events = events;
      }
      if (hydrating) {
        assign_nodes(anchor_node2, null);
      }
      should_intro = intro;
      component = Component(anchor_node2, props) || {};
      should_intro = true;
      if (hydrating) {
        active_effect.nodes.end = hydrate_node;
        if (hydrate_node === null || hydrate_node.nodeType !== COMMENT_NODE || hydrate_node.data !== HYDRATION_END) {
          hydration_mismatch();
          throw HYDRATION_ERROR;
        }
      }
      pop();
    }, transformError);
    var registered_events = new Set;
    var event_handle = (events2) => {
      for (var i = 0;i < events2.length; i++) {
        var event_name = events2[i];
        if (registered_events.has(event_name))
          continue;
        registered_events.add(event_name);
        var passive = is_passive_event(event_name);
        for (const node of [target, document]) {
          var counts = listeners.get(node);
          if (counts === undefined) {
            counts = new Map;
            listeners.set(node, counts);
          }
          var count = counts.get(event_name);
          if (count === undefined) {
            node.addEventListener(event_name, handle_event_propagation, { passive });
            counts.set(event_name, 1);
          } else {
            counts.set(event_name, count + 1);
          }
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    return () => {
      for (var event_name of registered_events) {
        for (const node of [target, document]) {
          var counts = listeners.get(node);
          var count = counts.get(event_name);
          if (--count == 0) {
            node.removeEventListener(event_name, handle_event_propagation);
            counts.delete(event_name);
            if (counts.size === 0) {
              listeners.delete(node);
            }
          } else {
            counts.set(event_name, count);
          }
        }
      }
      root_event_handles.delete(event_handle);
      if (anchor_node !== anchor) {
        anchor_node.parentNode?.removeChild(anchor_node);
      }
    };
  });
  mounted_components.set(component, unmount);
  return component;
}
var mounted_components = new WeakMap;
function unmount(component, options) {
  const fn = mounted_components.get(component);
  if (fn) {
    mounted_components.delete(component);
    return fn(options);
  }
  if (true_default) {
    if (STATE_SYMBOL in component) {
      state_proxy_unmount();
    } else {
      lifecycle_double_unmount();
    }
  }
  return Promise.resolve();
}
// node_modules/svelte/src/internal/client/dom/blocks/branches.js
class BranchManager {
  anchor;
  #batches = new Map;
  #onscreen = new Map;
  #offscreen = new Map;
  #outroing = new Set;
  #transition = true;
  constructor(anchor, transition = true) {
    this.anchor = anchor;
    this.#transition = transition;
  }
  #commit = (batch) => {
    if (!this.#batches.has(batch))
      return;
    var key = this.#batches.get(batch);
    var onscreen = this.#onscreen.get(key);
    if (onscreen) {
      resume_effect(onscreen);
      this.#outroing.delete(key);
    } else {
      var offscreen = this.#offscreen.get(key);
      if (offscreen) {
        resume_effect(offscreen.effect);
        this.#onscreen.set(key, offscreen.effect);
        this.#offscreen.delete(key);
        if (true_default) {
          offscreen.fragment.lastChild[HMR_ANCHOR] = this.anchor;
        }
        offscreen.fragment.lastChild.remove();
        this.anchor.before(offscreen.fragment);
        onscreen = offscreen.effect;
      }
    }
    for (const [b, k] of this.#batches) {
      this.#batches.delete(b);
      if (b === batch) {
        break;
      }
      const offscreen2 = this.#offscreen.get(k);
      if (offscreen2) {
        destroy_effect(offscreen2.effect);
        this.#offscreen.delete(k);
      }
    }
    for (const [k, effect2] of this.#onscreen) {
      if (k === key || this.#outroing.has(k))
        continue;
      const on_destroy = () => {
        const keys = Array.from(this.#batches.values());
        if (keys.includes(k)) {
          var fragment = document.createDocumentFragment();
          move_effect(effect2, fragment);
          fragment.append(create_text());
          this.#offscreen.set(k, { effect: effect2, fragment });
        } else {
          destroy_effect(effect2);
        }
        this.#outroing.delete(k);
        this.#onscreen.delete(k);
      };
      if (this.#transition || !onscreen) {
        this.#outroing.add(k);
        pause_effect(effect2, on_destroy, false);
      } else {
        on_destroy();
      }
    }
  };
  #discard = (batch) => {
    this.#batches.delete(batch);
    const keys = Array.from(this.#batches.values());
    for (const [k, branch2] of this.#offscreen) {
      if (!keys.includes(k)) {
        destroy_effect(branch2.effect);
        this.#offscreen.delete(k);
      }
    }
  };
  ensure(key, fn) {
    var batch = current_batch;
    var defer = should_defer_append();
    if (fn && !this.#onscreen.has(key) && !this.#offscreen.has(key)) {
      if (defer) {
        var fragment = document.createDocumentFragment();
        var target = create_text();
        fragment.append(target);
        this.#offscreen.set(key, {
          effect: branch(() => fn(target)),
          fragment
        });
      } else {
        this.#onscreen.set(key, branch(() => fn(this.anchor)));
      }
    }
    this.#batches.set(batch, key);
    if (defer) {
      for (const [k, effect2] of this.#onscreen) {
        if (k === key) {
          batch.unskip_effect(effect2);
        } else {
          batch.skip_effect(effect2);
        }
      }
      for (const [k, branch2] of this.#offscreen) {
        if (k === key) {
          batch.unskip_effect(branch2.effect);
        } else {
          batch.skip_effect(branch2.effect);
        }
      }
      batch.oncommit(this.#commit);
      batch.ondiscard(this.#discard);
    } else {
      if (hydrating) {
        this.anchor = hydrate_node;
      }
      this.#commit(batch);
    }
  }
}
// node_modules/svelte/src/internal/client/dom/blocks/if.js
function if_block(node, fn, elseif = false) {
  var marker;
  if (hydrating) {
    marker = hydrate_node;
    hydrate_next();
  }
  var branches = new BranchManager(node);
  var flags2 = elseif ? EFFECT_TRANSPARENT : 0;
  function update_branch(key, fn2) {
    if (hydrating) {
      var data = read_hydration_instruction(marker);
      if (key !== parseInt(data.substring(1))) {
        var anchor = skip_nodes();
        set_hydrate_node(anchor);
        branches.anchor = anchor;
        set_hydrating(false);
        branches.ensure(key, fn2);
        set_hydrating(true);
        return;
      }
    }
    branches.ensure(key, fn2);
  }
  block(() => {
    var has_branch = false;
    fn((fn2, key = 0) => {
      has_branch = true;
      update_branch(key, fn2);
    });
    if (!has_branch) {
      update_branch(-1, null);
    }
  }, flags2);
}
// node_modules/svelte/src/internal/client/dom/blocks/key.js
var NAN = Symbol("NaN");
// node_modules/svelte/src/internal/client/dom/blocks/each.js
function index(_, i) {
  return i;
}
function pause_effects(state2, to_destroy, controlled_anchor) {
  var transitions = [];
  var length = to_destroy.length;
  var group;
  var remaining = to_destroy.length;
  for (var i = 0;i < length; i++) {
    let effect2 = to_destroy[i];
    pause_effect(effect2, () => {
      if (group) {
        group.pending.delete(effect2);
        group.done.add(effect2);
        if (group.pending.size === 0) {
          var groups = state2.outrogroups;
          destroy_effects(state2, array_from(group.done));
          groups.delete(group);
          if (groups.size === 0) {
            state2.outrogroups = null;
          }
        }
      } else {
        remaining -= 1;
      }
    }, false);
  }
  if (remaining === 0) {
    var fast_path = transitions.length === 0 && controlled_anchor !== null && state2.pending.size === 0;
    if (fast_path) {
      var anchor = controlled_anchor;
      var parent_node = anchor.parentNode;
      clear_text_content(parent_node);
      parent_node.append(anchor);
      state2.items.clear();
    }
    destroy_effects(state2, to_destroy, !fast_path);
  } else {
    group = {
      pending: new Set(to_destroy),
      done: new Set
    };
    (state2.outrogroups ??= new Set).add(group);
  }
}
function destroy_effects(state2, to_destroy, remove_dom = true) {
  var preserved_effects;
  if (state2.pending.size > 0) {
    preserved_effects = new Set;
    for (const keys of state2.pending.values()) {
      for (const key of keys) {
        preserved_effects.add(state2.items.get(key).e);
      }
    }
  }
  for (var i = 0;i < to_destroy.length; i++) {
    var e = to_destroy[i];
    if (preserved_effects?.has(e)) {
      e.f |= EFFECT_OFFSCREEN;
      const fragment = document.createDocumentFragment();
      move_effect(e, fragment);
    } else {
      destroy_effect(to_destroy[i], remove_dom);
    }
  }
}
var offscreen_anchor;
function each(node, flags2, get_collection, get_key, render_fn, fallback_fn = null) {
  var anchor = node;
  var items = new Map;
  var is_controlled = (flags2 & EACH_IS_CONTROLLED) !== 0;
  if (is_controlled) {
    var parent_node = node;
    anchor = hydrating ? set_hydrate_node(get_first_child(parent_node)) : parent_node.appendChild(create_text());
  }
  if (hydrating) {
    hydrate_next();
  }
  var fallback = null;
  var each_array = derived_safe_equal(() => {
    var collection = get_collection();
    return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
  });
  if (true_default) {
    tag(each_array, "{#each ...}");
  }
  var array;
  var pending = new Map;
  var first_run = true;
  function commit(batch) {
    if ((state2.effect.f & DESTROYED) !== 0) {
      return;
    }
    state2.pending.delete(batch);
    state2.fallback = fallback;
    reconcile(state2, array, anchor, flags2, get_key);
    if (fallback !== null) {
      if (array.length === 0) {
        if ((fallback.f & EFFECT_OFFSCREEN) === 0) {
          resume_effect(fallback);
        } else {
          fallback.f ^= EFFECT_OFFSCREEN;
          move(fallback, null, anchor);
        }
      } else {
        pause_effect(fallback, () => {
          fallback = null;
        });
      }
    }
  }
  function discard(batch) {
    state2.pending.delete(batch);
  }
  var effect2 = block(() => {
    array = get2(each_array);
    var length = array.length;
    let mismatch = false;
    if (hydrating) {
      var is_else = read_hydration_instruction(anchor) === HYDRATION_START_ELSE;
      if (is_else !== (length === 0)) {
        anchor = skip_nodes();
        set_hydrate_node(anchor);
        set_hydrating(false);
        mismatch = true;
      }
    }
    var keys = new Set;
    var batch = current_batch;
    var defer = should_defer_append();
    for (var index2 = 0;index2 < length; index2 += 1) {
      if (hydrating && hydrate_node.nodeType === COMMENT_NODE && hydrate_node.data === HYDRATION_END) {
        anchor = hydrate_node;
        mismatch = true;
        set_hydrating(false);
      }
      var value = array[index2];
      var key = get_key(value, index2);
      if (true_default) {
        var key_again = get_key(value, index2);
        if (key !== key_again) {
          each_key_volatile(String(index2), String(key), String(key_again));
        }
      }
      var item = first_run ? null : items.get(key);
      if (item) {
        if (item.v)
          internal_set(item.v, value);
        if (item.i)
          internal_set(item.i, index2);
        if (defer) {
          batch.unskip_effect(item.e);
        }
      } else {
        item = create_item(items, first_run ? anchor : offscreen_anchor ??= create_text(), value, key, index2, render_fn, flags2, get_collection);
        if (!first_run) {
          item.e.f |= EFFECT_OFFSCREEN;
        }
        items.set(key, item);
      }
      keys.add(key);
    }
    if (length === 0 && fallback_fn && !fallback) {
      if (first_run) {
        fallback = branch(() => fallback_fn(anchor));
      } else {
        fallback = branch(() => fallback_fn(offscreen_anchor ??= create_text()));
        fallback.f |= EFFECT_OFFSCREEN;
      }
    }
    if (length > keys.size) {
      if (true_default) {
        validate_each_keys(array, get_key);
      } else {
        each_key_duplicate("", "", "");
      }
    }
    if (hydrating && length > 0) {
      set_hydrate_node(skip_nodes());
    }
    if (!first_run) {
      pending.set(batch, keys);
      if (defer) {
        for (const [key2, item2] of items) {
          if (!keys.has(key2)) {
            batch.skip_effect(item2.e);
          }
        }
        batch.oncommit(commit);
        batch.ondiscard(discard);
      } else {
        commit(batch);
      }
    }
    if (mismatch) {
      set_hydrating(true);
    }
    get2(each_array);
  });
  var state2 = { effect: effect2, flags: flags2, items, pending, outrogroups: null, fallback };
  first_run = false;
  if (hydrating) {
    anchor = hydrate_node;
  }
}
function skip_to_branch(effect2) {
  while (effect2 !== null && (effect2.f & BRANCH_EFFECT) === 0) {
    effect2 = effect2.next;
  }
  return effect2;
}
function reconcile(state2, array, anchor, flags2, get_key) {
  var is_animated = (flags2 & EACH_IS_ANIMATED) !== 0;
  var length = array.length;
  var items = state2.items;
  var current = skip_to_branch(state2.effect.first);
  var seen;
  var prev = null;
  var to_animate;
  var matched = [];
  var stashed = [];
  var value;
  var key;
  var effect2;
  var i;
  if (is_animated) {
    for (i = 0;i < length; i += 1) {
      value = array[i];
      key = get_key(value, i);
      effect2 = items.get(key).e;
      if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
        effect2.nodes?.a?.measure();
        (to_animate ??= new Set).add(effect2);
      }
    }
  }
  for (i = 0;i < length; i += 1) {
    value = array[i];
    key = get_key(value, i);
    effect2 = items.get(key).e;
    if (state2.outrogroups !== null) {
      for (const group of state2.outrogroups) {
        group.pending.delete(effect2);
        group.done.delete(effect2);
      }
    }
    if ((effect2.f & INERT) !== 0) {
      resume_effect(effect2);
      if (is_animated) {
        effect2.nodes?.a?.unfix();
        (to_animate ??= new Set).delete(effect2);
      }
    }
    if ((effect2.f & EFFECT_OFFSCREEN) !== 0) {
      effect2.f ^= EFFECT_OFFSCREEN;
      if (effect2 === current) {
        move(effect2, null, anchor);
      } else {
        var next2 = prev ? prev.next : current;
        if (effect2 === state2.effect.last) {
          state2.effect.last = effect2.prev;
        }
        if (effect2.prev)
          effect2.prev.next = effect2.next;
        if (effect2.next)
          effect2.next.prev = effect2.prev;
        link(state2, prev, effect2);
        link(state2, effect2, next2);
        move(effect2, next2, anchor);
        prev = effect2;
        matched = [];
        stashed = [];
        current = skip_to_branch(prev.next);
        continue;
      }
    }
    if (effect2 !== current) {
      if (seen !== undefined && seen.has(effect2)) {
        if (matched.length < stashed.length) {
          var start = stashed[0];
          var j;
          prev = start.prev;
          var a = matched[0];
          var b = matched[matched.length - 1];
          for (j = 0;j < matched.length; j += 1) {
            move(matched[j], start, anchor);
          }
          for (j = 0;j < stashed.length; j += 1) {
            seen.delete(stashed[j]);
          }
          link(state2, a.prev, b.next);
          link(state2, prev, a);
          link(state2, b, start);
          current = start;
          prev = b;
          i -= 1;
          matched = [];
          stashed = [];
        } else {
          seen.delete(effect2);
          move(effect2, current, anchor);
          link(state2, effect2.prev, effect2.next);
          link(state2, effect2, prev === null ? state2.effect.first : prev.next);
          link(state2, prev, effect2);
          prev = effect2;
        }
        continue;
      }
      matched = [];
      stashed = [];
      while (current !== null && current !== effect2) {
        (seen ??= new Set).add(current);
        stashed.push(current);
        current = skip_to_branch(current.next);
      }
      if (current === null) {
        continue;
      }
    }
    if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
      matched.push(effect2);
    }
    prev = effect2;
    current = skip_to_branch(effect2.next);
  }
  if (state2.outrogroups !== null) {
    for (const group of state2.outrogroups) {
      if (group.pending.size === 0) {
        destroy_effects(state2, array_from(group.done));
        state2.outrogroups?.delete(group);
      }
    }
    if (state2.outrogroups.size === 0) {
      state2.outrogroups = null;
    }
  }
  if (current !== null || seen !== undefined) {
    var to_destroy = [];
    if (seen !== undefined) {
      for (effect2 of seen) {
        if ((effect2.f & INERT) === 0) {
          to_destroy.push(effect2);
        }
      }
    }
    while (current !== null) {
      if ((current.f & INERT) === 0 && current !== state2.fallback) {
        to_destroy.push(current);
      }
      current = skip_to_branch(current.next);
    }
    var destroy_length = to_destroy.length;
    if (destroy_length > 0) {
      var controlled_anchor = (flags2 & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
      if (is_animated) {
        for (i = 0;i < destroy_length; i += 1) {
          to_destroy[i].nodes?.a?.measure();
        }
        for (i = 0;i < destroy_length; i += 1) {
          to_destroy[i].nodes?.a?.fix();
        }
      }
      pause_effects(state2, to_destroy, controlled_anchor);
    }
  }
  if (is_animated) {
    queue_micro_task(() => {
      if (to_animate === undefined)
        return;
      for (effect2 of to_animate) {
        effect2.nodes?.a?.apply();
      }
    });
  }
}
function create_item(items, anchor, value, key, index2, render_fn, flags2, get_collection) {
  var v = (flags2 & EACH_ITEM_REACTIVE) !== 0 ? (flags2 & EACH_ITEM_IMMUTABLE) === 0 ? mutable_source(value, false, false) : source(value) : null;
  var i = (flags2 & EACH_INDEX_REACTIVE) !== 0 ? source(index2) : null;
  if (true_default && v) {
    v.trace = () => {
      get_collection()[i?.v ?? index2];
    };
  }
  return {
    v,
    i,
    e: branch(() => {
      render_fn(anchor, v ?? value, i ?? index2, get_collection);
      return () => {
        items.delete(key);
      };
    })
  };
}
function move(effect2, next2, anchor) {
  if (!effect2.nodes)
    return;
  var node = effect2.nodes.start;
  var end = effect2.nodes.end;
  var dest = next2 && (next2.f & EFFECT_OFFSCREEN) === 0 ? next2.nodes.start : anchor;
  while (node !== null) {
    var next_node = get_next_sibling(node);
    dest.before(node);
    if (node === end) {
      return;
    }
    node = next_node;
  }
}
function link(state2, prev, next2) {
  if (prev === null) {
    state2.effect.first = next2;
  } else {
    prev.next = next2;
  }
  if (next2 === null) {
    state2.effect.last = prev;
  } else {
    next2.prev = prev;
  }
}
function validate_each_keys(array, key_fn) {
  const keys = new Map;
  const length = array.length;
  for (let i = 0;i < length; i++) {
    const key = key_fn(array[i], i);
    if (keys.has(key)) {
      const a = String(keys.get(key));
      const b = String(i);
      let k = String(key);
      if (k.startsWith("[object "))
        k = null;
      each_key_duplicate(a, b, k);
    }
    keys.set(key, i);
  }
}
// node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function snippet(node, get_snippet, ...args) {
  var branches = new BranchManager(node);
  block(() => {
    const snippet2 = get_snippet() ?? null;
    if (true_default && snippet2 == null) {
      invalid_snippet();
    }
    branches.ensure(snippet2, snippet2 && ((anchor) => snippet2(anchor, ...args)));
  }, EFFECT_TRANSPARENT);
}
// node_modules/svelte/src/internal/client/timing.js
var now = true_default ? () => performance.now() : () => Date.now();
var raf = {
  tick: (_) => (true_default ? requestAnimationFrame : noop)(_),
  now: () => now(),
  tasks: new Set
};

// node_modules/svelte/src/internal/client/dom/elements/transitions.js
var animation_effect_override = null;
function set_animation_effect_override(v) {
  animation_effect_override = v;
}

// node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function element(node, get_tag, is_svg, render_fn, get_namespace, location) {
  let was_hydrating = hydrating;
  if (hydrating) {
    hydrate_next();
  }
  var filename = true_default && location && component_context?.function[FILENAME];
  var element2 = null;
  if (hydrating && hydrate_node.nodeType === ELEMENT_NODE) {
    element2 = hydrate_node;
    hydrate_next();
  }
  var anchor = hydrating ? hydrate_node : node;
  var parent_effect = active_effect;
  var branches = new BranchManager(anchor, false);
  block(() => {
    const next_tag = get_tag() || null;
    var ns = get_namespace ? get_namespace() : is_svg || next_tag === "svg" ? NAMESPACE_SVG : undefined;
    if (next_tag === null) {
      branches.ensure(null, null);
      set_should_intro(true);
      return;
    }
    branches.ensure(next_tag, (anchor2) => {
      if (next_tag) {
        element2 = hydrating ? element2 : create_element(next_tag, ns);
        if (true_default && location) {
          element2.__svelte_meta = {
            parent: dev_stack,
            loc: {
              file: filename,
              line: location[0],
              column: location[1]
            }
          };
        }
        assign_nodes(element2, element2);
        if (render_fn) {
          var tmp_comment = null;
          if (hydrating && is_raw_text_element(next_tag)) {
            element2.append(tmp_comment = document.createComment(""));
          }
          var child_anchor = hydrating ? get_first_child(element2) : element2.appendChild(create_text());
          if (hydrating) {
            if (child_anchor === null) {
              set_hydrating(false);
            } else {
              set_hydrate_node(child_anchor);
            }
          }
          set_animation_effect_override(parent_effect);
          render_fn(element2, child_anchor);
          tmp_comment?.remove();
          set_animation_effect_override(null);
        }
        active_effect.nodes.end = element2;
        anchor2.before(element2);
      }
      if (hydrating) {
        set_hydrate_node(anchor2);
      }
    });
    set_should_intro(true);
    return () => {
      if (next_tag) {
        set_should_intro(false);
      }
    };
  }, EFFECT_TRANSPARENT);
  teardown(() => {
    set_should_intro(true);
  });
  if (was_hydrating) {
    set_hydrating(true);
    set_hydrate_node(anchor);
  }
}
// node_modules/svelte/src/internal/client/dom/elements/attachments.js
function attach(node, get_fn) {
  var fn = undefined;
  var e;
  managed(() => {
    if (fn !== (fn = get_fn())) {
      if (e) {
        destroy_effect(e);
        e = null;
      }
      if (fn) {
        e = branch(() => {
          effect(() => fn(node));
        });
      }
    }
  });
}
// node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t, f, n = "";
  if (typeof e == "string" || typeof e == "number")
    n += e;
  else if (typeof e == "object")
    if (Array.isArray(e)) {
      var o = e.length;
      for (t = 0;t < o; t++)
        e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
    } else
      for (f in e)
        e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length;f < o; f++)
    (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}

// node_modules/svelte/src/internal/shared/attributes.js
var replacements = {
  translate: new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function clsx2(value) {
  if (typeof value === "object") {
    return clsx(value);
  } else {
    return value ?? "";
  }
}
var whitespace = [...` 	
\r\f \v\uFEFF`];
function to_class(value, hash2, directives) {
  var classname = value == null ? "" : "" + value;
  if (hash2) {
    classname = classname ? classname + " " + hash2 : hash2;
  }
  if (directives) {
    for (var key of Object.keys(directives)) {
      if (directives[key]) {
        classname = classname ? classname + " " + key : key;
      } else if (classname.length) {
        var len = key.length;
        var a = 0;
        while ((a = classname.indexOf(key, a)) >= 0) {
          var b = a + len;
          if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
            classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
          } else {
            a = b;
          }
        }
      }
    }
  }
  return classname === "" ? null : classname;
}
function append_styles(styles, important = false) {
  var separator = important ? " !important;" : ";";
  var css = "";
  for (var key of Object.keys(styles)) {
    var value = styles[key];
    if (value != null && value !== "") {
      css += " " + key + ": " + value + separator;
    }
  }
  return css;
}
function to_css_name(name) {
  if (name[0] !== "-" || name[1] !== "-") {
    return name.toLowerCase();
  }
  return name;
}
function to_style(value, styles) {
  if (styles) {
    var new_style = "";
    var normal_styles;
    var important_styles;
    if (Array.isArray(styles)) {
      normal_styles = styles[0];
      important_styles = styles[1];
    } else {
      normal_styles = styles;
    }
    if (value) {
      value = String(value).replaceAll(/\/\*.*?\*\//g, "").trim();
      var in_str = false;
      var in_apo = 0;
      var in_comment = false;
      var reserved_names = [];
      if (normal_styles) {
        reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
      }
      if (important_styles) {
        reserved_names.push(...Object.keys(important_styles).map(to_css_name));
      }
      var start_index = 0;
      var name_index = -1;
      const len = value.length;
      for (var i = 0;i < len; i++) {
        var c = value[i];
        if (in_comment) {
          if (c === "/" && value[i - 1] === "*") {
            in_comment = false;
          }
        } else if (in_str) {
          if (in_str === c) {
            in_str = false;
          }
        } else if (c === "/" && value[i + 1] === "*") {
          in_comment = true;
        } else if (c === '"' || c === "'") {
          in_str = c;
        } else if (c === "(") {
          in_apo++;
        } else if (c === ")") {
          in_apo--;
        }
        if (!in_comment && in_str === false && in_apo === 0) {
          if (c === ":" && name_index === -1) {
            name_index = i;
          } else if (c === ";" || i === len - 1) {
            if (name_index !== -1) {
              var name = to_css_name(value.substring(start_index, name_index).trim());
              if (!reserved_names.includes(name)) {
                if (c !== ";") {
                  i++;
                }
                var property = value.substring(start_index, i).trim();
                new_style += " " + property + ";";
              }
            }
            start_index = i + 1;
            name_index = -1;
          }
        }
      }
    }
    if (normal_styles) {
      new_style += append_styles(normal_styles);
    }
    if (important_styles) {
      new_style += append_styles(important_styles, true);
    }
    new_style = new_style.trim();
    return new_style === "" ? null : new_style;
  }
  return value == null ? null : String(value);
}

// node_modules/svelte/src/internal/client/dom/elements/class.js
function set_class(dom, is_html, value, hash2, prev_classes, next_classes) {
  var prev = dom[CLASS_CACHE];
  if (hydrating || prev !== value || prev === undefined) {
    var next_class_name = to_class(value, hash2, next_classes);
    if (!hydrating || next_class_name !== dom.getAttribute("class")) {
      if (next_class_name == null) {
        dom.removeAttribute("class");
      } else if (is_html) {
        dom.className = next_class_name;
      } else {
        dom.setAttribute("class", next_class_name);
      }
    }
    dom[CLASS_CACHE] = value;
  } else if (next_classes && prev_classes !== next_classes) {
    for (var key in next_classes) {
      var is_present = !!next_classes[key];
      if (prev_classes == null || is_present !== !!prev_classes[key]) {
        dom.classList.toggle(key, is_present);
      }
    }
  }
  return next_classes;
}

// node_modules/svelte/src/internal/client/dom/elements/style.js
function update_styles(dom, prev = {}, next2, priority) {
  for (var key in next2) {
    var value = next2[key];
    if (prev[key] !== value) {
      if (next2[key] == null) {
        dom.style.removeProperty(key);
      } else {
        dom.style.setProperty(key, value, priority);
      }
    }
  }
}
function set_style(dom, value, prev_styles, next_styles) {
  var prev = dom[STYLE_CACHE];
  if (hydrating || prev !== value) {
    var next_style_attr = to_style(value, next_styles);
    if (!hydrating || next_style_attr !== dom.getAttribute("style")) {
      if (next_style_attr == null) {
        dom.removeAttribute("style");
      } else {
        dom.style.cssText = next_style_attr;
      }
    }
    dom[STYLE_CACHE] = value;
  } else if (next_styles) {
    if (Array.isArray(next_styles)) {
      update_styles(dom, prev_styles?.[0], next_styles[0]);
      update_styles(dom, prev_styles?.[1], next_styles[1], "important");
    } else {
      update_styles(dom, prev_styles, next_styles);
    }
  }
  return next_styles;
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function select_option(select, value, mounting = false) {
  if (select.multiple) {
    if (value == undefined) {
      return;
    }
    if (!is_array(value)) {
      return select_multiple_invalid_value();
    }
    for (var option of select.options) {
      option.selected = value.includes(get_option_value(option));
    }
    return;
  }
  for (option of select.options) {
    var option_value = get_option_value(option);
    if (is(option_value, value)) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== undefined) {
    select.selectedIndex = -1;
  }
}
function init_select(select) {
  var observer = new MutationObserver(() => {
    if ("__value" in select) {
      select_option(select, select.__value);
    }
  });
  observer.observe(select, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["value"]
  });
  teardown(() => {
    observer.disconnect();
  });
}
function get_option_value(option) {
  if ("__value" in option) {
    return option.__value;
  } else {
    return option.value;
  }
}

// node_modules/svelte/src/internal/client/dom/elements/attributes.js
var CLASS = Symbol("class");
var STYLE = Symbol("style");
var IS_CUSTOM_ELEMENT = Symbol("is custom element");
var IS_HTML = Symbol("is html");
var LINK_TAG = IS_XHTML ? "link" : "LINK";
var INPUT_TAG = IS_XHTML ? "input" : "INPUT";
var OPTION_TAG = IS_XHTML ? "option" : "OPTION";
var SELECT_TAG = IS_XHTML ? "select" : "SELECT";
function remove_input_defaults(input) {
  if (!hydrating)
    return;
  var already_removed = false;
  var remove_defaults = () => {
    if (already_removed)
      return;
    already_removed = true;
    if (input.hasAttribute("value")) {
      var value = input.value;
      set_attribute2(input, "value", null);
      input.value = value;
    }
    if (input.hasAttribute("checked")) {
      var checked = input.checked;
      set_attribute2(input, "checked", null);
      input.checked = checked;
    }
  };
  input[FORM_RESET_HANDLER] = remove_defaults;
  queue_micro_task(remove_defaults);
  add_form_reset_listener();
}
function set_selected(element2, selected) {
  if (selected) {
    if (!element2.hasAttribute("selected")) {
      element2.setAttribute("selected", "");
    }
  } else {
    element2.removeAttribute("selected");
  }
}
function set_attribute2(element2, attribute, value, skip_warning) {
  var attributes = get_attributes(element2);
  if (hydrating) {
    attributes[attribute] = element2.getAttribute(attribute);
    if (attribute === "src" || attribute === "srcset" || attribute === "href" && element2.nodeName === LINK_TAG) {
      if (!skip_warning) {
        check_src_in_dev_hydration(element2, attribute, value ?? "");
      }
      return;
    }
  }
  if (attributes[attribute] === (attributes[attribute] = value))
    return;
  if (attribute === "loading") {
    element2[LOADING_ATTR_SYMBOL] = value;
  }
  if (value == null) {
    element2.removeAttribute(attribute);
  } else if (typeof value !== "string" && get_setters(element2).includes(attribute)) {
    element2[attribute] = value;
  } else {
    element2.setAttribute(attribute, value);
  }
}
function set_attributes(element2, prev, next2, css_hash, should_remove_defaults = false, skip_warning = false) {
  if (hydrating && should_remove_defaults && element2.nodeName === INPUT_TAG) {
    var input = element2;
    var attribute = input.type === "checkbox" ? "defaultChecked" : "defaultValue";
    if (!(attribute in next2)) {
      remove_input_defaults(input);
    }
  }
  var attributes = get_attributes(element2);
  var is_custom_element = attributes[IS_CUSTOM_ELEMENT];
  var preserve_attribute_case = !attributes[IS_HTML];
  let is_hydrating_custom_element = hydrating && is_custom_element;
  if (is_hydrating_custom_element) {
    set_hydrating(false);
  }
  var current = prev || {};
  var is_option_element = element2.nodeName === OPTION_TAG;
  for (var key in prev) {
    if (!(key in next2) && key[0] + key[1] !== "$$") {
      next2[key] = null;
    }
  }
  if (next2.class) {
    next2.class = clsx2(next2.class);
  } else if (css_hash || next2[CLASS]) {
    next2.class = null;
  }
  if (next2[STYLE]) {
    next2.style ??= null;
  }
  var setters = get_setters(element2);
  if (element2.nodeName === INPUT_TAG && "type" in next2 && (("value" in next2) || ("__value" in next2))) {
    var type = next2.type;
    if (type !== current.type || type === undefined && element2.hasAttribute("type")) {
      current.type = type;
      set_attribute2(element2, "type", type, skip_warning);
    }
  }
  for (const key2 in next2) {
    let value = next2[key2];
    if (is_option_element && key2 === "value" && value == null) {
      element2.value = element2.__value = "";
      current[key2] = value;
      continue;
    }
    if (key2 === "class") {
      var is_html = element2.namespaceURI === "http://www.w3.org/1999/xhtml";
      set_class(element2, is_html, value, css_hash, prev?.[CLASS], next2[CLASS]);
      current[key2] = value;
      current[CLASS] = next2[CLASS];
      continue;
    }
    if (key2 === "style") {
      set_style(element2, value, prev?.[STYLE], next2[STYLE]);
      current[key2] = value;
      current[STYLE] = next2[STYLE];
      continue;
    }
    var prev_value = current[key2];
    if (value === prev_value && !(value === undefined && element2.hasAttribute(key2))) {
      continue;
    }
    current[key2] = value;
    var prefix = key2[0] + key2[1];
    if (prefix === "$$")
      continue;
    if (prefix === "on") {
      const opts = {};
      const event_handle_key = "$$" + key2;
      let event_name = key2.slice(2);
      var is_delegated = can_delegate_event(event_name);
      if (is_capture_event(event_name)) {
        event_name = event_name.slice(0, -7);
        opts.capture = true;
      }
      if (!is_delegated && prev_value) {
        if (value != null)
          continue;
        element2.removeEventListener(event_name, current[event_handle_key], opts);
        current[event_handle_key] = null;
      }
      if (is_delegated) {
        delegated(event_name, element2, value);
        delegate([event_name]);
      } else if (value != null) {
        let handle = function(evt) {
          current[key2].call(this, evt);
        };
        current[event_handle_key] = create_event(event_name, element2, handle, opts);
      }
    } else if (key2 === "style") {
      set_attribute2(element2, key2, value);
    } else if (key2 === "autofocus") {
      autofocus(element2, Boolean(value));
    } else if (!is_custom_element && (key2 === "__value" || key2 === "value" && value != null)) {
      element2.value = element2.__value = value;
    } else if (key2 === "selected" && is_option_element) {
      set_selected(element2, value);
    } else {
      var name = key2;
      if (!preserve_attribute_case) {
        name = normalize_attribute(name);
      }
      var is_default = name === "defaultValue" || name === "defaultChecked";
      if (value == null && !is_custom_element && !is_default) {
        attributes[key2] = null;
        if (name === "value" || name === "checked") {
          let input2 = element2;
          const use_default = prev === undefined;
          if (name === "value") {
            let previous = input2.defaultValue;
            input2.removeAttribute(name);
            input2.defaultValue = previous;
            input2.value = input2.__value = use_default ? previous : null;
          } else {
            let previous = input2.defaultChecked;
            input2.removeAttribute(name);
            input2.defaultChecked = previous;
            input2.checked = use_default ? previous : false;
          }
        } else {
          element2.removeAttribute(key2);
        }
      } else if (is_default || setters.includes(name) && (is_custom_element || typeof value !== "string")) {
        element2[name] = value;
        if (name in attributes)
          attributes[name] = UNINITIALIZED;
      } else if (typeof value !== "function") {
        set_attribute2(element2, name, value, skip_warning);
      }
    }
  }
  if (is_hydrating_custom_element) {
    set_hydrating(true);
  }
  return current;
}
function attribute_effect(element2, fn, sync = [], async = [], blockers = [], css_hash, should_remove_defaults = false, skip_warning = false) {
  flatten(blockers, sync, async, (values) => {
    var prev = undefined;
    var effects = {};
    var is_select = element2.nodeName === SELECT_TAG;
    var inited = false;
    managed(() => {
      var next2 = fn(...values.map(get2));
      var current = set_attributes(element2, prev, next2, css_hash, should_remove_defaults, skip_warning);
      if (inited && is_select && "value" in next2) {
        select_option(element2, next2.value);
      }
      for (let symbol of Object.getOwnPropertySymbols(effects)) {
        if (!next2[symbol])
          destroy_effect(effects[symbol]);
      }
      for (let symbol of Object.getOwnPropertySymbols(next2)) {
        var n = next2[symbol];
        if (symbol.description === ATTACHMENT_KEY && (!prev || n !== prev[symbol])) {
          if (effects[symbol])
            destroy_effect(effects[symbol]);
          effects[symbol] = branch(() => attach(element2, () => n));
        }
        current[symbol] = n;
      }
      prev = current;
    });
    if (is_select) {
      var select = element2;
      effect(() => {
        select_option(select, prev.value, true);
        init_select(select);
      });
    }
    inited = true;
  });
}
function get_attributes(element2) {
  return element2[ATTRIBUTES_CACHE] ??= {
    [IS_CUSTOM_ELEMENT]: element2.nodeName.includes("-"),
    [IS_HTML]: element2.namespaceURI === NAMESPACE_HTML
  };
}
var setters_cache = new Map;
function get_setters(element2) {
  var cache_key = element2.getAttribute("is") || element2.nodeName;
  var setters = setters_cache.get(cache_key);
  if (setters)
    return setters;
  setters_cache.set(cache_key, setters = []);
  var descriptors;
  var proto = element2;
  var element_proto = Element.prototype;
  while (element_proto !== proto) {
    descriptors = get_descriptors(proto);
    for (var key in descriptors) {
      if (descriptors[key].set && key !== "innerHTML" && key !== "textContent" && key !== "innerText") {
        setters.push(key);
      }
    }
    proto = get_prototype_of(proto);
  }
  return setters;
}
function check_src_in_dev_hydration(element2, attribute, value) {
  if (!true_default)
    return;
  if (attribute === "srcset" && srcset_url_equal(element2, value))
    return;
  if (src_url_equal(element2.getAttribute(attribute) ?? "", value))
    return;
  hydration_attribute_changed(attribute, element2.outerHTML.replace(element2.innerHTML, element2.innerHTML && "..."), String(value));
}
function src_url_equal(element_src, url) {
  if (element_src === url)
    return true;
  return new URL(element_src, document.baseURI).href === new URL(url, document.baseURI).href;
}
function split_srcset(srcset) {
  return srcset.split(",").map((src) => src.trim().split(" ").filter(Boolean));
}
function srcset_url_equal(element2, srcset) {
  var element_urls = split_srcset(element2.srcset);
  var urls = split_srcset(srcset);
  return urls.length === element_urls.length && urls.every(([url, width], i) => width === element_urls[i][1] && (src_url_equal(element_urls[i][0], url) || src_url_equal(url, element_urls[i][0])));
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function bind_value(input, get3, set2 = get3) {
  var batches = new WeakSet;
  listen_to_event_and_reset_event(input, "input", async (is_reset) => {
    if (true_default && input.type === "checkbox") {
      bind_invalid_checkbox_value();
    }
    var value = is_reset ? input.defaultValue : input.value;
    value = is_numberlike_input(input) ? to_number(value) : value;
    set2(value);
    if (current_batch !== null) {
      batches.add(current_batch);
    }
    await tick();
    if (value !== (value = get3())) {
      var start = input.selectionStart;
      var end = input.selectionEnd;
      var length = input.value.length;
      input.value = value ?? "";
      if (end !== null) {
        var new_length = input.value.length;
        if (start === end && end === length && new_length > length) {
          input.selectionStart = new_length;
          input.selectionEnd = new_length;
        } else {
          input.selectionStart = start;
          input.selectionEnd = Math.min(end, new_length);
        }
      }
    }
  });
  if (hydrating && input.defaultValue !== input.value || untrack(get3) == null && input.value) {
    set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
    if (current_batch !== null) {
      batches.add(current_batch);
    }
  }
  render_effect(() => {
    if (true_default && input.type === "checkbox") {
      bind_invalid_checkbox_value();
    }
    var value = get3();
    if (input === document.activeElement) {
      var batch = async_mode_flag ? previous_batch : current_batch;
      if (batches.has(batch)) {
        return;
      }
    }
    if (is_numberlike_input(input) && value === to_number(input.value)) {
      return;
    }
    if (input.type === "date" && !value && !input.value) {
      return;
    }
    if (value !== input.value) {
      input.value = value ?? "";
    }
  });
}
var pending = new Set;
function is_numberlike_input(input) {
  var type = input.type;
  return type === "number" || type === "range";
}
function to_number(value) {
  return value === "" ? null : +value;
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/size.js
class ResizeObserverSingleton {
  #listeners = new WeakMap;
  #observer;
  #options;
  static entries = new WeakMap;
  constructor(options) {
    this.#options = options;
  }
  observe(element2, listener) {
    var listeners2 = this.#listeners.get(element2) || new Set;
    listeners2.add(listener);
    this.#listeners.set(element2, listeners2);
    this.#getObserver().observe(element2, this.#options);
    return () => {
      var listeners3 = this.#listeners.get(element2);
      listeners3.delete(listener);
      if (listeners3.size === 0) {
        this.#listeners.delete(element2);
        this.#observer.unobserve(element2);
      }
    };
  }
  #getObserver() {
    return this.#observer ?? (this.#observer = new ResizeObserver((entries) => {
      for (var entry of entries) {
        ResizeObserverSingleton.entries.set(entry.target, entry);
        for (var listener of this.#listeners.get(entry.target) || []) {
          listener(entry);
        }
      }
    }));
  }
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function is_bound_this(bound_value, element_or_component) {
  return bound_value === element_or_component || bound_value?.[STATE_SYMBOL] === element_or_component;
}
function bind_this(element_or_component = {}, update2, get_value, get_parts) {
  var component_effect = component_context.r;
  var parent = active_effect;
  effect(() => {
    var old_parts;
    var parts;
    render_effect(() => {
      old_parts = parts;
      parts = get_parts?.() || [];
      untrack(() => {
        if (!is_bound_this(get_value(...parts), element_or_component)) {
          update2(element_or_component, ...parts);
          if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
            update2(null, ...old_parts);
          }
        }
      });
    });
    return () => {
      let p = parent;
      while (p !== component_effect && p.parent !== null && p.parent.f & DESTROYING) {
        p = p.parent;
      }
      const teardown2 = () => {
        if (parts && is_bound_this(get_value(...parts), element_or_component)) {
          update2(null, ...parts);
        }
      };
      const original_teardown = p.teardown;
      p.teardown = () => {
        teardown2();
        original_teardown?.();
      };
    };
  });
  return element_or_component;
}
// node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function init(immutable = false) {
  const context = component_context;
  const callbacks = context.l.u;
  if (!callbacks)
    return;
  let props = () => deep_read_state(context.s);
  if (immutable) {
    let version = 0;
    let prev = {};
    const d = derived(() => {
      let changed = false;
      const props2 = context.s;
      for (const key in props2) {
        if (props2[key] !== prev[key]) {
          prev[key] = props2[key];
          changed = true;
        }
      }
      if (changed)
        version++;
      return version;
    });
    props = () => get2(d);
  }
  if (callbacks.b.length) {
    user_pre_effect(() => {
      observe_all(context, props);
      run_all(callbacks.b);
    });
  }
  user_effect(() => {
    const fns = untrack(() => callbacks.m.map(run));
    return () => {
      for (const fn of fns) {
        if (typeof fn === "function") {
          fn();
        }
      }
    };
  });
  if (callbacks.a.length) {
    user_effect(() => {
      observe_all(context, props);
      run_all(callbacks.a);
    });
  }
}
function observe_all(context, props) {
  if (context.l.s) {
    for (const signal of context.l.s)
      get2(signal);
  }
  props();
}
// node_modules/svelte/src/internal/client/reactivity/props.js
var rest_props_handler = {
  get(target, key) {
    if (target.exclude.has(key))
      return;
    return target.props[key];
  },
  set(target, key) {
    if (true_default) {
      props_rest_readonly(`${target.name}.${String(key)}`);
    }
    return false;
  },
  getOwnPropertyDescriptor(target, key) {
    if (target.exclude.has(key))
      return;
    if (key in target.props) {
      return {
        enumerable: true,
        configurable: true,
        value: target.props[key]
      };
    }
  },
  has(target, key) {
    if (target.exclude.has(key))
      return false;
    return key in target.props;
  },
  ownKeys(target) {
    return Reflect.ownKeys(target.props).filter((key) => !target.exclude.has(key));
  }
};
function rest_props(props, exclude, name) {
  return new Proxy(true_default ? { props, exclude, name } : { props, exclude }, rest_props_handler);
}
var spread_props_handler = {
  get(target, key) {
    let i = target.props.length;
    while (i--) {
      let p = target.props[i];
      if (is_function(p))
        p = p();
      if (typeof p === "object" && p !== null && key in p)
        return p[key];
    }
  },
  set(target, key, value) {
    let i = target.props.length;
    while (i--) {
      let p = target.props[i];
      if (is_function(p))
        p = p();
      const desc = get_descriptor(p, key);
      if (desc && desc.set) {
        desc.set(value);
        return true;
      }
    }
    return false;
  },
  getOwnPropertyDescriptor(target, key) {
    let i = target.props.length;
    while (i--) {
      let p = target.props[i];
      if (is_function(p))
        p = p();
      if (typeof p === "object" && p !== null && key in p) {
        const descriptor = get_descriptor(p, key);
        if (descriptor && !descriptor.configurable) {
          descriptor.configurable = true;
        }
        return descriptor;
      }
    }
  },
  has(target, key) {
    if (key === STATE_SYMBOL || key === LEGACY_PROPS)
      return false;
    for (let p of target.props) {
      if (is_function(p))
        p = p();
      if (p != null && key in p)
        return true;
    }
    return false;
  },
  ownKeys(target) {
    const keys = [];
    for (let p of target.props) {
      if (is_function(p))
        p = p();
      if (!p)
        continue;
      for (const key in p) {
        if (!keys.includes(key))
          keys.push(key);
      }
      for (const key of Object.getOwnPropertySymbols(p)) {
        if (!keys.includes(key))
          keys.push(key);
      }
    }
    return keys;
  }
};
function spread_props(...props) {
  return new Proxy({ props }, spread_props_handler);
}
function prop(props, key, flags2, fallback) {
  var runes = !legacy_mode_flag || (flags2 & PROPS_IS_RUNES) !== 0;
  var bindable = (flags2 & PROPS_IS_BINDABLE) !== 0;
  var lazy = (flags2 & PROPS_IS_LAZY_INITIAL) !== 0;
  var fallback_value = fallback;
  var fallback_dirty = true;
  var fallback_signal = undefined;
  var get_fallback = () => {
    if (lazy && runes) {
      fallback_signal ??= derived(fallback);
      return get2(fallback_signal);
    }
    if (fallback_dirty) {
      fallback_dirty = false;
      fallback_value = lazy ? untrack(fallback) : fallback;
    }
    return fallback_value;
  };
  let setter;
  if (bindable) {
    var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
    setter = get_descriptor(props, key)?.set ?? (is_entry_props && key in props ? (v) => props[key] = v : undefined);
  }
  var initial_value;
  var is_store_sub = false;
  if (bindable) {
    [initial_value, is_store_sub] = capture_store_binding(() => props[key]);
  } else {
    initial_value = props[key];
  }
  if (initial_value === undefined && fallback !== undefined) {
    initial_value = get_fallback();
    if (setter) {
      if (runes)
        props_invalid_value(key);
      setter(initial_value);
    }
  }
  var getter;
  if (runes) {
    getter = () => {
      var value = props[key];
      if (value === undefined)
        return get_fallback();
      fallback_dirty = true;
      return value;
    };
  } else {
    getter = () => {
      var value = props[key];
      if (value !== undefined) {
        fallback_value = undefined;
      }
      return value === undefined ? fallback_value : value;
    };
  }
  if (runes && (flags2 & PROPS_IS_UPDATED) === 0) {
    return getter;
  }
  if (setter) {
    var legacy_parent = props.$$legacy;
    return function(value, mutation) {
      if (arguments.length > 0) {
        if (!runes || !mutation || legacy_parent || is_store_sub) {
          setter(mutation ? getter() : value);
        }
        return value;
      }
      return getter();
    };
  }
  var overridden = false;
  var d = ((flags2 & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
    overridden = false;
    return getter();
  });
  if (true_default) {
    d.label = key;
  }
  if (bindable)
    get2(d);
  var parent_effect = active_effect;
  return function(value, mutation) {
    if (arguments.length > 0) {
      const new_value = mutation ? get2(d) : runes && bindable ? proxy(value) : value;
      set(d, new_value);
      overridden = true;
      if (fallback_value !== undefined) {
        fallback_value = new_value;
      }
      return value;
    }
    if (is_destroying_effect && overridden || (parent_effect.f & DESTROYED) !== 0) {
      return d.v;
    }
    return get2(d);
  };
}
// node_modules/svelte/src/legacy/legacy-client.js
function createClassComponent(options) {
  return new Svelte4Component(options);
}
class Svelte4Component {
  #events;
  #instance;
  constructor(options) {
    var sources = new Map;
    var add_source = (key, value) => {
      var s = mutable_source(value, false, false);
      sources.set(key, s);
      return s;
    };
    const props = new Proxy({ ...options.props || {}, $$events: {} }, {
      get(target, prop2) {
        return get2(sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)));
      },
      has(target, prop2) {
        if (prop2 === LEGACY_PROPS)
          return true;
        get2(sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)));
        return Reflect.has(target, prop2);
      },
      set(target, prop2, value) {
        set(sources.get(prop2) ?? add_source(prop2, value), value);
        return Reflect.set(target, prop2, value);
      }
    });
    this.#instance = (options.hydrate ? hydrate : mount)(options.component, {
      target: options.target,
      anchor: options.anchor,
      props,
      context: options.context,
      intro: options.intro ?? false,
      recover: options.recover,
      transformError: options.transformError
    });
    if (!async_mode_flag && (!options?.props?.$$host || options.sync === false)) {
      flushSync();
    }
    this.#events = props.$$events;
    for (const key of Object.keys(this.#instance)) {
      if (key === "$set" || key === "$destroy" || key === "$on")
        continue;
      define_property(this, key, {
        get() {
          return this.#instance[key];
        },
        set(value) {
          this.#instance[key] = value;
        },
        enumerable: true
      });
    }
    this.#instance.$set = (next2) => {
      Object.assign(props, next2);
    };
    this.#instance.$destroy = () => {
      unmount(this.#instance);
    };
  }
  $set(props) {
    this.#instance.$set(props);
  }
  $on(event2, callback) {
    this.#events[event2] = this.#events[event2] || [];
    const cb = (...args) => callback.call(this, ...args);
    this.#events[event2].push(cb);
    return () => {
      this.#events[event2] = this.#events[event2].filter((fn) => fn !== cb);
    };
  }
  $destroy() {
    this.#instance.$destroy();
  }
}

// node_modules/svelte/src/internal/client/dom/elements/custom-element.js
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    $$ctor;
    $$s;
    $$c;
    $$cn = false;
    $$d = {};
    $$r = false;
    $$p_d = {};
    $$l = {};
    $$l_u = new Map;
    $$me;
    $$shadowRoot = null;
    constructor($$componentCtor, $$slots, shadow_root_init) {
      super();
      this.$$ctor = $$componentCtor;
      this.$$s = $$slots;
      if (shadow_root_init) {
        this.$$shadowRoot = this.attachShadow(shadow_root_init);
      }
    }
    addEventListener(type, listener, options) {
      this.$$l[type] = this.$$l[type] || [];
      this.$$l[type].push(listener);
      if (this.$$c) {
        const unsub = this.$$c.$on(type, listener);
        this.$$l_u.set(listener, unsub);
      }
      super.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
      super.removeEventListener(type, listener, options);
      if (this.$$c) {
        const unsub = this.$$l_u.get(listener);
        if (unsub) {
          unsub();
          this.$$l_u.delete(listener);
        }
      }
    }
    async connectedCallback() {
      this.$$cn = true;
      if (!this.$$c) {
        let create_slot = function(name) {
          return (anchor) => {
            const slot = create_element("slot");
            if (name !== "default")
              slot.name = name;
            append(anchor, slot);
          };
        };
        await Promise.resolve();
        if (!this.$$cn || this.$$c) {
          return;
        }
        const $$slots = {};
        const existing_slots = get_custom_elements_slots(this);
        for (const name of this.$$s) {
          if (name in existing_slots) {
            if (name === "default" && !this.$$d.children) {
              this.$$d.children = create_slot(name);
              $$slots.default = true;
            } else {
              $$slots[name] = create_slot(name);
            }
          }
        }
        for (const attribute of this.attributes) {
          const name = this.$$g_p(attribute.name);
          if (!(name in this.$$d)) {
            this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
          }
        }
        for (const key in this.$$p_d) {
          if (!(key in this.$$d) && this[key] !== undefined) {
            this.$$d[key] = this[key];
            delete this[key];
          }
        }
        this.$$c = createClassComponent({
          component: this.$$ctor,
          target: this.$$shadowRoot || this,
          props: {
            ...this.$$d,
            $$slots,
            $$host: this
          }
        });
        this.$$me = effect_root(() => {
          render_effect(() => {
            this.$$r = true;
            for (const key of object_keys(this.$$c)) {
              if (!this.$$p_d[key]?.reflect)
                continue;
              this.$$d[key] = this.$$c[key];
              const attribute_value = get_custom_element_value(key, this.$$d[key], this.$$p_d, "toAttribute");
              if (attribute_value == null) {
                this.removeAttribute(this.$$p_d[key].attribute || key);
              } else {
                this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
              }
            }
            this.$$r = false;
          });
        });
        for (const type in this.$$l) {
          for (const listener of this.$$l[type]) {
            const unsub = this.$$c.$on(type, listener);
            this.$$l_u.set(listener, unsub);
          }
        }
        this.$$l = {};
      }
    }
    attributeChangedCallback(attr, _oldValue, newValue) {
      if (this.$$r)
        return;
      attr = this.$$g_p(attr);
      this.$$d[attr] = get_custom_element_value(attr, newValue, this.$$p_d, "toProp");
      this.$$c?.$set({ [attr]: this.$$d[attr] });
    }
    disconnectedCallback() {
      this.$$cn = false;
      Promise.resolve().then(() => {
        if (!this.$$cn && this.$$c) {
          this.$$c.$destroy();
          this.$$me();
          this.$$c = undefined;
        }
      });
    }
    $$g_p(attribute_name) {
      return object_keys(this.$$p_d).find((key) => this.$$p_d[key].attribute === attribute_name || !this.$$p_d[key].attribute && key.toLowerCase() === attribute_name) || attribute_name;
    }
  };
}
function get_custom_element_value(prop2, value, props_definition, transform) {
  const type = props_definition[prop2]?.type;
  value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
  if (!transform || !props_definition[prop2]) {
    return value;
  } else if (transform === "toAttribute") {
    switch (type) {
      case "Object":
      case "Array":
        return value == null ? null : JSON.stringify(value);
      case "Boolean":
        return value ? "" : null;
      case "Number":
        return value == null ? null : value;
      default:
        return value;
    }
  } else {
    switch (type) {
      case "Object":
      case "Array":
        return value && JSON.parse(value);
      case "Boolean":
        return value;
      case "Number":
        return value != null ? +value : value;
      default:
        return value;
    }
  }
}
function get_custom_elements_slots(element2) {
  const result = {};
  element2.childNodes.forEach((node) => {
    result[node.slot || "default"] = true;
  });
  return result;
}
// node_modules/svelte/src/index-client.js
if (true_default) {
  let throw_rune_error = function(rune) {
    if (!(rune in globalThis)) {
      let value;
      Object.defineProperty(globalThis, rune, {
        configurable: true,
        get: () => {
          if (value !== undefined) {
            return value;
          }
          rune_outside_svelte(rune);
        },
        set: (v) => {
          value = v;
        }
      });
    }
  };
  throw_rune_error("$state");
  throw_rune_error("$effect");
  throw_rune_error("$derived");
  throw_rune_error("$inspect");
  throw_rune_error("$props");
  throw_rune_error("$bindable");
}
function onMount(fn) {
  if (component_context === null) {
    lifecycle_outside_component("onMount");
  }
  if (legacy_mode_flag && component_context.l !== null) {
    init_update_callbacks(component_context).m.push(fn);
  } else {
    user_effect(() => {
      const cleanup = untrack(fn);
      if (typeof cleanup === "function")
        return cleanup;
    });
  }
}
function init_update_callbacks(context) {
  var l = context.l;
  return l.u ??= { a: [], b: [], m: [] };
}

// node_modules/svelte/src/version.js
var PUBLIC_VERSION = "5";

// node_modules/svelte/src/internal/disclose-version.js
if (typeof window !== "undefined") {
  ((window.__svelte ??= {}).v ??= new Set).add(PUBLIC_VERSION);
}

// node_modules/@lucide/svelte/dist/defaultAttributes.js
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
var defaultAttributes_default = defaultAttributes;

// node_modules/@lucide/svelte/dist/utils/hasA11yProp.js
var hasA11yProp = (props) => {
  for (const prop2 in props) {
    if (prop2.startsWith("aria-") || prop2 === "role" || prop2 === "title") {
      return true;
    }
  }
  return false;
};

// node_modules/@lucide/svelte/dist/context.js
var LucideContext = Symbol("lucide-context");
var getLucideContext = () => getContext(LucideContext);

// node_modules/@lucide/svelte/dist/Icon.svelte
var rest_excludes = new Set([
  "$$slots",
  "$$events",
  "$$legacy",
  "name",
  "color",
  "size",
  "strokeWidth",
  "absoluteStrokeWidth",
  "iconNode",
  "children"
]);
var root = from_svg(`
    <!>
  `, 1);
var root_1 = from_svg(`

<svg>
  <!>
  <!>
</svg>`, 1);
function Icon($$anchor, $$props) {
  push($$props, true);
  const globalProps = getLucideContext() ?? {};
  const color = prop($$props, "color", 19, () => globalProps.color ?? "currentColor"), size = prop($$props, "size", 19, () => globalProps.size ?? 24), strokeWidth = prop($$props, "strokeWidth", 19, () => globalProps.strokeWidth ?? 2), absoluteStrokeWidth = prop($$props, "absoluteStrokeWidth", 19, () => globalProps.absoluteStrokeWidth ?? false), iconNode = prop($$props, "iconNode", 19, () => []), props = rest_props($$props, rest_excludes);
  const calculatedStrokeWidth = user_derived(() => absoluteStrokeWidth() ? Number(strokeWidth()) * 24 / Number(size()) : strokeWidth());
  next();
  var fragment = root_1();
  var svg = sibling(first_child(fragment));
  attribute_effect(svg, ($0) => ({
    ...defaultAttributes_default,
    ...$0,
    ...props,
    width: size(),
    height: size(),
    stroke: color(),
    "stroke-width": get2(calculatedStrokeWidth),
    class: [
      "lucide-icon lucide",
      globalProps.class,
      $$props.name && `lucide-${$$props.name}`,
      $$props.class
    ]
  }), [
    () => !$$props.children && !hasA11yProp(props) && { "aria-hidden": "true" }
  ]);
  var node = sibling(child(svg));
  each(node, 17, iconNode, index, ($$anchor2, $$item) => {
    var $$array = user_derived(() => to_array(get2($$item), 2));
    let tag2 = () => get2($$array)[0];
    let attrs = () => get2($$array)[1];
    next();
    var fragment_1 = root();
    var node_1 = sibling(first_child(fragment_1));
    element(node_1, tag2, true, ($$element, $$anchor3) => {
      attribute_effect($$element, () => ({ ...attrs() }));
    });
    next();
    append($$anchor2, fragment_1);
  });
  var node_2 = sibling(node, 2);
  snippet(node_2, () => $$props.children ?? noop);
  next();
  reset(svg);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var Icon_default = Icon;

// node_modules/@lucide/svelte/dist/icons/download.svelte
var rest_excludes2 = new Set(["$$slots", "$$events", "$$legacy"]);
var root2 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTVWMyIgLz4KICA8cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCIgLz4KICA8cGF0aCBkPSJtNyAxMCA1IDUgNS01IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/download
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Download($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes2);
  const iconNode = [
    ["path", { d: "M12 15V3" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["path", { d: "m7 10 5 5 5-5" }]
  ];
  var fragment = root2();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "download" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var download_default = Download;
// node_modules/@lucide/svelte/dist/icons/log-out.svelte
var rest_excludes3 = new Set(["$$slots", "$$events", "$$legacy"]);
var root3 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTcgNS01LTUtNSIgLz4KICA8cGF0aCBkPSJNMjEgMTJIOSIgLz4KICA8cGF0aCBkPSJNOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/log-out
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Log_out($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes3);
  const iconNode = [
    ["path", { d: "m16 17 5-5-5-5" }],
    ["path", { d: "M21 12H9" }],
    ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]
  ];
  var fragment = root3();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "log-out" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var log_out_default = Log_out;
// node_modules/@lucide/svelte/dist/icons/newspaper.svelte
var rest_excludes4 = new Set(["$$slots", "$$events", "$$legacy"]);
var root4 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMThoLTUiIC8+CiAgPHBhdGggZD0iTTE4IDE0aC04IiAvPgogIDxwYXRoIGQ9Ik00IDIyaDE2YTIgMiAwIDAgMCAyLTJWNGEyIDIgMCAwIDAtMi0ySDhhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDEtNCAwdi05YTIgMiAwIDAgMSAyLTJoMiIgLz4KICA8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI0IiB4PSIxMCIgeT0iNiIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/newspaper
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Newspaper($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes4);
  const iconNode = [
    ["path", { d: "M15 18h-5" }],
    ["path", { d: "M18 14h-8" }],
    [
      "path",
      {
        d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"
      }
    ],
    [
      "rect",
      { width: "8", height: "4", x: "10", y: "6", rx: "1" }
    ]
  ];
  var fragment = root4();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "newspaper" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var newspaper_default = Newspaper;
// node_modules/@lucide/svelte/dist/icons/panel-left-close.svelte
var rest_excludes5 = new Set(["$$slots", "$$events", "$$legacy"]);
var root5 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik05IDN2MTgiIC8+CiAgPHBhdGggZD0ibTE2IDE1LTMtMyAzLTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/panel-left-close
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Panel_left_close($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes5);
  const iconNode = [
    [
      "rect",
      { width: "18", height: "18", x: "3", y: "3", rx: "2" }
    ],
    ["path", { d: "M9 3v18" }],
    ["path", { d: "m16 15-3-3 3-3" }]
  ];
  var fragment = root5();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "panel-left-close" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var panel_left_close_default = Panel_left_close;
// node_modules/@lucide/svelte/dist/icons/panel-left-open.svelte
var rest_excludes6 = new Set(["$$slots", "$$events", "$$legacy"]);
var root6 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik05IDN2MTgiIC8+CiAgPHBhdGggZD0ibTE0IDkgMyAzLTMgMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/panel-left-open
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Panel_left_open($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes6);
  const iconNode = [
    [
      "rect",
      { width: "18", height: "18", x: "3", y: "3", rx: "2" }
    ],
    ["path", { d: "M9 3v18" }],
    ["path", { d: "m14 9 3 3-3 3" }]
  ];
  var fragment = root6();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "panel-left-open" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var panel_left_open_default = Panel_left_open;
// node_modules/@lucide/svelte/dist/icons/rss.svelte
var rest_excludes7 = new Set(["$$slots", "$$events", "$$legacy"]);
var root7 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxMWE5IDkgMCAwIDEgOSA5IiAvPgogIDxwYXRoIGQ9Ik00IDRhMTYgMTYgMCAwIDEgMTYgMTYiIC8+CiAgPGNpcmNsZSBjeD0iNSIgY3k9IjE5IiByPSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/rss
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Rss($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes7);
  const iconNode = [
    ["path", { d: "M4 11a9 9 0 0 1 9 9" }],
    ["path", { d: "M4 4a16 16 0 0 1 16 16" }],
    ["circle", { cx: "5", cy: "19", r: "1" }]
  ];
  var fragment = root7();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "rss" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var rss_default = Rss;
// web/src/lib/router.ts
var scrollByRoute = new Map;
var route = writable("/");
var SUBPAGE_PATH_SUFFIXES = [
  "/feeds/",
  "/settings/",
  "/filter/",
  "/filters/",
  "/translate/",
  "/export/",
  "/fever/"
];
function isSubPagePath(path) {
  return SUBPAGE_PATH_SUFFIXES.some((suffix) => path.endsWith(suffix));
}
function pathnameToRoute(pathname) {
  if (pathname.endsWith("/feeds"))
    return "/feeds";
  if (pathname.endsWith("/export"))
    return "/export";
  if (pathname.endsWith("/settings") || pathname.endsWith("/filter") || pathname.endsWith("/filters") || pathname.endsWith("/translate") || pathname.endsWith("/fever")) {
    return "/settings";
  }
  return "/";
}
function routeToRelativeHref(next2) {
  if (next2 === "/feeds")
    return "feeds";
  if (next2 === "/settings")
    return "settings";
  if (next2 === "/export")
    return "export";
  if (isSubPagePath(window.location.pathname)) {
    return "..";
  }
  return "./";
}
function homeHref() {
  if (isSubPagePath(window.location.pathname)) {
    return "..";
  }
  return "./";
}
function feedsHref() {
  return "feeds";
}
function exportHref() {
  return "export";
}
function settingsHref() {
  return "settings";
}
function settingsTabFromLocation() {
  const path = window.location.pathname;
  if (path.endsWith("/translate"))
    return "translate";
  if (path.endsWith("/fever"))
    return "fever";
  const hash2 = window.location.hash.replace(/^#/, "");
  if (hash2 === "preferences" || hash2 === "translate" || hash2 === "fever" || hash2 === "filter") {
    return hash2;
  }
  return "preferences";
}
function setSettingsTab(tab) {
  const url = new URL(window.location.href);
  url.hash = tab;
  if (url.pathname.endsWith("/filter") || url.pathname.endsWith("/filters") || url.pathname.endsWith("/translate") || url.pathname.endsWith("/fever")) {
    const settings = new URL(settingsHref(), window.location.href);
    url.pathname = settings.pathname;
  }
  history.replaceState(null, "", url.pathname + url.search + url.hash);
}
function saveScroll(current) {
  scrollByRoute.set(current, window.scrollY);
}
function restoreScroll(next2) {
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollByRoute.get(next2) ?? 0);
  });
}
function syncRouteFromLocation() {
  route.set(pathnameToRoute(window.location.pathname));
}
function navigate(next2) {
  const current = get(route);
  if (current === next2)
    return;
  const href = routeToRelativeHref(next2);
  const target = new URL(href, window.location.href);
  if (window.location.pathname === target.pathname)
    return;
  saveScroll(current);
  history.pushState(null, "", href + window.location.search);
  route.set(next2);
  restoreScroll(next2);
}
function initRouter() {
  syncRouteFromLocation();
  window.addEventListener("popstate", () => {
    syncRouteFromLocation();
    restoreScroll(get(route));
  });
}
function shouldHandleNavClick(event2) {
  if (event2.defaultPrevented || event2.button !== 0 || event2.metaKey || event2.ctrlKey || event2.shiftKey || event2.altKey) {
    return false;
  }
  return true;
}
function navClick(next2) {
  return (event2) => {
    if (!shouldHandleNavClick(event2))
      return;
    event2.preventDefault();
    navigate(next2);
  };
}

// node_modules/@lucide/svelte/dist/icons/settings.svelte
var rest_excludes8 = new Set(["$$slots", "$$events", "$$legacy"]);
var root8 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOS42NzEgNC4xMzZhMi4zNCAyLjM0IDAgMCAxIDQuNjU5IDAgMi4zNCAyLjM0IDAgMCAwIDMuMzE5IDEuOTE1IDIuMzQgMi4zNCAwIDAgMSAyLjMzIDQuMDMzIDIuMzQgMi4zNCAwIDAgMCAwIDMuODMxIDIuMzQgMi4zNCAwIDAgMS0yLjMzIDQuMDMzIDIuMzQgMi4zNCAwIDAgMC0zLjMxOSAxLjkxNSAyLjM0IDIuMzQgMCAwIDEtNC42NTkgMCAyLjM0IDIuMzQgMCAwIDAtMy4zMi0xLjkxNSAyLjM0IDIuMzQgMCAwIDEtMi4zMy00LjAzMyAyLjM0IDIuMzQgMCAwIDAgMC0zLjgzMUEyLjM0IDIuMzQgMCAwIDEgNi4zNSA2LjA1MWEyLjM0IDIuMzQgMCAwIDAgMy4zMTktMS45MTUiIC8+CiAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/settings
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Settings($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes8);
  const iconNode = [
    [
      "path",
      {
        d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3" }]
  ];
  var fragment = root8();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "settings" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var settings_default = Settings;
// shared/locale.ts
var LOCALES = ["en", "zh-Hans", "zh-Hant"];
var DEFAULT_LOCALE = "zh-Hans";
function parseLocale(value) {
  if (value === "en" || value === "zh-Hans" || value === "zh-Hant")
    return value;
  if (value === "zh")
    return "zh-Hans";
  return null;
}
function localeFromNavigator(language) {
  if (!language)
    return DEFAULT_LOCALE;
  const lang = language.toLowerCase();
  if (lang.startsWith("en"))
    return "en";
  if (lang.startsWith("zh")) {
    if (lang.includes("hant") || lang.includes("-tw") || lang.includes("-hk") || lang.includes("-mo")) {
      return "zh-Hant";
    }
    return "zh-Hans";
  }
  return DEFAULT_LOCALE;
}
function htmlLang(locale) {
  if (locale === "en")
    return "en";
  if (locale === "zh-Hant")
    return "zh-TW";
  return "zh-CN";
}
function dateLocaleTag(locale) {
  if (locale === "en")
    return "en-US";
  if (locale === "zh-Hant")
    return "zh-TW";
  return "zh-CN";
}
function nextLocale(locale) {
  const index2 = LOCALES.indexOf(locale);
  return LOCALES[(index2 + 1) % LOCALES.length] ?? DEFAULT_LOCALE;
}

// shared/manifest.ts
var PWA_META_DESCRIPTION = {
  "zh-Hans": "面向 AI Agent 的新闻服务",
  "zh-Hant": "面向 AI Agent 的新聞服務",
  en: "News Service for AI Agents"
};
function manifestHref(locale) {
  return `/manifest.webmanifest?locale=${locale}`;
}

// web/src/lib/i18n/messages.ts
var messages = {
  "zh-Hans": {
    "items.latest": "最新资讯",
    "items.feeds": "Feed 管理",
    "items.settings": "设置",
    "items.preferences": "Preferences",
    "items.filter": "Filter",
    "items.translate": "Translate",
    "items.fever": "Fever",
    "items.export": "导出",
    "items.noItems": "暂无资讯",
    "items.loading": "加载中…",
    "items.noMore": "没有更多了",
    "items.loadFailed": "加载失败",
    "items.markAllRead": "全部已读",
    "items.blockSource": "屏蔽此来源并删除已有新闻",
    "items.blockSourceFailed": "屏蔽来源失败",
    "items.filterBy": "筛选",
    "items.filterUnread": "未读",
    "items.filterAll": "全部",
    "items.switchToAll": "切换到全部",
    "items.switchToUnread": "切换到未读",
    "feeds.name": "名称",
    "feeds.descriptionOptional": "描述（可选）",
    "feeds.addFeed": "添加 Feed",
    "feeds.keyword": "添加关键词新闻",
    "feeds.keywordTitle": "按关键词添加",
    "feeds.keywordPlaceholder": "输入搜索关键词",
    "feeds.keywordConfirm": "确定",
    "feeds.keywordEmpty": "请输入关键词",
    "feeds.wechat": "添加公众号",
    "feeds.wechatTitle": "搜索公众号",
    "feeds.wechatPlaceholder": "输入公众号名称或关键词",
    "feeds.wechatSearch": "搜索",
    "feeds.wechatSearching": "搜索中…",
    "feeds.wechatEmpty": "请输入关键词",
    "feeds.wechatNoResults": "未找到相关公众号",
    "feeds.wechatSubscribed": "已添加",
    "feeds.wechatNotSubscribed": "未添加",
    "feeds.wechatResolveFailed": "无法添加该公众号",
    "feeds.wechatResolving": "正在获取 RSS 链接…",
    "feeds.save": "保存",
    "feeds.cancel": "取消",
    "feeds.parsing": "正在从 Feed 解析名称与摘要…",
    "feeds.feedList": "Feed 列表",
    "feeds.sortBy": "排序",
    "feeds.sortDefault": "默认",
    "feeds.sortByPublished": "最后发布",
    "feeds.loading": "加载中…",
    "feeds.noFeeds": "暂无 Feeds",
    "feeds.noMore": "没有更多了",
    "feeds.lastPublished": "最后发布",
    "feeds.noPublished": "暂无发布",
    "feeds.edit": "编辑",
    "feeds.delete": "删除",
    "feeds.confirmDelete": "确定删除该 Feed？",
    "feeds.loadFailed": "加载失败",
    "feeds.parseFailed": "解析失败",
    "feeds.saveFailed": "保存失败",
    "feeds.deleteFailed": "删除失败",
    "feeds.exportOpml": "导出 OPML",
    "feeds.exportingOpml": "导出中…",
    "feeds.exportOpmlFailed": "导出失败",
    "filters.hint": "设置大模型过滤提示词。关闭过滤后提示词会保留，新抓取的资讯默认通过。",
    "filters.enabled": "AI 过滤",
    "filters.keywords": "过滤关键词",
    "filters.keywordsPlaceholder": "多个关键词用逗号分隔",
    "filters.sources": "过滤来源",
    "filters.sourcesPlaceholder": "输入域名后按 Enter",
    "filters.removeSource": "移除来源",
    "filters.on": "开启",
    "filters.off": "关闭",
    "filters.prompt": "AI 过滤提示词",
    "filters.save": "保存",
    "filters.saving": "保存中…",
    "filters.loadFailed": "加载失败",
    "filters.saveFailed": "保存失败",
    "filters.confirmClearPrompt": "提示词为空，保存会清空已有内容。确定继续？",
    "translate.hint": "设置翻译开关、目标语言与提示词。开启后仅翻译新抓取资讯的标题；关闭后提示词会保留。",
    "translate.enabled": "AI 翻译",
    "translate.on": "开启",
    "translate.off": "关闭",
    "translate.targetLang": "目标语言",
    "translate.langEn": "英语",
    "translate.langZhHans": "简体中文",
    "translate.langZhHant": "繁体中文",
    "translate.prompt": "翻译提示词",
    "translate.save": "保存",
    "translate.saving": "保存中…",
    "translate.loadFailed": "加载失败",
    "translate.saveFailed": "保存失败",
    "export.hint": "选择起始与截止时间，将范围内的文章导出为 Excel 文件。",
    "export.startTime": "起始时间",
    "export.endTime": "截止时间",
    "export.button": "导出 Excel",
    "export.exporting": "导出中…",
    "export.failed": "导出失败",
    "export.invalidRange": "起始时间不能晚于截止时间",
    "fever.hint": "开启后可用 Fever API 给 Reeder 等阅读器同步资讯。关闭服务后客户端将无法认证。",
    "fever.enabled": "Fever API",
    "fever.on": "开启",
    "fever.off": "关闭",
    "fever.user": "User",
    "fever.password": "Password",
    "fever.passwordKeep": "留空则保留原密码",
    "fever.endpoint": "API 地址",
    "fever.save": "保存",
    "fever.saving": "保存中…",
    "fever.loadFailed": "加载失败",
    "fever.saveFailed": "保存失败",
    "fever.userRequired": "开启 Fever API 时需要填写 User",
    "fever.passwordRequired": "开启 Fever API 时需要设置 Password",
    "fever.passwordWeak": "密码至少 8 位，且需同时包含字母、数字和符号",
    "auth.hint": "此服务已对公网开放，请输入管理员密码后继续。",
    "auth.password": "管理员密码",
    "auth.submit": "进入",
    "auth.submitting": "验证中…",
    "auth.failed": "验证失败",
    "auth.invalid": "密码不正确",
    "auth.tooMany": "尝试次数过多，请稍后再试",
    "auth.logout": "退出",
    "theme.switchToLight": "切换到浅色模式",
    "theme.switchToDark": "切换到深色模式",
    "theme.lightMode": "浅色模式",
    "theme.darkMode": "深色模式",
    "sidebar.collapse": "收起导航",
    "sidebar.expand": "展开导航",
    "font.switchToSmall": "切换到小字体",
    "font.switchToMedium": "切换到中等字体",
    "font.switchToLarge": "切换到大字体",
    "font.small": "小字体",
    "font.medium": "中等字体",
    "font.large": "大字体",
    "lang.switchToEn": "切换到英语",
    "lang.switchToZhHans": "切换到简体中文",
    "lang.switchToZhHant": "切换到繁体中文",
    "lang.en": "英语",
    "lang.zhHans": "简体中文",
    "lang.zhHant": "繁体中文",
    "prefs.hint": "调整阅读字号、界面语言与显示主题。",
    "prefs.fontSize": "字体大小",
    "prefs.language": "界面语言",
    "prefs.theme": "显示主题",
    "meta.description": PWA_META_DESCRIPTION["zh-Hans"],
    "time.justNow": "刚刚",
    "time.minutesAgo": "{n} 分钟前",
    "time.hoursAgo": "{n} 小时前",
    "time.daysAgo": "{n} 天前"
  },
  "zh-Hant": {
    "items.latest": "最新資訊",
    "items.feeds": "Feed 管理",
    "items.settings": "設定",
    "items.preferences": "Preferences",
    "items.filter": "Filter",
    "items.translate": "Translate",
    "items.fever": "Fever",
    "items.export": "匯出",
    "items.noItems": "暫無資訊",
    "items.loading": "載入中…",
    "items.noMore": "沒有更多了",
    "items.loadFailed": "載入失敗",
    "items.markAllRead": "全部已讀",
    "items.blockSource": "封鎖此來源並刪除既有新聞",
    "items.blockSourceFailed": "封鎖來源失敗",
    "items.filterBy": "篩選",
    "items.filterUnread": "未讀",
    "items.filterAll": "全部",
    "items.switchToAll": "切換到全部",
    "items.switchToUnread": "切換到未讀",
    "feeds.name": "名稱",
    "feeds.descriptionOptional": "描述（可選）",
    "feeds.addFeed": "新增 Feed",
    "feeds.keyword": "新增關鍵詞新聞",
    "feeds.keywordTitle": "依關鍵詞新增",
    "feeds.keywordPlaceholder": "輸入搜尋關鍵詞",
    "feeds.keywordConfirm": "確定",
    "feeds.keywordEmpty": "請輸入關鍵詞",
    "feeds.wechat": "新增公眾號",
    "feeds.wechatTitle": "搜尋公眾號",
    "feeds.wechatPlaceholder": "輸入公眾號名稱或關鍵詞",
    "feeds.wechatSearch": "搜尋",
    "feeds.wechatSearching": "搜尋中…",
    "feeds.wechatEmpty": "請輸入關鍵詞",
    "feeds.wechatNoResults": "未找到相關公眾號",
    "feeds.wechatSubscribed": "已新增",
    "feeds.wechatNotSubscribed": "未新增",
    "feeds.wechatResolveFailed": "無法新增該公眾號",
    "feeds.wechatResolving": "正在取得 RSS 連結…",
    "feeds.save": "儲存",
    "feeds.cancel": "取消",
    "feeds.parsing": "正在從 Feed 解析名稱與摘要…",
    "feeds.feedList": "Feed 列表",
    "feeds.sortBy": "排序",
    "feeds.sortDefault": "預設",
    "feeds.sortByPublished": "最後發布",
    "feeds.loading": "載入中…",
    "feeds.noFeeds": "暫無 Feeds",
    "feeds.noMore": "沒有更多了",
    "feeds.lastPublished": "最後發布",
    "feeds.noPublished": "暫無發布",
    "feeds.edit": "編輯",
    "feeds.delete": "刪除",
    "feeds.confirmDelete": "確定刪除該 Feed？",
    "feeds.loadFailed": "載入失敗",
    "feeds.parseFailed": "解析失敗",
    "feeds.saveFailed": "儲存失敗",
    "feeds.deleteFailed": "刪除失敗",
    "feeds.exportOpml": "匯出 OPML",
    "feeds.exportingOpml": "匯出中…",
    "feeds.exportOpmlFailed": "匯出失敗",
    "filters.hint": "設定大模型過濾提示詞。關閉過濾後提示詞會保留，新擷取的資訊預設通過。",
    "filters.enabled": "AI 過濾",
    "filters.keywords": "過濾關鍵詞",
    "filters.keywordsPlaceholder": "多個關鍵詞請用逗號分隔",
    "filters.sources": "過濾來源",
    "filters.sourcesPlaceholder": "輸入網域後按 Enter",
    "filters.removeSource": "移除來源",
    "filters.on": "開啟",
    "filters.off": "關閉",
    "filters.prompt": "AI 過濾提示詞",
    "filters.save": "儲存",
    "filters.saving": "儲存中…",
    "filters.loadFailed": "載入失敗",
    "filters.saveFailed": "儲存失敗",
    "filters.confirmClearPrompt": "提示詞為空，儲存會清空既有內容。確定繼續？",
    "translate.hint": "設定翻譯開關、目標語言與提示詞。開啟後僅翻譯新擷取資訊的標題；關閉後提示詞會保留。",
    "translate.enabled": "AI 翻譯",
    "translate.on": "開啟",
    "translate.off": "關閉",
    "translate.targetLang": "目標語言",
    "translate.langEn": "英語",
    "translate.langZhHans": "簡體中文",
    "translate.langZhHant": "繁體中文",
    "translate.prompt": "翻譯提示詞",
    "translate.save": "儲存",
    "translate.saving": "儲存中…",
    "translate.loadFailed": "載入失敗",
    "translate.saveFailed": "儲存失敗",
    "export.hint": "選擇起始與截止時間，將範圍內的文章匯出為 Excel 檔案。",
    "export.startTime": "起始時間",
    "export.endTime": "截止時間",
    "export.button": "匯出 Excel",
    "export.exporting": "匯出中…",
    "export.failed": "匯出失敗",
    "export.invalidRange": "起始時間不能晚於截止時間",
    "fever.hint": "開啟後可用 Fever API 給 Reeder 等閱讀器同步資訊。關閉服務後用戶端將無法認證。",
    "fever.enabled": "Fever API",
    "fever.on": "開啟",
    "fever.off": "關閉",
    "fever.user": "User",
    "fever.password": "Password",
    "fever.passwordKeep": "留空則保留原密碼",
    "fever.endpoint": "API 位址",
    "fever.save": "儲存",
    "fever.saving": "儲存中…",
    "fever.loadFailed": "載入失敗",
    "fever.saveFailed": "儲存失敗",
    "fever.userRequired": "開啟 Fever API 時需要填寫 User",
    "fever.passwordRequired": "開啟 Fever API 時需要設定 Password",
    "fever.passwordWeak": "密碼至少 8 位，且需同時包含字母、數字和符號",
    "auth.hint": "此服務已對公網開放，請輸入管理員密碼後繼續。",
    "auth.password": "管理員密碼",
    "auth.submit": "進入",
    "auth.submitting": "驗證中…",
    "auth.failed": "驗證失敗",
    "auth.invalid": "密碼不正確",
    "auth.tooMany": "嘗試次數過多，請稍後再試",
    "auth.logout": "登出",
    "theme.switchToLight": "切換到淺色模式",
    "theme.switchToDark": "切換到深色模式",
    "theme.lightMode": "淺色模式",
    "theme.darkMode": "深色模式",
    "sidebar.collapse": "收起導覽",
    "sidebar.expand": "展開導覽",
    "font.switchToSmall": "切換到小字體",
    "font.switchToMedium": "切換到中等字體",
    "font.switchToLarge": "切換到大字體",
    "font.small": "小字體",
    "font.medium": "中等字體",
    "font.large": "大字體",
    "lang.switchToEn": "切換到英語",
    "lang.switchToZhHans": "切換到簡體中文",
    "lang.switchToZhHant": "切換到繁體中文",
    "lang.en": "英語",
    "lang.zhHans": "簡體中文",
    "lang.zhHant": "繁體中文",
    "prefs.hint": "調整閱讀字號、介面語言與顯示主題。",
    "prefs.fontSize": "字體大小",
    "prefs.language": "介面語言",
    "prefs.theme": "顯示主題",
    "meta.description": PWA_META_DESCRIPTION["zh-Hant"],
    "time.justNow": "剛剛",
    "time.minutesAgo": "{n} 分鐘前",
    "time.hoursAgo": "{n} 小時前",
    "time.daysAgo": "{n} 天前"
  },
  en: {
    "items.latest": "Latest",
    "items.feeds": "Feeds",
    "items.settings": "Settings",
    "items.preferences": "Preferences",
    "items.filter": "Filter",
    "items.translate": "Translate",
    "items.export": "Export",
    "items.fever": "Fever",
    "items.noItems": "No news yet",
    "items.loading": "Loading…",
    "items.noMore": "No more news",
    "items.loadFailed": "Failed to load",
    "items.markAllRead": "Mark all as read",
    "items.blockSource": "Block this source and delete existing news",
    "items.blockSourceFailed": "Failed to block source",
    "items.filterBy": "Filter",
    "items.filterUnread": "Unread",
    "items.filterAll": "All",
    "items.switchToAll": "Show all",
    "items.switchToUnread": "Unread only",
    "feeds.name": "Name",
    "feeds.descriptionOptional": "Description (optional)",
    "feeds.addFeed": "Add feed",
    "feeds.keyword": "Add keyword news",
    "feeds.keywordTitle": "Add by keyword",
    "feeds.keywordPlaceholder": "Enter a search keyword",
    "feeds.keywordConfirm": "Confirm",
    "feeds.keywordEmpty": "Please enter a keyword",
    "feeds.wechat": "Add WeChat account",
    "feeds.wechatTitle": "Search WeChat accounts",
    "feeds.wechatPlaceholder": "Enter account name or keyword",
    "feeds.wechatSearch": "Search",
    "feeds.wechatSearching": "Searching…",
    "feeds.wechatEmpty": "Please enter a keyword",
    "feeds.wechatNoResults": "No accounts found",
    "feeds.wechatSubscribed": "Added",
    "feeds.wechatNotSubscribed": "Not added",
    "feeds.wechatResolveFailed": "Unable to add this account",
    "feeds.wechatResolving": "Fetching RSS link…",
    "feeds.save": "Save",
    "feeds.cancel": "Cancel",
    "feeds.parsing": "Fetching title and summary from feed…",
    "feeds.feedList": "Feeds",
    "feeds.sortBy": "Sort",
    "feeds.sortDefault": "Default",
    "feeds.sortByPublished": "Last published",
    "feeds.loading": "Loading…",
    "feeds.noFeeds": "No feeds yet",
    "feeds.noMore": "No more feeds",
    "feeds.lastPublished": "Last published",
    "feeds.noPublished": "Never published",
    "feeds.edit": "Edit",
    "feeds.delete": "Delete",
    "feeds.confirmDelete": "Delete this feed?",
    "feeds.loadFailed": "Failed to load",
    "feeds.parseFailed": "Failed to parse feed",
    "feeds.saveFailed": "Failed to save",
    "feeds.deleteFailed": "Failed to delete",
    "feeds.exportOpml": "Export OPML",
    "feeds.exportingOpml": "Exporting…",
    "feeds.exportOpmlFailed": "Export failed",
    "filters.hint": "Set the AI filter prompt. Turning the filter off keeps the prompt; new items pass by default.",
    "filters.enabled": "AI filter",
    "filters.keywords": "Filter keywords",
    "filters.keywordsPlaceholder": "Separate multiple keywords with commas",
    "filters.sources": "Filter sources",
    "filters.sourcesPlaceholder": "Enter a domain and press Enter",
    "filters.removeSource": "Remove source",
    "filters.on": "On",
    "filters.off": "Off",
    "filters.prompt": "AI filter prompt",
    "filters.save": "Save",
    "filters.saving": "Saving…",
    "filters.loadFailed": "Failed to load",
    "filters.saveFailed": "Failed to save",
    "filters.confirmClearPrompt": "The prompt is empty. Saving will clear the existing prompt. Continue?",
    "translate.hint": "Set the translation switch, target language, and prompt. When on, only titles of newly fetched items are translated. Turning it off keeps the prompt.",
    "translate.enabled": "AI translation",
    "translate.on": "On",
    "translate.off": "Off",
    "translate.targetLang": "Target language",
    "translate.langEn": "English",
    "translate.langZhHans": "Simplified Chinese",
    "translate.langZhHant": "Traditional Chinese",
    "translate.prompt": "Translation prompt",
    "translate.save": "Save",
    "translate.saving": "Saving…",
    "translate.loadFailed": "Failed to load",
    "translate.saveFailed": "Failed to save",
    "export.hint": "Pick a start and end time, then export the matching articles to an Excel file.",
    "export.startTime": "Start time",
    "export.endTime": "End time",
    "export.button": "Export Excel",
    "export.exporting": "Exporting…",
    "export.failed": "Export failed",
    "export.invalidRange": "Start time cannot be later than end time",
    "fever.hint": "When enabled, RSS apps such as Reeder can sync via the Fever API. Turning it off rejects client authentication.",
    "fever.enabled": "Fever API",
    "fever.on": "On",
    "fever.off": "Off",
    "fever.user": "User",
    "fever.password": "Password",
    "fever.passwordKeep": "Leave blank to keep the current password",
    "fever.endpoint": "API URL",
    "fever.save": "Save",
    "fever.saving": "Saving…",
    "fever.loadFailed": "Failed to load",
    "fever.saveFailed": "Failed to save",
    "fever.userRequired": "User is required when Fever API is on",
    "fever.passwordRequired": "Password is required when Fever API is on",
    "fever.passwordWeak": "Password must be at least 8 characters and include letters, digits, and symbols",
    "auth.hint": "This instance is publicly reachable. Enter the admin password to continue.",
    "auth.password": "Admin password",
    "auth.submit": "Continue",
    "auth.submitting": "Checking…",
    "auth.failed": "Sign-in failed",
    "auth.invalid": "Incorrect password",
    "auth.tooMany": "Too many attempts. Try again later.",
    "auth.logout": "Sign out",
    "theme.switchToLight": "Switch to light mode",
    "theme.switchToDark": "Switch to dark mode",
    "theme.lightMode": "Light mode",
    "theme.darkMode": "Dark mode",
    "sidebar.collapse": "Collapse sidebar",
    "sidebar.expand": "Expand sidebar",
    "font.switchToSmall": "Switch to small text",
    "font.switchToMedium": "Switch to medium text",
    "font.switchToLarge": "Switch to large text",
    "font.small": "Small text",
    "font.medium": "Medium text",
    "font.large": "Large text",
    "lang.switchToEn": "Switch to English",
    "lang.switchToZhHans": "Switch to Simplified Chinese",
    "lang.switchToZhHant": "Switch to Traditional Chinese",
    "lang.en": "English",
    "lang.zhHans": "Simplified Chinese",
    "lang.zhHant": "Traditional Chinese",
    "prefs.hint": "Choose reading size, interface language, and display theme.",
    "prefs.fontSize": "Font size",
    "prefs.language": "Language",
    "prefs.theme": "Theme",
    "meta.description": PWA_META_DESCRIPTION.en,
    "time.justNow": "Just now",
    "time.minutesAgo": "{n} min ago",
    "time.hoursAgo": "{n} hr ago",
    "time.daysAgo": "{n} d ago"
  }
};

// web/src/lib/locale.ts
function applyDocumentLocale(locale) {
  if (typeof document === "undefined")
    return;
  const description = messages[locale]["meta.description"];
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  const manifest = document.querySelector('link[rel="manifest"]');
  if (manifest)
    manifest.href = manifestHref(locale);
}

// web/src/lib/locale.svelte.ts
var STORAGE_KEY = "nanoflux-locale";
function readStored() {
  try {
    return parseLocale(localStorage.getItem(STORAGE_KEY));
  } catch {}
  return null;
}
function browserLocale() {
  if (typeof navigator === "undefined")
    return DEFAULT_LOCALE;
  return localeFromNavigator(navigator.language);
}
var localeState = proxy({ locale: DEFAULT_LOCALE });
function applyLocale(locale) {
  if (typeof document === "undefined")
    return;
  document.documentElement.lang = htmlLang(locale);
  applyDocumentLocale(locale);
}
function initLocale() {
  localeState.locale = readStored() ?? browserLocale();
  applyLocale(localeState.locale);
}
function setLocale(locale) {
  localeState.locale = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {}
  applyLocale(locale);
}
function toggleLocale() {
  setLocale(nextLocale(localeState.locale));
}
function t(key2) {
  return messages[localeState.locale][key2];
}
function tf(key2, vars) {
  return Object.entries(vars).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), t(key2));
}

// web/src/components/buttons/SettingsButton.svelte
var root9 = from_html(`

<a>
  <!>
  <span> </span>
</a>`, 1);
function SettingsButton($$anchor, $$props) {
  push($$props, true);
  const $route = () => store_get(route, "$route", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  let collapsed = prop($$props, "collapsed", 3, false);
  const iconProps = { size: 16, strokeWidth: 1.5, "aria-hidden": true };
  const active = user_derived(() => $route() === "/settings");
  next();
  var fragment = root9();
  var a = sibling(first_child(fragment));
  var event_handler = user_derived(() => navClick("/settings"));
  var node = sibling(child(a));
  settings_default(node, spread_props(() => iconProps));
  var span = sibling(node, 2);
  var text2 = child(span, true);
  reset(span);
  next();
  reset(a);
  template_effect(($0, $1, $2) => {
    set_attribute2(a, "href", $0);
    set_class(a, 1, `flex items-center rounded-md text-sm transition-colors ${collapsed() ? "justify-center p-2 md:justify-center" : "gap-2 px-2 py-1.5"} ${get2(active) ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100"}`);
    set_attribute2(a, "aria-current", get2(active) ? "page" : undefined);
    set_attribute2(a, "title", $1);
    set_class(span, 1, clsx2(collapsed() ? "md:sr-only" : ""));
    set_text(text2, $2);
  }, [
    () => settingsHref(),
    () => collapsed() ? t("items.settings") : undefined,
    () => t("items.settings")
  ]);
  delegated("click", a, function(...$$args) {
    get2(event_handler)?.apply(this, $$args);
  });
  append($$anchor, fragment);
  pop();
  $$cleanup();
}
if (undefined) {}
var SettingsButton_default = SettingsButton;
delegate(["click"]);

// web/src/lib/api.ts
var unauthorizedListeners = new Set;
function onUnauthorized(listener) {
  unauthorizedListeners.add(listener);
  return () => {
    unauthorizedListeners.delete(listener);
  };
}
function notifyUnauthorized() {
  for (const listener of unauthorizedListeners)
    listener();
}
function assertApiOk(body) {
  if (body.code !== 0) {
    throw new Error(body.message || "Request failed");
  }
}
function normalizeItem(raw) {
  return {
    ...raw,
    is_read: Boolean(raw.is_read)
  };
}
async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...options.headers }
  });
  const body = await res.json().catch(() => ({}));
  if (res.status === 401 && !url.startsWith("/api/auth/")) {
    notifyUnauthorized();
  }
  if (!res.ok) {
    const message = body.error ?? body.message;
    throw new Error(message || `Request failed (${res.status})`);
  }
  return body;
}
async function fetchItemsPage(cursor, limit = 20, isRead) {
  const params = new URLSearchParams({
    limit: String(limit)
  });
  if (cursor)
    params.set("cursor", cursor);
  if (isRead === 0 || isRead === 1)
    params.set("is_read", String(isRead));
  const body = await request(`/api/items?${params}`);
  assertApiOk(body);
  if (!body.data) {
    throw new Error(body.message || "Failed to load items");
  }
  return {
    data: body.data.items.map(normalizeItem),
    nextCursor: body.data.nextCursor,
    hasMore: body.data.hasMore
  };
}
async function fetchFeedsPage(cursor, limit = 20, keyword, sort = "updated_desc") {
  const params = new URLSearchParams({ limit: String(limit), sort });
  if (cursor)
    params.set("cursor", cursor);
  if (keyword)
    params.set("keyword", keyword);
  const body = await request(`/api/feeds?${params}`);
  assertApiOk(body);
  if (!body.data) {
    throw new Error(body.message || "Failed to load feeds");
  }
  return {
    data: body.data.feeds,
    nextCursor: body.data.nextCursor,
    hasMore: body.data.hasMore
  };
}
function previewFeed(url) {
  const params = new URLSearchParams({ url });
  return request(`/api/feeds/meta?${params}`, {
    method: "POST",
    body: JSON.stringify({ url })
  });
}
async function searchWechatAccounts(query) {
  const params = new URLSearchParams({ query: query.trim() });
  const body = await request(`/api/feeds/wechat/accounts?${params}`);
  assertApiOk(body);
  if (!body.data) {
    throw new Error(body.message || "Failed to search WeChat accounts");
  }
  return body.data.accounts;
}
async function resolveWechatFeed(account) {
  const body = await request("/api/feeds/wechat/resolve", {
    method: "POST",
    body: JSON.stringify(account)
  });
  assertApiOk(body);
  if (!body.data) {
    throw new Error(body.message || "Failed to resolve WeChat feed");
  }
  return body.data;
}
function createFeed(payload) {
  return request("/api/feeds/create", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
function updateFeed(id, payload) {
  return request(`/api/feeds/${id}`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
function deleteFeed(id) {
  return request(`/api/feeds/${id}/delete`, {
    method: "POST"
  });
}
async function downloadFeedsOpml() {
  const res = await fetch("/api/feeds/export.opml", {
    credentials: "same-origin"
  });
  if (res.status === 401)
    notifyUnauthorized();
  if (!res.ok) {
    const text2 = await res.text().catch(() => "");
    throw new Error(text2 || `Export failed (${res.status})`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nanoflux.opml";
    anchor.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}
async function downloadItemsExcel(options) {
  const params = new URLSearchParams;
  if (options.since)
    params.set("since", options.since);
  if (options.until)
    params.set("until", options.until);
  params.set("tz_offset", String(new Date().getTimezoneOffset()));
  params.set("lang", localeState.locale);
  const res = await fetch(`/api/items/export.xlsx?${params}`, {
    credentials: "same-origin"
  });
  if (res.status === 401)
    notifyUnauthorized();
  if (!res.ok) {
    const text2 = await res.text().catch(() => "");
    throw new Error(text2 || `Export failed (${res.status})`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nanoflux-export.xlsx";
    anchor.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}
async function markAllItemsRead(until) {
  if (!until) {
    throw new Error("Missing until timestamp");
  }
  const body = await request("/api/items/read-all", {
    method: "POST",
    body: JSON.stringify({ until })
  });
  assertApiOk(body);
}
async function markItemRead(id) {
  const body = await request(`/api/items/${id}/read`, {
    method: "POST"
  });
  assertApiOk(body);
}
async function blockSource(source2) {
  const body = await request("/api/items/block-source", {
    method: "POST",
    body: JSON.stringify({ source: source2 })
  });
  assertApiOk(body);
  if (!body.data) {
    throw new Error(body.message || "Failed to block source");
  }
  return body.data;
}
function normalizeFilterConfig(data, defaults) {
  const prompt = typeof data?.prompt === "string" ? data.prompt : defaults?.prompt ?? "";
  const keywords = typeof data?.keywords === "string" ? data.keywords : defaults?.keywords ?? "";
  const sources = Array.isArray(data?.sources) ? data.sources.filter((source2) => typeof source2 === "string") : defaults?.sources ?? [];
  return {
    prompt,
    keywords,
    sources,
    enabled: typeof data?.enabled === "boolean" ? data.enabled : typeof defaults?.enabled === "boolean" ? defaults.enabled : false
  };
}
async function fetchFilter() {
  const body = await request("/api/filter");
  assertApiOk(body);
  if (!body.data) {
    throw new Error(body.message || "Failed to load filter");
  }
  return normalizeFilterConfig(body.data);
}
function updateFilter(payload) {
  return request("/api/filter", {
    method: "POST",
    body: JSON.stringify(payload)
  }).then((body) => {
    assertApiOk(body);
    if (!body.data) {
      throw new Error(body.message || "Failed to update filter");
    }
    return normalizeFilterConfig(body.data, payload);
  });
}
var TRANSLATE_TARGET_LANGS = [
  "en",
  "zh-Hans",
  "zh-Hant"
];
function parseTranslateTargetLang(value) {
  if (value === "zh")
    return "zh-Hans";
  if (value === "en" || value === "zh-Hans" || value === "zh-Hant") {
    return value;
  }
  return null;
}
function normalizeTranslateConfig(data, defaults) {
  const prompt = typeof data?.prompt === "string" ? data.prompt : defaults?.prompt ?? "";
  const targetLang = parseTranslateTargetLang(data?.targetLang) ?? parseTranslateTargetLang(defaults?.targetLang) ?? "zh-Hans";
  return {
    prompt,
    enabled: typeof data?.enabled === "boolean" ? data.enabled : typeof defaults?.enabled === "boolean" ? defaults.enabled : false,
    targetLang
  };
}
async function fetchTranslate() {
  const body = await request("/api/translate");
  assertApiOk(body);
  if (!body.data) {
    throw new Error(body.message || "Failed to load translate config");
  }
  return normalizeTranslateConfig(body.data);
}
function updateTranslate(payload) {
  return request("/api/translate", {
    method: "POST",
    body: JSON.stringify(payload)
  }).then((body) => {
    assertApiOk(body);
    if (!body.data) {
      throw new Error(body.message || "Failed to update translate config");
    }
    return normalizeTranslateConfig(body.data, payload);
  });
}
function normalizeFeverConfig(data, defaults) {
  return {
    enabled: typeof data?.enabled === "boolean" ? data.enabled : typeof defaults?.enabled === "boolean" ? defaults.enabled : false,
    user: typeof data?.user === "string" ? data.user : defaults?.user ?? "",
    hasPassword: typeof data?.hasPassword === "boolean" ? data.hasPassword : typeof defaults?.hasPassword === "boolean" ? defaults.hasPassword : false
  };
}
async function fetchFever() {
  const body = await request("/api/fever");
  assertApiOk(body);
  if (!body.data) {
    throw new Error(body.message || "Failed to load fever config");
  }
  return normalizeFeverConfig(body.data);
}
function updateFever(payload) {
  return request("/api/fever", {
    method: "POST",
    body: JSON.stringify(payload)
  }).then((body) => {
    assertApiOk(body);
    if (!body.data) {
      throw new Error(body.message || "Failed to update fever config");
    }
    return normalizeFeverConfig(body.data, {
      enabled: payload.enabled,
      user: payload.user,
      hasPassword: Boolean(payload.password) || undefined
    });
  });
}
function normalizeAuthStatus(data) {
  return {
    required: Boolean(data?.required),
    authenticated: Boolean(data?.authenticated)
  };
}
async function fetchAuthStatus() {
  const body = await request("/api/auth/status");
  assertApiOk(body);
  return normalizeAuthStatus(body.data);
}
async function loginAdmin(password) {
  const body = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ password })
  });
  assertApiOk(body);
  return normalizeAuthStatus(body.data);
}
async function logoutAdmin() {
  const body = await request("/api/auth/logout", {
    method: "POST"
  });
  assertApiOk(body);
  return normalizeAuthStatus(body.data);
}

// web/src/lib/auth.svelte.ts
var authState = proxy({ loading: true, required: false, authenticated: true });
onUnauthorized(() => {
  authState.required = true;
  authState.authenticated = false;
});
async function initAuth() {
  try {
    const status = await fetchAuthStatus();
    authState.required = status.required;
    authState.authenticated = status.authenticated;
  } catch {
    authState.required = false;
    authState.authenticated = true;
  } finally {
    authState.loading = false;
  }
}
async function submitLogin(password) {
  const status = await loginAdmin(password);
  authState.required = status.required;
  authState.authenticated = status.authenticated;
}
async function submitLogout() {
  const status = await logoutAdmin();
  authState.required = status.required;
  authState.authenticated = status.authenticated;
}

// web/src/lib/sidebar.svelte.ts
var STORAGE_KEY2 = "nanoflux-sidebar";
function readStored2() {
  try {
    const v = localStorage.getItem(STORAGE_KEY2);
    if (v === "true")
      return true;
    if (v === "false")
      return false;
  } catch {}
  return null;
}
var sidebarState = proxy({ collapsed: false });
function initSidebar() {
  sidebarState.collapsed = readStored2() ?? false;
}
function toggleSidebar() {
  sidebarState.collapsed = !sidebarState.collapsed;
  try {
    localStorage.setItem(STORAGE_KEY2, String(sidebarState.collapsed));
  } catch {}
}

// web/src/components/Header.svelte
var root10 = from_html(`
        <!>
      `, 1);
var root_12 = from_html(`
      <button type="button">
        <!>
        <span> </span>
      </button>
    `, 1);
var root_2 = from_html(`

<aside>
  <div>
    <a>
      NanoFlux
    </a>

    <button type="button" class="hidden shrink-0 cursor-pointer rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 md:inline-flex dark:hover:bg-neutral-800 dark:hover:text-neutral-100">
      <!>
    </button>
  </div>

  <nav class="mt-4 flex min-w-0 gap-1 overflow-x-auto text-sm md:mt-8 md:flex-col md:overflow-visible">
    <a>
      <!>
      <span> </span>
    </a>
    <a>
      <!>
      <span> </span>
    </a>
    <a>
      <!>
      <span> </span>
    </a>
  </nav>

  <div class="mt-4 shrink-0 md:mt-auto">
    <!>
    <!>
  </div>
</aside>`, 1);
function Header($$anchor, $$props) {
  push($$props, true);
  const $route = () => store_get(route, "$route", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  const iconProps = { size: 16, strokeWidth: 1.5, "aria-hidden": true };
  const toggleIconProps = { size: 16, strokeWidth: 1.5, "aria-hidden": true };
  const collapsed = user_derived(() => sidebarState.collapsed);
  const showLogout = user_derived(() => authState.required && authState.authenticated);
  async function handleLogout() {
    try {
      await submitLogout();
    } catch {}
  }
  const navClass = (active) => `flex items-center rounded-md transition-colors ${get2(collapsed) ? "justify-center p-2 md:justify-center" : "gap-2 px-2 py-1.5"} ${active ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100"}`;
  next();
  var fragment = root_2();
  var aside = sibling(first_child(fragment));
  var div = sibling(child(aside));
  var a = sibling(child(div));
  var event_handler = user_derived(() => navClick("/"));
  var button = sibling(a, 2);
  var node = sibling(child(button));
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root10();
      var node_1 = sibling(first_child(fragment_1));
      panel_left_open_default(node_1, spread_props(() => toggleIconProps));
      next();
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var fragment_2 = root10();
      var node_2 = sibling(first_child(fragment_2));
      panel_left_close_default(node_2, spread_props(() => toggleIconProps));
      next();
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if (get2(collapsed))
        $$render(consequent);
      else
        $$render(alternate, -1);
    });
  }
  next();
  reset(button);
  next();
  reset(div);
  var nav = sibling(div, 2);
  var a_1 = sibling(child(nav));
  var event_handler_1 = user_derived(() => navClick("/"));
  var node_3 = sibling(child(a_1));
  newspaper_default(node_3, spread_props(() => iconProps));
  var span = sibling(node_3, 2);
  var text2 = child(span, true);
  reset(span);
  next();
  reset(a_1);
  var a_2 = sibling(a_1, 2);
  var event_handler_2 = user_derived(() => navClick("/feeds"));
  var node_4 = sibling(child(a_2));
  rss_default(node_4, spread_props(() => iconProps));
  var span_1 = sibling(node_4, 2);
  var text_1 = child(span_1, true);
  reset(span_1);
  next();
  reset(a_2);
  var a_3 = sibling(a_2, 2);
  var event_handler_3 = user_derived(() => navClick("/export"));
  var node_5 = sibling(child(a_3));
  download_default(node_5, spread_props(() => iconProps));
  var span_2 = sibling(node_5, 2);
  var text_2 = child(span_2, true);
  reset(span_2);
  next();
  reset(a_3);
  next();
  reset(nav);
  var div_1 = sibling(nav, 2);
  var node_6 = sibling(child(div_1));
  SettingsButton_default(node_6, {
    get collapsed() {
      return get2(collapsed);
    }
  });
  var node_7 = sibling(node_6, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var fragment_3 = root_12();
      var button_1 = sibling(first_child(fragment_3));
      var node_8 = sibling(child(button_1));
      log_out_default(node_8, spread_props(() => iconProps));
      var span_3 = sibling(node_8, 2);
      var text_3 = child(span_3, true);
      reset(span_3);
      next();
      reset(button_1);
      next();
      template_effect(($0, $1) => {
        set_class(button_1, 1, `mt-1 flex w-full cursor-pointer items-center rounded-md text-sm text-neutral-400 transition-colors hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100 ${get2(collapsed) ? "justify-center p-2 md:justify-center" : "gap-2 px-2 py-1.5"}`);
        set_attribute2(button_1, "title", $0);
        set_class(span_3, 1, clsx2(get2(collapsed) ? "md:sr-only" : ""));
        set_text(text_3, $1);
      }, [
        () => get2(collapsed) ? t("auth.logout") : undefined,
        () => t("auth.logout")
      ]);
      delegated("click", button_1, handleLogout);
      append($$anchor2, fragment_3);
    };
    if_block(node_7, ($$render) => {
      if (get2(showLogout))
        $$render(consequent_1);
    });
  }
  next();
  reset(div_1);
  next();
  reset(aside);
  template_effect(($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) => {
    set_class(aside, 1, `border-b border-neutral-100 px-5 py-5 transition-[width,padding] duration-200 dark:border-neutral-800 md:sticky md:top-4 md:m-4 md:flex md:h-[calc(100vh-2rem)] md:shrink-0 md:flex-col md:rounded-xl md:border md:bg-white md:py-8 md:shadow-sm md:dark:bg-neutral-950 ${get2(collapsed) ? "md:w-14 md:px-2" : "md:w-48 md:px-5"}`);
    set_class(div, 1, `flex items-center ${get2(collapsed) ? "md:flex-col md:gap-2" : "justify-between gap-2"}`);
    set_attribute2(a, "href", $0);
    set_class(a, 1, `truncate text-lg font-medium tracking-tight hover:opacity-70 ${get2(collapsed) ? "md:hidden" : ""}`);
    set_attribute2(button, "aria-label", $1);
    set_attribute2(button, "title", $2);
    set_attribute2(nav, "aria-label", $3);
    set_attribute2(a_1, "href", $4);
    set_class(a_1, 1, $5);
    set_attribute2(a_1, "aria-current", $route() === "/" ? "page" : undefined);
    set_attribute2(a_1, "title", $6);
    set_class(span, 1, clsx2(get2(collapsed) ? "md:sr-only" : ""));
    set_text(text2, $7);
    set_attribute2(a_2, "href", $8);
    set_class(a_2, 1, $9);
    set_attribute2(a_2, "aria-current", $route() === "/feeds" ? "page" : undefined);
    set_attribute2(a_2, "title", $10);
    set_class(span_1, 1, clsx2(get2(collapsed) ? "md:sr-only" : ""));
    set_text(text_1, $11);
    set_attribute2(a_3, "href", $12);
    set_class(a_3, 1, $13);
    set_attribute2(a_3, "aria-current", $route() === "/export" ? "page" : undefined);
    set_attribute2(a_3, "title", $14);
    set_class(span_2, 1, clsx2(get2(collapsed) ? "md:sr-only" : ""));
    set_text(text_2, $15);
  }, [
    () => homeHref(),
    () => get2(collapsed) ? t("sidebar.expand") : t("sidebar.collapse"),
    () => get2(collapsed) ? t("sidebar.expand") : t("sidebar.collapse"),
    () => t("items.latest"),
    () => homeHref(),
    () => clsx2(navClass($route() === "/")),
    () => get2(collapsed) ? t("items.latest") : undefined,
    () => t("items.latest"),
    () => feedsHref(),
    () => clsx2(navClass($route() === "/feeds")),
    () => get2(collapsed) ? t("items.feeds") : undefined,
    () => t("items.feeds"),
    () => exportHref(),
    () => clsx2(navClass($route() === "/export")),
    () => get2(collapsed) ? t("items.export") : undefined,
    () => t("items.export")
  ]);
  delegated("click", a, function(...$$args) {
    get2(event_handler)?.apply(this, $$args);
  });
  delegated("click", button, function(...$$args) {
    toggleSidebar?.apply(this, $$args);
  });
  delegated("click", a_1, function(...$$args) {
    get2(event_handler_1)?.apply(this, $$args);
  });
  delegated("click", a_2, function(...$$args) {
    get2(event_handler_2)?.apply(this, $$args);
  });
  delegated("click", a_3, function(...$$args) {
    get2(event_handler_3)?.apply(this, $$args);
  });
  append($$anchor, fragment);
  pop();
  $$cleanup();
}
if (undefined) {}
var Header_default = Header;
delegate(["click"]);

// node_modules/@lucide/svelte/dist/icons/pencil.svelte
var rest_excludes9 = new Set(["$$slots", "$$events", "$$legacy"]);
var root11 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4KICA8cGF0aCBkPSJtMTUgNSA0IDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pencil
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Pencil($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes9);
  const iconNode = [
    [
      "path",
      {
        d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
      }
    ],
    ["path", { d: "m15 5 4 4" }]
  ];
  var fragment = root11();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "pencil" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var pencil_default = Pencil;
// node_modules/@lucide/svelte/dist/icons/trash-2.svelte
var rest_excludes10 = new Set(["$$slots", "$$events", "$$legacy"]);
var root12 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTF2NiIgLz4KICA8cGF0aCBkPSJNMTQgMTF2NiIgLz4KICA8cGF0aCBkPSJNMTkgNnYxNGEyIDIgMCAwIDEtMiAySDdhMiAyIDAgMCAxLTItMlY2IiAvPgogIDxwYXRoIGQ9Ik0zIDZoMTgiIC8+CiAgPHBhdGggZD0iTTggNlY0YTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/trash-2
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Trash_2($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes10);
  const iconNode = [
    ["path", { d: "M10 11v6" }],
    ["path", { d: "M14 11v6" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
    ["path", { d: "M3 6h18" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
  ];
  var fragment = root12();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "trash-2" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var trash_2_default = Trash_2;
// web/src/lib/utils.ts
function formatTime(iso, nowMs = Date.now()) {
  if (!iso)
    return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime()))
    return iso;
  const now2 = new Date(nowMs);
  const diff = now2.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)
    return t("time.justNow");
  if (mins < 60)
    return tf("time.minutesAgo", { n: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24)
    return tf("time.hoursAgo", { n: hours });
  const days = Math.floor(hours / 24);
  if (days < 7)
    return tf("time.daysAgo", { n: days });
  const tag2 = dateLocaleTag(localeState.locale);
  return date.toLocaleDateString(tag2, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now2.getFullYear() ? "numeric" : undefined
  });
}

// shared/google-news.ts
function googleNewsLanguageFromKeyword(keyword) {
  return /[\u4e00-\u9fff]/.test(keyword) ? "zh-CN" : "en-US";
}
function buildKeywordGoogleNewsFeedUrl(keyword) {
  const trimmed = keyword.trim();
  if (!trimmed) {
    throw new Error("keyword must not be empty");
  }
  const q = encodeURIComponent(trimmed).replace(/%20/g, "+");
  const language = googleNewsLanguageFromKeyword(trimmed);
  return `https://news.google.com/rss/search?q=${q}+when:3d&hl=${language}`;
}

// web/src/components/FeedsManager.svelte
var root13 = from_html(`
        <button type="button" class="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"> </button>
        <button type="button" class="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"> </button>
      `, 1);
var root_13 = from_html(`
        <button type="button" class="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"> </button>
      `, 1);
var root_22 = from_html(`
    <p class="mt-3 text-sm text-neutral-400 dark:text-neutral-500"> </p>
  `, 1);
var root_3 = from_html(`
    <p class="mt-3 text-sm text-amber-600 dark:text-amber-500"> </p>
  `, 1);
var root_4 = from_html(`
    <p class="mt-3 text-sm text-red-500"> </p>
  `, 1);
var root_5 = from_html(`
          <p class="text-sm text-red-500"> </p>
        `, 1);
var root_6 = from_html(`
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="presentation">
    <div role="dialog" aria-modal="true" aria-labelledby="keyword-dialog-title" class="w-full max-w-sm border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900" tabindex="-1">
      <h3 id="keyword-dialog-title" class="text-sm font-medium text-neutral-900 dark:text-neutral-100"> </h3>
      <form class="mt-4 space-y-4">
        <input type="text" class="w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100"/>
        <!>
        <div class="flex gap-4">
          <button type="submit" class="text-sm text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"> </button>
          <button type="button" class="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"> </button>
        </div>
      </form>
    </div>
  </div>
`, 1);
var root_7 = from_html(`
        <p class="mt-3 text-sm text-red-500"> </p>
      `, 1);
var root_8 = from_html(`
        <p class="mt-3 text-sm text-neutral-400 dark:text-neutral-500"> </p>
      `, 1);
var root_9 = from_html(`
          <p class="py-6 text-center text-sm text-neutral-300 dark:text-neutral-600"> </p>
        `, 1);
var root_10 = from_html(`
                    <img alt="" class="h-9 w-9 shrink-0 rounded-full bg-neutral-100 object-cover dark:bg-neutral-800" loading="lazy" referrerpolicy="no-referrer"/>
                  `, 1);
var root_11 = from_html(`
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500" aria-hidden="true"> </div>
                  `, 1);
var root_122 = from_html(`
              <li>
                <button type="button" class="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-neutral-800/60">
                  <!>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100"> </p>
                    <p class="truncate text-xs text-neutral-400 dark:text-neutral-500"> </p>
                  </div>
                  <span> </span>
                </button>
              </li>
            `, 1);
var root_132 = from_html(`
          <ul class="divide-y divide-neutral-100 dark:divide-neutral-800">
            <!>
          </ul>
        `, 1);
var root_14 = from_html(`
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="presentation">
    <div role="dialog" aria-modal="true" aria-labelledby="wechat-dialog-title" class="flex max-h-[80vh] w-full max-w-md flex-col border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900" tabindex="-1">
      <h3 id="wechat-dialog-title" class="text-sm font-medium text-neutral-900 dark:text-neutral-100"> </h3>
      <form class="mt-4 flex gap-3">
        <input type="text" class="min-w-0 flex-1 border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 disabled:opacity-60 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100"/>
        <button type="submit" class="shrink-0 text-sm text-neutral-900 underline-offset-4 hover:underline disabled:opacity-50 dark:text-neutral-100"> </button>
      </form>
      <!>
      <div class="mt-4 min-h-0 flex-1 overflow-y-auto">
        <!>
      </div>
      <div class="mt-4 flex gap-4">
        <button type="button" class="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"> </button>
      </div>
    </div>
  </div>
`, 1);
var root_15 = from_html(`
    <p class="text-sm text-red-500"> </p>
  `, 1);
var root_16 = from_html(`
    <p class="text-sm text-neutral-300 dark:text-neutral-600"> </p>
  `, 1);
var root_17 = from_html(`
              <p class="col-span-2 text-sm text-neutral-400 dark:text-neutral-500"> </p>
            `, 1);
var root_18 = from_html(`
        <li class="group grid w-full grid-cols-[1fr_auto] gap-x-4 gap-y-2 py-5">
            <p class="min-w-0 text-sm font-medium"> </p>
            <div class="relative flex shrink-0 items-center">
              <div class="absolute right-full mr-2 flex gap-1 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 dark:text-neutral-500">
                <button type="button" class="inline-flex cursor-pointer items-center justify-center rounded-md p-1 hover:text-neutral-900 dark:hover:text-neutral-100">
                  <!>
                </button>
                <button type="button" class="inline-flex cursor-pointer items-center justify-center rounded-md p-1 hover:text-red-500">
                  <!>
                </button>
              </div>
              <time class="text-xs text-neutral-400 dark:text-neutral-500">
                <!>
              </time>
            </div>
            <a target="_blank" rel="noopener noreferrer" class="col-span-2 min-w-0 w-full truncate text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"> </a>
            <!>
        </li>
      `, 1);
var root_19 = from_html(`
      <p class="py-8 text-center text-sm text-neutral-300 dark:text-neutral-600"> </p>
    `, 1);
var root_20 = from_html(`
    <ul class="divide-y divide-neutral-100 dark:divide-neutral-800">
      <!>
    </ul>
    <!>
    <div class="h-1" aria-hidden="true"></div>
  `, 1);
var root_21 = from_html(`

<section class="mb-10">
  <form class="space-y-3">
    <input type="text" required="" class="w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100"/>
    <input type="url" required="" placeholder="https://example.com/feed.xml"/>
    <input type="text" class="w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100"/>
    <div class="flex gap-4 pt-2">
      <button type="submit" class="text-sm text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"> </button>
      <!>
      <!>
    </div>
  </form>
  <!>
  <!>
</section>

<!>

<!>

<section>
  <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
    <h2 class="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </h2>
    <div class="flex flex-wrap items-center gap-3 text-xs">
      <button type="button" class="inline-flex items-center gap-1 text-neutral-400 transition-colors hover:text-neutral-600 disabled:opacity-50 dark:hover:text-neutral-300">
        <!> </button>
      <div class="flex gap-3" role="group">
      <button type="button"> </button>
      <button type="button"> </button>
      </div>
    </div>
  </div>
  <!>
</section>`, 1);
function FeedsManager($$anchor, $$props) {
  push($$props, true);
  const PAGE_SIZE = 20;
  const iconProps = { size: 16, strokeWidth: 1.5, "aria-hidden": true };
  let feeds = state(proxy([]));
  let cursor = state(null);
  let hasMore = state(true);
  let editId = state(null);
  let title = state("");
  let url = state("");
  let description = state("");
  let formError = state("");
  let listError = state("");
  let loading = state(true);
  let loadingMore = state(false);
  let previewing = state(false);
  let previewError = state("");
  let titleTouched = state(false);
  let descriptionTouched = state(false);
  let previewTimer;
  let previewRequest = 0;
  let sentinel = state(null);
  let sort = state("updated_desc");
  let exportingOpml = state(false);
  let now2 = state(proxy(Date.now()));
  let keywordDialogOpen = state(false);
  let keywordInput = state("");
  let keywordError = state("");
  let keywordInputEl = state(null);
  let wechatDialogOpen = state(false);
  let wechatQuery = state("");
  let wechatError = state("");
  let wechatSearching = state(false);
  let wechatResolving = state(false);
  let wechatAccounts = state(proxy([]));
  let wechatSearched = state(false);
  let wechatInputEl = state(null);
  let wechatSearchRequest = 0;
  const isEditing = user_derived(() => get2(editId) !== null);
  async function openKeywordDialog() {
    set(keywordInput, "");
    set(keywordError, "");
    set(keywordDialogOpen, true);
    await tick();
    get2(keywordInputEl)?.focus();
  }
  function closeKeywordDialog() {
    set(keywordDialogOpen, false);
    set(keywordInput, "");
    set(keywordError, "");
  }
  function applyKeywordFeed() {
    const keyword = get2(keywordInput).trim();
    if (!keyword) {
      set(keywordError, t("feeds.keywordEmpty"), true);
      return;
    }
    resetForm();
    set(url, buildKeywordGoogleNewsFeedUrl(keyword), true);
    set(title, keyword, true);
    set(titleTouched, true);
    closeKeywordDialog();
    runPreview(get2(url));
  }
  async function openWechatDialog() {
    set(wechatQuery, "");
    set(wechatError, "");
    set(wechatAccounts, [], true);
    set(wechatSearched, false);
    set(wechatSearching, false);
    set(wechatResolving, false);
    set(wechatDialogOpen, true);
    await tick();
    get2(wechatInputEl)?.focus();
  }
  function closeWechatDialog() {
    wechatSearchRequest++;
    set(wechatDialogOpen, false);
    set(wechatQuery, "");
    set(wechatError, "");
    set(wechatAccounts, [], true);
    set(wechatSearched, false);
    set(wechatSearching, false);
    set(wechatResolving, false);
  }
  async function runWechatSearch() {
    const query = get2(wechatQuery).trim();
    if (!query) {
      set(wechatError, t("feeds.wechatEmpty"), true);
      return;
    }
    const requestId = ++wechatSearchRequest;
    set(wechatSearching, true);
    set(wechatError, "");
    set(wechatSearched, false);
    try {
      const accounts = await searchWechatAccounts(query);
      if (requestId !== wechatSearchRequest)
        return;
      set(wechatAccounts, accounts, true);
      set(wechatSearched, true);
    } catch (e) {
      if (requestId !== wechatSearchRequest)
        return;
      set(wechatAccounts, [], true);
      set(wechatSearched, true);
      set(wechatError, e instanceof Error ? e.message : t("feeds.loadFailed"), true);
    } finally {
      if (requestId === wechatSearchRequest)
        set(wechatSearching, false);
    }
  }
  async function selectWechatAccount(account) {
    if (get2(wechatResolving))
      return;
    set(wechatResolving, true);
    set(wechatError, "");
    try {
      const resolved = account.rss_url ? {
        title: account.nickname,
        url: account.rss_url,
        description: account.alias.trim() || null
      } : await resolveWechatFeed({
        fakeid: account.fakeid,
        nickname: account.nickname,
        alias: account.alias,
        head_img: account.round_head_img
      });
      resetForm();
      set(title, resolved.title, true);
      set(url, resolved.url, true);
      set(description, resolved.description ?? "", true);
      set(titleTouched, true);
      set(descriptionTouched, Boolean(resolved.description), true);
      closeWechatDialog();
      runPreview(get2(url));
    } catch (e) {
      set(wechatError, e instanceof Error ? e.message : t("feeds.wechatResolveFailed"), true);
    } finally {
      set(wechatResolving, false);
    }
  }
  function isValidFeedUrl(value) {
    try {
      const u = new URL(value.trim());
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }
  function cancelPreview() {
    previewRequest++;
    set(previewing, false);
    clearTimeout(previewTimer);
  }
  async function runPreview(feedUrl) {
    const trimmed = feedUrl.trim();
    if (!isValidFeedUrl(trimmed)) {
      cancelPreview();
      return;
    }
    const requestId = ++previewRequest;
    set(previewing, true);
    set(previewError, "");
    try {
      const res = await previewFeed(trimmed);
      if (requestId !== previewRequest)
        return;
      if (!get2(titleTouched) && res.data.title)
        set(title, res.data.title, true);
      if (!get2(descriptionTouched) && res.data.description)
        set(description, res.data.description, true);
    } catch (e) {
      if (requestId !== previewRequest)
        return;
      set(previewError, e instanceof Error ? e.message : t("feeds.parseFailed"), true);
    } finally {
      if (requestId === previewRequest)
        set(previewing, false);
    }
  }
  function schedulePreview() {
    clearTimeout(previewTimer);
    set(previewError, "");
    const feedUrl = get2(url).trim();
    if (!isValidFeedUrl(feedUrl)) {
      cancelPreview();
      return;
    }
    previewTimer = setTimeout(() => void runPreview(feedUrl), 600);
  }
  function onUrlInput() {
    schedulePreview();
  }
  function onUrlBlur() {
    clearTimeout(previewTimer);
    const feedUrl = get2(url).trim();
    if (!isValidFeedUrl(feedUrl)) {
      cancelPreview();
      return;
    }
    runPreview(feedUrl);
  }
  async function loadFeeds(append2 = false) {
    set(listError, "");
    if (append2) {
      if (get2(loadingMore) || !get2(hasMore))
        return;
      set(loadingMore, true);
    } else {
      set(loading, true);
      set(cursor, null);
      set(hasMore, true);
    }
    try {
      const page = await fetchFeedsPage(append2 ? get2(cursor) ?? undefined : undefined, PAGE_SIZE, undefined, get2(sort));
      set(feeds, append2 ? [...get2(feeds), ...page.data] : page.data, true);
      set(cursor, page.nextCursor, true);
      set(hasMore, page.hasMore, true);
    } catch (e) {
      set(listError, e instanceof Error ? e.message : t("feeds.loadFailed"), true);
    } finally {
      set(loading, false);
      set(loadingMore, false);
    }
  }
  async function loadMore() {
    await loadFeeds(true);
  }
  user_effect(() => {
    if (!get2(sentinel))
      return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting))
        loadMore();
    }, { rootMargin: "200px" });
    observer.observe(get2(sentinel));
    return () => observer.disconnect();
  });
  function resetForm() {
    set(editId, null);
    set(title, "");
    set(url, "");
    set(description, "");
    set(formError, "");
    set(previewError, "");
    set(titleTouched, false);
    set(descriptionTouched, false);
    cancelPreview();
  }
  function startEdit(feed) {
    set(editId, feed.id, true);
    set(title, feed.title, true);
    set(url, feed.url, true);
    set(description, feed.description ?? "", true);
    set(formError, "");
    set(previewError, "");
    set(titleTouched, true);
    set(descriptionTouched, true);
    cancelPreview();
  }
  async function handleSubmit(e) {
    e.preventDefault();
    set(formError, "");
    try {
      if (get2(editId) !== null) {
        await updateFeed(get2(editId), {
          title: get2(title).trim(),
          url: get2(url).trim(),
          description: get2(description).trim() || null
        });
      } else {
        await createFeed({
          title: get2(title).trim(),
          url: get2(url).trim(),
          description: get2(description).trim() || null
        });
      }
      resetForm();
      set(loading, true);
      await loadFeeds();
    } catch (err) {
      set(formError, err instanceof Error ? err.message : t("feeds.saveFailed"), true);
    }
  }
  async function handleDelete(id) {
    if (!confirm(t("feeds.confirmDelete")))
      return;
    set(listError, "");
    try {
      await deleteFeed(id);
      if (get2(editId) === id)
        resetForm();
      set(loading, true);
      await loadFeeds();
    } catch (e) {
      set(listError, e instanceof Error ? e.message : t("feeds.deleteFailed"), true);
    }
  }
  async function setSort(next2) {
    if (next2 === get2(sort))
      return;
    set(sort, next2, true);
    set(loading, true);
    await loadFeeds();
  }
  async function handleExportOpml() {
    if (get2(exportingOpml))
      return;
    set(listError, "");
    set(exportingOpml, true);
    try {
      await downloadFeedsOpml();
    } catch (e) {
      set(listError, e instanceof Error ? e.message : t("feeds.exportOpmlFailed"), true);
    } finally {
      set(exportingOpml, false);
    }
  }
  onMount(() => {
    loadFeeds();
    const timer = setInterval(() => {
      set(now2, Date.now(), true);
    }, 60000);
    return () => clearInterval(timer);
  });
  next();
  var fragment = root_21();
  var section = sibling(first_child(fragment));
  var form = sibling(child(section));
  var input = sibling(child(form));
  remove_input_defaults(input);
  var input_1 = sibling(input, 2);
  remove_input_defaults(input_1);
  let classes;
  var input_2 = sibling(input_1, 2);
  remove_input_defaults(input_2);
  var div = sibling(input_2, 2);
  var button = sibling(child(div));
  var text2 = child(button);
  reset(button);
  var node = sibling(button, 2);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root13();
      var button_1 = sibling(first_child(fragment_1));
      var text_1 = child(button_1);
      reset(button_1);
      var button_2 = sibling(button_1, 2);
      var text_2 = child(button_2);
      reset(button_2);
      next();
      template_effect(($0, $1) => {
        set_text(text_1, `
          ${$0 ?? ""}
        `);
        set_text(text_2, `
          ${$1 ?? ""}
        `);
      }, [() => t("feeds.keyword"), () => t("feeds.wechat")]);
      delegated("click", button_1, openKeywordDialog);
      delegated("click", button_2, () => void openWechatDialog());
      append($$anchor2, fragment_1);
    };
    if_block(node, ($$render) => {
      if (!get2(isEditing))
        $$render(consequent);
    });
  }
  var node_1 = sibling(node, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var fragment_2 = root_13();
      var button_3 = sibling(first_child(fragment_2));
      var text_3 = child(button_3);
      reset(button_3);
      next();
      template_effect(($0) => set_text(text_3, `
          ${$0 ?? ""}
        `), [() => t("feeds.cancel")]);
      delegated("click", button_3, resetForm);
      append($$anchor2, fragment_2);
    };
    if_block(node_1, ($$render) => {
      if (get2(isEditing))
        $$render(consequent_1);
    });
  }
  next();
  reset(div);
  next();
  reset(form);
  var node_2 = sibling(form, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var fragment_3 = root_22();
      var p = sibling(first_child(fragment_3));
      var text_4 = child(p);
      reset(p);
      next();
      template_effect(($0) => set_text(text_4, `
      ${$0 ?? ""}
    `), [() => t("feeds.parsing")]);
      append($$anchor2, fragment_3);
    };
    var consequent_3 = ($$anchor2) => {
      var fragment_4 = root_3();
      var p_1 = sibling(first_child(fragment_4));
      var text_5 = child(p_1);
      reset(p_1);
      next();
      template_effect(() => set_text(text_5, `
      ${get2(previewError) ?? ""}
    `));
      append($$anchor2, fragment_4);
    };
    if_block(node_2, ($$render) => {
      if (get2(previewing))
        $$render(consequent_2);
      else if (get2(previewError))
        $$render(consequent_3, 1);
    });
  }
  var node_3 = sibling(node_2, 2);
  {
    var consequent_4 = ($$anchor2) => {
      var fragment_5 = root_4();
      var p_2 = sibling(first_child(fragment_5));
      var text_6 = child(p_2, true);
      reset(p_2);
      next();
      template_effect(() => set_text(text_6, get2(formError)));
      append($$anchor2, fragment_5);
    };
    if_block(node_3, ($$render) => {
      if (get2(formError))
        $$render(consequent_4);
    });
  }
  next();
  reset(section);
  var node_4 = sibling(section, 2);
  {
    var consequent_6 = ($$anchor2) => {
      var fragment_6 = root_6();
      var div_1 = sibling(first_child(fragment_6));
      var div_2 = sibling(child(div_1));
      var h3 = sibling(child(div_2));
      var text_7 = child(h3);
      reset(h3);
      var form_1 = sibling(h3, 2);
      var input_3 = sibling(child(form_1));
      remove_input_defaults(input_3);
      bind_this(input_3, ($$value) => set(keywordInputEl, $$value), () => get2(keywordInputEl));
      var node_5 = sibling(input_3, 2);
      {
        var consequent_5 = ($$anchor3) => {
          var fragment_7 = root_5();
          var p_3 = sibling(first_child(fragment_7));
          var text_8 = child(p_3, true);
          reset(p_3);
          next();
          template_effect(() => set_text(text_8, get2(keywordError)));
          append($$anchor3, fragment_7);
        };
        if_block(node_5, ($$render) => {
          if (get2(keywordError))
            $$render(consequent_5);
        });
      }
      var div_3 = sibling(node_5, 2);
      var button_4 = sibling(child(div_3));
      var text_9 = child(button_4);
      reset(button_4);
      var button_5 = sibling(button_4, 2);
      var text_10 = child(button_5);
      reset(button_5);
      next();
      reset(div_3);
      next();
      reset(form_1);
      next();
      reset(div_2);
      next();
      reset(div_1);
      next();
      template_effect(($0, $1, $2, $3) => {
        set_text(text_7, `
        ${$0 ?? ""}
      `);
        set_attribute2(input_3, "placeholder", $1);
        set_text(text_9, `
            ${$2 ?? ""}
          `);
        set_text(text_10, `
            ${$3 ?? ""}
          `);
      }, [
        () => t("feeds.keywordTitle"),
        () => t("feeds.keywordPlaceholder"),
        () => t("feeds.keywordConfirm"),
        () => t("feeds.cancel")
      ]);
      delegated("click", div_1, (e) => {
        if (e.target === e.currentTarget)
          closeKeywordDialog();
      });
      delegated("keydown", div_1, (e) => {
        if (e.key === "Escape")
          closeKeywordDialog();
      });
      event("submit", form_1, (e) => {
        e.preventDefault();
        applyKeywordFeed();
      });
      bind_value(input_3, () => get2(keywordInput), ($$value) => set(keywordInput, $$value));
      delegated("click", button_5, closeKeywordDialog);
      append($$anchor2, fragment_6);
    };
    if_block(node_4, ($$render) => {
      if (get2(keywordDialogOpen))
        $$render(consequent_6);
    });
  }
  var node_6 = sibling(node_4, 2);
  {
    var consequent_13 = ($$anchor2) => {
      var fragment_8 = root_14();
      var div_4 = sibling(first_child(fragment_8));
      var div_5 = sibling(child(div_4));
      var h3_1 = sibling(child(div_5));
      var text_11 = child(h3_1);
      reset(h3_1);
      var form_2 = sibling(h3_1, 2);
      var input_4 = sibling(child(form_2));
      remove_input_defaults(input_4);
      bind_this(input_4, ($$value) => set(wechatInputEl, $$value), () => get2(wechatInputEl));
      var button_6 = sibling(input_4, 2);
      var text_12 = child(button_6);
      reset(button_6);
      next();
      reset(form_2);
      var node_7 = sibling(form_2, 2);
      {
        var consequent_7 = ($$anchor3) => {
          var fragment_9 = root_7();
          var p_4 = sibling(first_child(fragment_9));
          var text_13 = child(p_4, true);
          reset(p_4);
          next();
          template_effect(() => set_text(text_13, get2(wechatError)));
          append($$anchor3, fragment_9);
        };
        var consequent_8 = ($$anchor3) => {
          var fragment_10 = root_8();
          var p_5 = sibling(first_child(fragment_10));
          var text_14 = child(p_5);
          reset(p_5);
          next();
          template_effect(($0) => set_text(text_14, `
          ${$0 ?? ""}
        `), [() => t("feeds.wechatResolving")]);
          append($$anchor3, fragment_10);
        };
        if_block(node_7, ($$render) => {
          if (get2(wechatError))
            $$render(consequent_7);
          else if (get2(wechatResolving))
            $$render(consequent_8, 1);
        });
      }
      var div_6 = sibling(node_7, 2);
      var node_8 = sibling(child(div_6));
      {
        var consequent_9 = ($$anchor3) => {
          var fragment_11 = root_9();
          var p_6 = sibling(first_child(fragment_11));
          var text_15 = child(p_6);
          reset(p_6);
          next();
          template_effect(($0) => set_text(text_15, `
            ${$0 ?? ""}
          `), [() => t("feeds.wechatSearching")]);
          append($$anchor3, fragment_11);
        };
        var consequent_10 = ($$anchor3) => {
          var fragment_12 = root_9();
          var p_7 = sibling(first_child(fragment_12));
          var text_16 = child(p_7);
          reset(p_7);
          next();
          template_effect(($0) => set_text(text_16, `
            ${$0 ?? ""}
          `), [() => t("feeds.wechatNoResults")]);
          append($$anchor3, fragment_12);
        };
        var consequent_12 = ($$anchor3) => {
          var fragment_13 = root_132();
          var ul = sibling(first_child(fragment_13));
          var node_9 = sibling(child(ul));
          each(node_9, 17, () => get2(wechatAccounts), (account) => account.fakeid, ($$anchor4, account) => {
            next();
            var fragment_14 = root_122();
            var li = sibling(first_child(fragment_14));
            var button_7 = sibling(child(li));
            var node_10 = sibling(child(button_7));
            {
              var consequent_11 = ($$anchor5) => {
                var fragment_15 = root_10();
                var img = sibling(first_child(fragment_15));
                next();
                template_effect(() => set_attribute2(img, "src", get2(account).round_head_img));
                append($$anchor5, fragment_15);
              };
              var alternate = ($$anchor5) => {
                var fragment_16 = root_11();
                var div_7 = sibling(first_child(fragment_16));
                var text_17 = child(div_7);
                reset(div_7);
                next();
                template_effect(($0) => set_text(text_17, `
                      ${$0 ?? ""}
                    `), [() => get2(account).nickname.slice(0, 1) || "?"]);
                append($$anchor5, fragment_16);
              };
              if_block(node_10, ($$render) => {
                if (get2(account).round_head_img)
                  $$render(consequent_11);
                else
                  $$render(alternate, -1);
              });
            }
            var div_8 = sibling(node_10, 2);
            var p_8 = sibling(child(div_8));
            var text_18 = child(p_8);
            reset(p_8);
            var p_9 = sibling(p_8, 2);
            var text_19 = child(p_9);
            reset(p_9);
            next();
            reset(div_8);
            var span = sibling(div_8, 2);
            var text_20 = child(span);
            reset(span);
            next();
            reset(button_7);
            next();
            reset(li);
            next();
            template_effect(($0) => {
              button_7.disabled = get2(wechatResolving) || get2(account).subscribed;
              set_text(text_18, `
                      ${get2(account).nickname ?? ""}
                    `);
              set_text(text_19, `
                      ${(get2(account).alias || get2(account).fakeid) ?? ""}
                    `);
              set_class(span, 1, `shrink-0 text-xs ${get2(account).subscribed ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-300 dark:text-neutral-600"}`);
              set_text(text_20, `
                    ${$0 ?? ""}
                  `);
            }, [
              () => get2(account).subscribed ? t("feeds.wechatSubscribed") : t("feeds.wechatNotSubscribed")
            ]);
            delegated("click", button_7, () => void selectWechatAccount(get2(account)));
            append($$anchor4, fragment_14);
          });
          next();
          reset(ul);
          next();
          append($$anchor3, fragment_13);
        };
        if_block(node_8, ($$render) => {
          if (get2(wechatSearching))
            $$render(consequent_9);
          else if (get2(wechatSearched) && get2(wechatAccounts).length === 0 && !get2(wechatError))
            $$render(consequent_10, 1);
          else if (get2(wechatAccounts).length > 0)
            $$render(consequent_12, 2);
        });
      }
      next();
      reset(div_6);
      var div_9 = sibling(div_6, 2);
      var button_8 = sibling(child(div_9));
      var text_21 = child(button_8);
      reset(button_8);
      next();
      reset(div_9);
      next();
      reset(div_5);
      next();
      reset(div_4);
      next();
      template_effect(($0, $1, $2, $3) => {
        set_text(text_11, `
        ${$0 ?? ""}
      `);
        input_4.disabled = get2(wechatSearching) || get2(wechatResolving);
        set_attribute2(input_4, "placeholder", $1);
        button_6.disabled = get2(wechatSearching) || get2(wechatResolving);
        set_text(text_12, `
          ${$2 ?? ""}
        `);
        button_8.disabled = get2(wechatResolving);
        set_text(text_21, `
          ${$3 ?? ""}
        `);
      }, [
        () => t("feeds.wechatTitle"),
        () => t("feeds.wechatPlaceholder"),
        () => get2(wechatSearching) ? t("feeds.wechatSearching") : t("feeds.wechatSearch"),
        () => t("feeds.cancel")
      ]);
      delegated("click", div_4, (e) => {
        if (e.target === e.currentTarget && !get2(wechatResolving))
          closeWechatDialog();
      });
      delegated("keydown", div_4, (e) => {
        if (e.key === "Escape" && !get2(wechatResolving))
          closeWechatDialog();
      });
      event("submit", form_2, (e) => {
        e.preventDefault();
        runWechatSearch();
      });
      bind_value(input_4, () => get2(wechatQuery), ($$value) => set(wechatQuery, $$value));
      delegated("click", button_8, closeWechatDialog);
      append($$anchor2, fragment_8);
    };
    if_block(node_6, ($$render) => {
      if (get2(wechatDialogOpen))
        $$render(consequent_13);
    });
  }
  var section_1 = sibling(node_6, 2);
  var div_10 = sibling(child(section_1));
  var h2 = sibling(child(div_10));
  var text_22 = child(h2);
  reset(h2);
  var div_11 = sibling(h2, 2);
  var button_9 = sibling(child(div_11));
  var node_11 = sibling(child(button_9));
  download_default(node_11, spread_props(() => iconProps));
  var text_23 = sibling(node_11);
  reset(button_9);
  var div_12 = sibling(button_9, 2);
  var button_10 = sibling(child(div_12));
  var text_24 = child(button_10);
  reset(button_10);
  var button_11 = sibling(button_10, 2);
  var text_25 = child(button_11);
  reset(button_11);
  next();
  reset(div_12);
  next();
  reset(div_11);
  next();
  reset(div_10);
  var node_12 = sibling(div_10, 2);
  {
    var consequent_14 = ($$anchor2) => {
      var fragment_17 = root_15();
      var p_10 = sibling(first_child(fragment_17));
      var text_26 = child(p_10, true);
      reset(p_10);
      next();
      template_effect(() => set_text(text_26, get2(listError)));
      append($$anchor2, fragment_17);
    };
    var consequent_15 = ($$anchor2) => {
      var fragment_18 = root_16();
      var p_11 = sibling(first_child(fragment_18));
      var text_27 = child(p_11, true);
      reset(p_11);
      next();
      template_effect(($0) => set_text(text_27, $0), [() => t("items.loading")]);
      append($$anchor2, fragment_18);
    };
    var consequent_16 = ($$anchor2) => {
      var fragment_19 = root_16();
      var p_12 = sibling(first_child(fragment_19));
      var text_28 = child(p_12, true);
      reset(p_12);
      next();
      template_effect(($0) => set_text(text_28, $0), [() => t("feeds.noFeeds")]);
      append($$anchor2, fragment_19);
    };
    var alternate_2 = ($$anchor2) => {
      var fragment_20 = root_20();
      var ul_1 = sibling(first_child(fragment_20));
      var node_13 = sibling(child(ul_1));
      each(node_13, 17, () => get2(feeds), (feed) => feed.id, ($$anchor3, feed) => {
        next();
        var fragment_21 = root_18();
        var li_1 = sibling(first_child(fragment_21));
        var p_13 = sibling(child(li_1));
        var text_29 = child(p_13, true);
        reset(p_13);
        var div_13 = sibling(p_13, 2);
        var div_14 = sibling(child(div_13));
        var button_12 = sibling(child(div_14));
        var node_14 = sibling(child(button_12));
        pencil_default(node_14, spread_props(() => iconProps));
        next();
        reset(button_12);
        var button_13 = sibling(button_12, 2);
        var node_15 = sibling(child(button_13));
        trash_2_default(node_15, spread_props(() => iconProps));
        next();
        reset(button_13);
        next();
        reset(div_14);
        var time = sibling(div_14, 2);
        var node_16 = sibling(child(time));
        {
          var consequent_17 = ($$anchor4) => {
            var text_30 = text();
            template_effect(($0) => set_text(text_30, `
                  ${$0 ?? ""}
                `), [() => formatTime(get2(feed).last_published_at, get2(now2))]);
            append($$anchor4, text_30);
          };
          var alternate_1 = ($$anchor4) => {
            var text_31 = text();
            template_effect(($0) => set_text(text_31, `
                  ${$0 ?? ""}
                `), [() => t("feeds.noPublished")]);
            append($$anchor4, text_31);
          };
          if_block(node_16, ($$render) => {
            if (get2(feed).last_published_at)
              $$render(consequent_17);
            else
              $$render(alternate_1, -1);
          });
        }
        next();
        reset(time);
        next();
        reset(div_13);
        var a = sibling(div_13, 2);
        var text_32 = child(a);
        reset(a);
        var node_17 = sibling(a, 2);
        {
          var consequent_18 = ($$anchor4) => {
            var fragment_24 = root_17();
            var p_14 = sibling(first_child(fragment_24));
            var text_33 = child(p_14);
            reset(p_14);
            next();
            template_effect(() => set_text(text_33, `
                ${get2(feed).description ?? ""}
              `));
            append($$anchor4, fragment_24);
          };
          if_block(node_17, ($$render) => {
            if (get2(feed).description)
              $$render(consequent_18);
          });
        }
        next();
        reset(li_1);
        next();
        template_effect(($0, $1, $2, $3, $4) => {
          set_text(text_29, get2(feed).title);
          set_attribute2(button_12, "aria-label", $0);
          set_attribute2(button_12, "title", $1);
          set_attribute2(button_13, "aria-label", $2);
          set_attribute2(button_13, "title", $3);
          set_attribute2(time, "datetime", get2(feed).last_published_at ?? undefined);
          set_attribute2(time, "title", $4);
          set_attribute2(a, "href", get2(feed).url);
          set_text(text_32, `
              ${get2(feed).url ?? ""}
            `);
        }, [
          () => t("feeds.edit"),
          () => t("feeds.edit"),
          () => t("feeds.delete"),
          () => t("feeds.delete"),
          () => t("feeds.lastPublished")
        ]);
        delegated("click", button_12, () => startEdit(get2(feed)));
        delegated("click", button_13, () => handleDelete(get2(feed).id));
        append($$anchor3, fragment_21);
      });
      next();
      reset(ul_1);
      var node_18 = sibling(ul_1, 2);
      {
        var consequent_19 = ($$anchor3) => {
          var fragment_25 = root_19();
          var p_15 = sibling(first_child(fragment_25));
          var text_34 = child(p_15);
          reset(p_15);
          next();
          template_effect(($0) => set_text(text_34, `
        ${$0 ?? ""}
      `), [() => t("feeds.loading")]);
          append($$anchor3, fragment_25);
        };
        var consequent_20 = ($$anchor3) => {
          var fragment_26 = root_19();
          var p_16 = sibling(first_child(fragment_26));
          var text_35 = child(p_16);
          reset(p_16);
          next();
          template_effect(($0) => set_text(text_35, `
        ${$0 ?? ""}
      `), [() => t("feeds.noMore")]);
          append($$anchor3, fragment_26);
        };
        if_block(node_18, ($$render) => {
          if (get2(loadingMore))
            $$render(consequent_19);
          else if (!get2(hasMore) && get2(feeds).length > 0)
            $$render(consequent_20, 1);
        });
      }
      var div_15 = sibling(node_18, 2);
      bind_this(div_15, ($$value) => set(sentinel, $$value), () => get2(sentinel));
      next();
      append($$anchor2, fragment_20);
    };
    if_block(node_12, ($$render) => {
      if (get2(listError))
        $$render(consequent_14);
      else if (get2(loading))
        $$render(consequent_15, 1);
      else if (get2(feeds).length === 0)
        $$render(consequent_16, 2);
      else
        $$render(alternate_2, -1);
    });
  }
  next();
  reset(section_1);
  template_effect(($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) => {
    set_attribute2(input, "placeholder", $0);
    input_1.readOnly = get2(isEditing);
    classes = set_class(input_1, 1, "w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100", null, classes, {
      "cursor-not-allowed": get2(isEditing),
      "text-neutral-400": get2(isEditing),
      "dark:text-neutral-500": get2(isEditing)
    });
    set_attribute2(input_2, "placeholder", $1);
    set_text(text2, `
        ${$2 ?? ""}
      `);
    set_text(text_22, `
      ${$3 ?? ""}
    `);
    button_9.disabled = get2(exportingOpml);
    set_attribute2(button_9, "aria-label", $4);
    set_attribute2(button_9, "title", $5);
    set_text(text_23, `
        ${$6 ?? ""}
      `);
    set_attribute2(div_12, "aria-label", $7);
    set_class(button_10, 1, `transition-colors ${get2(sort) === "updated_desc" ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"}`);
    set_attribute2(button_10, "aria-pressed", get2(sort) === "updated_desc");
    set_text(text_24, `
        ${$8 ?? ""}
      `);
    set_class(button_11, 1, `transition-colors ${get2(sort) === "published_desc" ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"}`);
    set_attribute2(button_11, "aria-pressed", get2(sort) === "published_desc");
    set_text(text_25, `
        ${$9 ?? ""}
      `);
  }, [
    () => t("feeds.name"),
    () => t("feeds.descriptionOptional"),
    () => get2(isEditing) ? t("feeds.save") : t("feeds.addFeed"),
    () => t("feeds.feedList"),
    () => t("feeds.exportOpml"),
    () => t("feeds.exportOpml"),
    () => get2(exportingOpml) ? t("feeds.exportingOpml") : t("feeds.exportOpml"),
    () => t("feeds.sortBy"),
    () => t("feeds.sortDefault"),
    () => t("feeds.sortByPublished")
  ]);
  event("submit", form, handleSubmit);
  delegated("input", input, () => set(titleTouched, true));
  bind_value(input, () => get2(title), ($$value) => set(title, $$value));
  delegated("input", input_1, onUrlInput);
  event("blur", input_1, onUrlBlur);
  bind_value(input_1, () => get2(url), ($$value) => set(url, $$value));
  delegated("input", input_2, () => set(descriptionTouched, true));
  bind_value(input_2, () => get2(description), ($$value) => set(description, $$value));
  delegated("click", button_9, () => void handleExportOpml());
  delegated("click", button_10, () => setSort("updated_desc"));
  delegated("click", button_11, () => setSort("published_desc"));
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var FeedsManager_default = FeedsManager;
delegate(["input", "click", "keydown"]);

// node_modules/svelte/src/internal/flags/legacy.js
enable_legacy_mode_flag();

// web/src/lib/fontSize.svelte.ts
var STORAGE_KEY3 = "nanoflux-font-size";
var MIGRATION_KEY = "nanoflux-font-size-v2";
function migrateStoredFontSize() {
  try {
    if (localStorage.getItem(MIGRATION_KEY))
      return;
    if (localStorage.getItem(STORAGE_KEY3) === "small") {
      localStorage.setItem(STORAGE_KEY3, "medium");
    }
    localStorage.setItem(MIGRATION_KEY, "1");
  } catch {}
}
function readStored3() {
  try {
    migrateStoredFontSize();
    const v = localStorage.getItem(STORAGE_KEY3);
    if (v === "small" || v === "medium" || v === "large")
      return v;
  } catch {}
  return null;
}
var fontSizeState = proxy({ mode: "medium", direction: "up" });
function applyFontSize(f) {
  if (typeof document === "undefined")
    return;
  const root14 = document.documentElement;
  root14.classList.toggle("font-small", f === "small");
  root14.classList.toggle("font-large", f === "large");
}
function initDirection(mode) {
  if (mode === "small")
    fontSizeState.direction = "up";
  else if (mode === "large")
    fontSizeState.direction = "down";
  else
    fontSizeState.direction = "up";
}
function initFontSize() {
  fontSizeState.mode = readStored3() ?? "medium";
  initDirection(fontSizeState.mode);
  applyFontSize(fontSizeState.mode);
}
function setFontSize(f) {
  fontSizeState.mode = f;
  initDirection(f);
  try {
    localStorage.setItem(STORAGE_KEY3, f);
  } catch {}
  applyFontSize(f);
}

// web/src/lib/theme.svelte.ts
var STORAGE_KEY4 = "nanoflux-theme";
function readStored4() {
  try {
    const v = localStorage.getItem(STORAGE_KEY4);
    if (v === "light" || v === "dark")
      return v;
  } catch {}
  return null;
}
function systemPrefersDark() {
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches;
}
var themeState = proxy({ mode: "light" });
function applyTheme(t2) {
  if (typeof document === "undefined")
    return;
  document.documentElement.classList.toggle("dark", t2 === "dark");
}
function initTheme() {
  themeState.mode = readStored4() ?? (systemPrefersDark() ? "dark" : "light");
  applyTheme(themeState.mode);
}
function setTheme(t2) {
  themeState.mode = t2;
  try {
    localStorage.setItem(STORAGE_KEY4, t2);
  } catch {}
  applyTheme(t2);
}
function toggleTheme() {
  setTheme(themeState.mode === "light" ? "dark" : "light");
}

// web/src/components/PreferencesManager.svelte
var root14 = from_html(`
          <button type="button"> </button>
        `, 1);
var root_110 = from_html(`

<section class="mb-10">
  <p class="mb-6 text-sm text-neutral-400 dark:text-neutral-500"> </p>
  <div class="space-y-8">
    <div class="space-y-3">
      <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" role="group">
        <!>
      </div>
    </div>

    <div class="space-y-3">
      <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" role="group">
        <!>
      </div>
    </div>

    <div class="space-y-3">
      <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" role="group">
        <!>
      </div>
    </div>
  </div>
</section>`, 1);
function PreferencesManager($$anchor, $$props) {
  push($$props, false);
  function optionClass(active) {
    return active ? "text-neutral-900 underline underline-offset-4 decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-100" : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300";
  }
  const fontOptions = [
    { id: "small", key: "font.small" },
    { id: "medium", key: "font.medium" },
    { id: "large", key: "font.large" }
  ];
  const localeOptions = [
    { id: "en", key: "lang.en" },
    { id: "zh-Hans", key: "lang.zhHans" },
    { id: "zh-Hant", key: "lang.zhHant" }
  ];
  const themeOptions = [
    { id: "light", key: "theme.lightMode" },
    { id: "dark", key: "theme.darkMode" }
  ];
  init();
  next();
  var fragment = root_110();
  var section = sibling(first_child(fragment));
  var p = sibling(child(section));
  var text2 = child(p);
  reset(p);
  var div = sibling(p, 2);
  var div_1 = sibling(child(div));
  var span = sibling(child(div_1));
  var text_1 = child(span);
  reset(span);
  var div_2 = sibling(span, 2);
  var node = sibling(child(div_2));
  each(node, 1, () => fontOptions, (option) => option.id, ($$anchor2, option) => {
    next();
    var fragment_1 = root14();
    var button = sibling(first_child(fragment_1));
    var text_2 = child(button);
    reset(button);
    next();
    template_effect(($0, $1) => {
      set_class(button, 1, `cursor-pointer transition-colors ${$0 ?? ""}`);
      set_attribute2(button, "aria-pressed", fontSizeState.mode === get2(option).id);
      set_text(text_2, `
            ${$1 ?? ""}
          `);
    }, [
      () => optionClass(fontSizeState.mode === get2(option).id),
      () => t(get2(option).key)
    ]);
    delegated("click", button, () => setFontSize(get2(option).id));
    append($$anchor2, fragment_1);
  });
  next();
  reset(div_2);
  next();
  reset(div_1);
  var div_3 = sibling(div_1, 2);
  var span_1 = sibling(child(div_3));
  var text_3 = child(span_1);
  reset(span_1);
  var div_4 = sibling(span_1, 2);
  var node_1 = sibling(child(div_4));
  each(node_1, 1, () => localeOptions, (option) => option.id, ($$anchor2, option) => {
    next();
    var fragment_2 = root14();
    var button_1 = sibling(first_child(fragment_2));
    var text_4 = child(button_1);
    reset(button_1);
    next();
    template_effect(($0, $1) => {
      set_class(button_1, 1, `cursor-pointer transition-colors ${$0 ?? ""}`);
      set_attribute2(button_1, "aria-pressed", localeState.locale === get2(option).id);
      set_text(text_4, `
            ${$1 ?? ""}
          `);
    }, [
      () => optionClass(localeState.locale === get2(option).id),
      () => t(get2(option).key)
    ]);
    delegated("click", button_1, () => setLocale(get2(option).id));
    append($$anchor2, fragment_2);
  });
  next();
  reset(div_4);
  next();
  reset(div_3);
  var div_5 = sibling(div_3, 2);
  var span_2 = sibling(child(div_5));
  var text_5 = child(span_2);
  reset(span_2);
  var div_6 = sibling(span_2, 2);
  var node_2 = sibling(child(div_6));
  each(node_2, 1, () => themeOptions, (option) => option.id, ($$anchor2, option) => {
    next();
    var fragment_3 = root14();
    var button_2 = sibling(first_child(fragment_3));
    var text_6 = child(button_2);
    reset(button_2);
    next();
    template_effect(($0, $1) => {
      set_class(button_2, 1, `cursor-pointer transition-colors ${$0 ?? ""}`);
      set_attribute2(button_2, "aria-pressed", themeState.mode === get2(option).id);
      set_text(text_6, `
            ${$1 ?? ""}
          `);
    }, [
      () => optionClass(themeState.mode === get2(option).id),
      () => t(get2(option).key)
    ]);
    delegated("click", button_2, () => setTheme(get2(option).id));
    append($$anchor2, fragment_3);
  });
  next();
  reset(div_6);
  next();
  reset(div_5);
  next();
  reset(div);
  next();
  reset(section);
  template_effect(($0, $1, $2, $3, $4, $5, $6) => {
    set_text(text2, `
    ${$0 ?? ""}
  `);
    set_text(text_1, `
        ${$1 ?? ""}
      `);
    set_attribute2(div_2, "aria-label", $2);
    set_text(text_3, `
        ${$3 ?? ""}
      `);
    set_attribute2(div_4, "aria-label", $4);
    set_text(text_5, `
        ${$5 ?? ""}
      `);
    set_attribute2(div_6, "aria-label", $6);
  }, [
    () => t("prefs.hint"),
    () => t("prefs.fontSize"),
    () => t("prefs.fontSize"),
    () => t("prefs.language"),
    () => t("prefs.language"),
    () => t("prefs.theme"),
    () => t("prefs.theme")
  ]);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var PreferencesManager_default = PreferencesManager;
delegate(["click"]);

// web/src/components/FiltersManager.svelte
var root15 = from_html(`
    <p class="text-sm text-neutral-300 dark:text-neutral-600"> </p>
  `, 1);
var root_112 = from_html(`
            <span class="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"> <button type="button" class="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">×</button>
            </span>
          `, 1);
var root_23 = from_html(`
    <div class="space-y-8">
      <div class="space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" role="group">
          <button type="button"> </button>
          <button type="button"> </button>
        </div>
      </div>

      <div class="space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
        <div class="flex min-h-11 flex-wrap items-center gap-2 border-b border-neutral-200 py-2 focus-within:border-neutral-900 dark:border-neutral-700 dark:focus-within:border-neutral-100">
          <!>
          <input class="min-w-40 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-600"/>
        </div>
      </div>

      <label class="block space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
        <textarea></textarea>
      </label>

      <label class="block space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
        <textarea></textarea>
      </label>

      <button type="button" class="text-sm text-neutral-900 underline-offset-4 hover:underline disabled:opacity-50 dark:text-neutral-100"> </button>
    </div>
  `, 1);
var root_32 = from_html(`
    <p class="mt-3 text-sm text-red-500"> </p>
  `, 1);
var root_42 = from_html(`

<section class="mb-10">
  <p class="mb-6 text-sm text-neutral-400 dark:text-neutral-500"> </p>
  <!>
  <!>
</section>`, 1);
function FiltersManager($$anchor, $$props) {
  push($$props, true);
  const inputClass = "w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100";
  const textareaClass = "min-h-48 resize-y " + inputClass;
  let prompt = state("");
  let enabled = state(false);
  let keywords = state("");
  let sources = state(proxy([]));
  let sourceInput = state("");
  let savedPrompt = state("");
  let savedEnabled = state(false);
  let savedKeywords = state("");
  let savedSources = state(proxy([]));
  let formError = state("");
  let loading = state(true);
  let saving = state(false);
  const isDirty = user_derived(() => get2(prompt).trim() !== get2(savedPrompt) || get2(enabled) !== get2(savedEnabled) || get2(keywords).trim() !== get2(savedKeywords) || get2(sources).join("\x00") !== get2(savedSources).join("\x00"));
  const saveDisabled = user_derived(() => get2(saving) || get2(loading) || !get2(isDirty));
  function toggleClass(active) {
    return active ? "text-neutral-900 underline underline-offset-4 decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-100" : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300";
  }
  async function loadFilter() {
    set(formError, "");
    set(loading, true);
    try {
      const filter = await fetchFilter();
      set(prompt, filter.prompt, true);
      set(enabled, filter.enabled, true);
      set(keywords, filter.keywords, true);
      set(sources, filter.sources, true);
      set(savedPrompt, filter.prompt, true);
      set(savedEnabled, filter.enabled, true);
      set(savedKeywords, filter.keywords, true);
      set(savedSources, filter.sources, true);
    } catch (e) {
      set(formError, e instanceof Error ? e.message : t("filters.loadFailed"), true);
    } finally {
      set(loading, false);
    }
  }
  async function handleSave() {
    if (get2(saveDisabled))
      return;
    set(formError, "");
    set(saving, true);
    try {
      const updated = await updateFilter({
        prompt: get2(prompt).trim(),
        enabled: get2(enabled),
        keywords: get2(keywords).trim(),
        sources: get2(sources)
      });
      set(prompt, updated.prompt, true);
      set(enabled, updated.enabled, true);
      set(savedPrompt, updated.prompt, true);
      set(savedEnabled, updated.enabled, true);
      set(keywords, updated.keywords, true);
      set(savedKeywords, updated.keywords, true);
      set(sources, updated.sources, true);
      set(savedSources, updated.sources, true);
    } catch (err) {
      set(formError, err instanceof Error ? err.message : t("filters.saveFailed"), true);
    } finally {
      set(saving, false);
    }
  }
  function addSource() {
    const candidates = get2(sourceInput).split(/[,，\s]+/).map((source2) => source2.trim().toLocaleLowerCase().replace(/^https?:\/\//, "").split("/")[0]?.replace(/^www\./, "") ?? "").filter(Boolean);
    if (candidates.length) {
      set(sources, [...new Set([...get2(sources), ...candidates])], true);
    }
    set(sourceInput, "");
  }
  function removeSource(source2) {
    set(sources, get2(sources).filter((item) => item !== source2), true);
  }
  function handleSourceKeydown(event2) {
    if (event2.key === "Enter" || event2.key === ",") {
      event2.preventDefault();
      addSource();
    }
    if (event2.key === "Backspace" && !get2(sourceInput) && get2(sources).length) {
      set(sources, get2(sources).slice(0, -1), true);
    }
  }
  onMount(() => {
    loadFilter();
  });
  next();
  var fragment = root_42();
  var section = sibling(first_child(fragment));
  var p = sibling(child(section));
  var text2 = child(p);
  reset(p);
  var node = sibling(p, 2);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root15();
      var p_1 = sibling(first_child(fragment_1));
      var text_1 = child(p_1, true);
      reset(p_1);
      next();
      template_effect(($0) => set_text(text_1, $0), [() => t("items.loading")]);
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var fragment_2 = root_23();
      var div = sibling(first_child(fragment_2));
      var div_1 = sibling(child(div));
      var span = sibling(child(div_1));
      var text_2 = child(span);
      reset(span);
      var div_2 = sibling(span, 2);
      var button = sibling(child(div_2));
      var text_3 = child(button);
      reset(button);
      var button_1 = sibling(button, 2);
      var text_4 = child(button_1);
      reset(button_1);
      next();
      reset(div_2);
      next();
      reset(div_1);
      var div_3 = sibling(div_1, 2);
      var span_1 = sibling(child(div_3));
      var text_5 = child(span_1);
      reset(span_1);
      var div_4 = sibling(span_1, 2);
      var node_1 = sibling(child(div_4));
      each(node_1, 17, () => get2(sources), index, ($$anchor3, source2) => {
        next();
        var fragment_3 = root_112();
        var span_2 = sibling(first_child(fragment_3));
        var text_6 = child(span_2);
        var button_2 = sibling(text_6);
        next();
        reset(span_2);
        next();
        template_effect(($0) => {
          set_text(text_6, `
              ${get2(source2) ?? ""}
              `);
          set_attribute2(button_2, "aria-label", $0);
          button_2.disabled = get2(saving);
        }, [() => `${t("filters.removeSource")} ${get2(source2)}`]);
        delegated("click", button_2, () => removeSource(get2(source2)));
        append($$anchor3, fragment_3);
      });
      var input = sibling(node_1, 2);
      remove_input_defaults(input);
      next();
      reset(div_4);
      next();
      reset(div_3);
      var label = sibling(div_3, 2);
      var span_3 = sibling(child(label));
      var text_7 = child(span_3);
      reset(span_3);
      var textarea = sibling(span_3, 2);
      remove_textarea_child(textarea);
      set_class(textarea, 1, "min-h-32 resize-y w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100");
      next();
      reset(label);
      var label_1 = sibling(label, 2);
      var span_4 = sibling(child(label_1));
      var text_8 = child(span_4);
      reset(span_4);
      var textarea_1 = sibling(span_4, 2);
      remove_textarea_child(textarea_1);
      set_class(textarea_1, 1, clsx2(textareaClass));
      next();
      reset(label_1);
      var button_3 = sibling(label_1, 2);
      var text_9 = child(button_3);
      reset(button_3);
      next();
      reset(div);
      next();
      template_effect(($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) => {
        set_text(text_2, `
          ${$0 ?? ""}
        `);
        set_attribute2(div_2, "aria-label", $1);
        set_class(button, 1, `transition-colors ${$2 ?? ""}`);
        set_attribute2(button, "aria-pressed", get2(enabled));
        button.disabled = get2(saving);
        set_text(text_3, `
            ${$3 ?? ""}
          `);
        set_class(button_1, 1, `transition-colors ${$4 ?? ""}`);
        set_attribute2(button_1, "aria-pressed", !get2(enabled));
        button_1.disabled = get2(saving);
        set_text(text_4, `
            ${$5 ?? ""}
          `);
        set_text(text_5, `
          ${$6 ?? ""}
        `);
        input.disabled = get2(saving);
        set_attribute2(input, "placeholder", $7);
        set_text(text_7, `
          ${$8 ?? ""}
        `);
        textarea.disabled = get2(saving);
        set_attribute2(textarea, "placeholder", $9);
        set_text(text_8, `
          ${$10 ?? ""}
        `);
        textarea_1.disabled = get2(saving);
        button_3.disabled = get2(saveDisabled);
        set_text(text_9, `
        ${$11 ?? ""}
      `);
      }, [
        () => t("filters.enabled"),
        () => t("filters.enabled"),
        () => toggleClass(get2(enabled)),
        () => t("filters.on"),
        () => toggleClass(!get2(enabled)),
        () => t("filters.off"),
        () => t("filters.sources"),
        () => t("filters.sourcesPlaceholder"),
        () => t("filters.keywords"),
        () => t("filters.keywordsPlaceholder"),
        () => t("filters.prompt"),
        () => get2(saving) ? t("filters.saving") : t("filters.save")
      ]);
      delegated("click", button, () => set(enabled, true));
      delegated("click", button_1, () => set(enabled, false));
      delegated("keydown", input, handleSourceKeydown);
      event("blur", input, addSource);
      bind_value(input, () => get2(sourceInput), ($$value) => set(sourceInput, $$value));
      bind_value(textarea, () => get2(keywords), ($$value) => set(keywords, $$value));
      bind_value(textarea_1, () => get2(prompt), ($$value) => set(prompt, $$value));
      delegated("click", button_3, () => void handleSave());
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if (get2(loading))
        $$render(consequent);
      else
        $$render(alternate, -1);
    });
  }
  var node_2 = sibling(node, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var fragment_4 = root_32();
      var p_2 = sibling(first_child(fragment_4));
      var text_10 = child(p_2, true);
      reset(p_2);
      next();
      template_effect(() => set_text(text_10, get2(formError)));
      append($$anchor2, fragment_4);
    };
    if_block(node_2, ($$render) => {
      if (get2(formError))
        $$render(consequent_1);
    });
  }
  next();
  reset(section);
  template_effect(($0) => set_text(text2, `
    ${$0 ?? ""}
  `), [() => t("filters.hint")]);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var FiltersManager_default = FiltersManager;
delegate(["click", "keydown"]);

// web/src/components/TranslateManager.svelte
var root16 = from_html(`
    <p class="text-sm text-neutral-300 dark:text-neutral-600"> </p>
  `, 1);
var root_113 = from_html(`
            <button type="button"> </button>
          `, 1);
var root_24 = from_html(`
    <div class="space-y-8">
      <div class="space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" role="group">
          <button type="button"> </button>
          <button type="button"> </button>
        </div>
      </div>

      <div class="space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" role="group">
          <!>
        </div>
      </div>

      <label class="block space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
        <textarea></textarea>
      </label>

      <button type="button" class="text-sm text-neutral-900 underline-offset-4 hover:underline disabled:opacity-50 dark:text-neutral-100"> </button>
    </div>
  `, 1);
var root_33 = from_html(`
    <p class="mt-3 text-sm text-red-500"> </p>
  `, 1);
var root_43 = from_html(`

<section class="mb-10">
  <p class="mb-6 text-sm text-neutral-400 dark:text-neutral-500"> </p>
  <!>
  <!>
</section>`, 1);
function TranslateManager($$anchor, $$props) {
  push($$props, true);
  const inputClass = "w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100";
  const textareaClass = "min-h-48 resize-y " + inputClass;
  let prompt = state("");
  let enabled = state(false);
  let targetLang = state("zh-Hans");
  let savedPrompt = state("");
  let savedEnabled = state(false);
  let savedTargetLang = state("zh-Hans");
  let formError = state("");
  let loading = state(true);
  let saving = state(false);
  const isDirty = user_derived(() => get2(prompt).trim() !== get2(savedPrompt) || get2(enabled) !== get2(savedEnabled) || get2(targetLang) !== get2(savedTargetLang));
  const saveDisabled = user_derived(() => get2(saving) || get2(loading) || !get2(isDirty));
  function toggleClass(active) {
    return active ? "text-neutral-900 underline underline-offset-4 decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-100" : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300";
  }
  async function loadTranslate() {
    set(formError, "");
    set(loading, true);
    try {
      const config = await fetchTranslate();
      set(prompt, config.prompt, true);
      set(enabled, config.enabled, true);
      set(targetLang, config.targetLang, true);
      set(savedPrompt, config.prompt, true);
      set(savedEnabled, config.enabled, true);
      set(savedTargetLang, config.targetLang, true);
    } catch (e) {
      set(formError, e instanceof Error ? e.message : t("translate.loadFailed"), true);
    } finally {
      set(loading, false);
    }
  }
  async function handleSave() {
    if (get2(saveDisabled))
      return;
    set(formError, "");
    set(saving, true);
    try {
      const updated = await updateTranslate({
        prompt: get2(prompt).trim(),
        enabled: get2(enabled),
        targetLang: get2(targetLang)
      });
      set(prompt, updated.prompt, true);
      set(enabled, updated.enabled, true);
      set(targetLang, updated.targetLang, true);
      set(savedPrompt, updated.prompt, true);
      set(savedEnabled, updated.enabled, true);
      set(savedTargetLang, updated.targetLang, true);
    } catch (err) {
      set(formError, err instanceof Error ? err.message : t("translate.saveFailed"), true);
    } finally {
      set(saving, false);
    }
  }
  onMount(() => {
    loadTranslate();
  });
  next();
  var fragment = root_43();
  var section = sibling(first_child(fragment));
  var p = sibling(child(section));
  var text2 = child(p);
  reset(p);
  var node = sibling(p, 2);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root16();
      var p_1 = sibling(first_child(fragment_1));
      var text_1 = child(p_1, true);
      reset(p_1);
      next();
      template_effect(($0) => set_text(text_1, $0), [() => t("items.loading")]);
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var fragment_2 = root_24();
      var div = sibling(first_child(fragment_2));
      var div_1 = sibling(child(div));
      var span = sibling(child(div_1));
      var text_2 = child(span);
      reset(span);
      var div_2 = sibling(span, 2);
      var button = sibling(child(div_2));
      var text_3 = child(button);
      reset(button);
      var button_1 = sibling(button, 2);
      var text_4 = child(button_1);
      reset(button_1);
      next();
      reset(div_2);
      next();
      reset(div_1);
      var div_3 = sibling(div_1, 2);
      var span_1 = sibling(child(div_3));
      var text_5 = child(span_1);
      reset(span_1);
      var div_4 = sibling(span_1, 2);
      var node_1 = sibling(child(div_4));
      each(node_1, 16, () => TRANSLATE_TARGET_LANGS, (lang) => lang, ($$anchor3, lang) => {
        next();
        var fragment_3 = root_113();
        var button_2 = sibling(first_child(fragment_3));
        var text_6 = child(button_2);
        reset(button_2);
        next();
        template_effect(($0, $1) => {
          set_class(button_2, 1, `transition-colors ${$0 ?? ""}`);
          set_attribute2(button_2, "aria-pressed", get2(targetLang) === lang);
          button_2.disabled = get2(saving);
          set_text(text_6, `
              ${$1 ?? ""}
            `);
        }, [
          () => toggleClass(get2(targetLang) === lang),
          () => t(lang === "en" ? "translate.langEn" : lang === "zh-Hans" ? "translate.langZhHans" : "translate.langZhHant")
        ]);
        delegated("click", button_2, () => set(targetLang, lang, true));
        append($$anchor3, fragment_3);
      });
      next();
      reset(div_4);
      next();
      reset(div_3);
      var label = sibling(div_3, 2);
      var span_2 = sibling(child(label));
      var text_7 = child(span_2);
      reset(span_2);
      var textarea = sibling(span_2, 2);
      remove_textarea_child(textarea);
      set_class(textarea, 1, clsx2(textareaClass));
      next();
      reset(label);
      var button_3 = sibling(label, 2);
      var text_8 = child(button_3);
      reset(button_3);
      next();
      reset(div);
      next();
      template_effect(($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) => {
        set_text(text_2, `
          ${$0 ?? ""}
        `);
        set_attribute2(div_2, "aria-label", $1);
        set_class(button, 1, `transition-colors ${$2 ?? ""}`);
        set_attribute2(button, "aria-pressed", get2(enabled));
        button.disabled = get2(saving);
        set_text(text_3, `
            ${$3 ?? ""}
          `);
        set_class(button_1, 1, `transition-colors ${$4 ?? ""}`);
        set_attribute2(button_1, "aria-pressed", !get2(enabled));
        button_1.disabled = get2(saving);
        set_text(text_4, `
            ${$5 ?? ""}
          `);
        set_text(text_5, `
          ${$6 ?? ""}
        `);
        set_attribute2(div_4, "aria-label", $7);
        set_text(text_7, `
          ${$8 ?? ""}
        `);
        textarea.disabled = get2(saving);
        button_3.disabled = get2(saveDisabled);
        set_text(text_8, `
        ${$9 ?? ""}
      `);
      }, [
        () => t("translate.enabled"),
        () => t("translate.enabled"),
        () => toggleClass(get2(enabled)),
        () => t("translate.on"),
        () => toggleClass(!get2(enabled)),
        () => t("translate.off"),
        () => t("translate.targetLang"),
        () => t("translate.targetLang"),
        () => t("translate.prompt"),
        () => get2(saving) ? t("translate.saving") : t("translate.save")
      ]);
      delegated("click", button, () => set(enabled, true));
      delegated("click", button_1, () => set(enabled, false));
      bind_value(textarea, () => get2(prompt), ($$value) => set(prompt, $$value));
      delegated("click", button_3, () => void handleSave());
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if (get2(loading))
        $$render(consequent);
      else
        $$render(alternate, -1);
    });
  }
  var node_2 = sibling(node, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var fragment_4 = root_33();
      var p_2 = sibling(first_child(fragment_4));
      var text_9 = child(p_2, true);
      reset(p_2);
      next();
      template_effect(() => set_text(text_9, get2(formError)));
      append($$anchor2, fragment_4);
    };
    if_block(node_2, ($$render) => {
      if (get2(formError))
        $$render(consequent_1);
    });
  }
  next();
  reset(section);
  template_effect(($0) => set_text(text2, `
    ${$0 ?? ""}
  `), [() => t("translate.hint")]);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var TranslateManager_default = TranslateManager;
delegate(["click"]);

// shared/password-strength.ts
function isStrongPassword(password) {
  if (password.length < 8)
    return false;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  return hasLetter && hasDigit && hasSymbol;
}

// web/src/components/FeverManager.svelte
var root17 = from_html(`
    <p class="text-sm text-neutral-300 dark:text-neutral-600"> </p>
  `, 1);
var root_114 = from_html(`
    <div class="space-y-8">
      <div class="space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" role="group">
          <button type="button"> </button>
          <button type="button"> </button>
        </div>
      </div>

      <label class="block space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
        <input type="text" autocomplete="username"/>
      </label>

      <label class="block space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
        <input type="password" autocomplete="new-password"/>
      </label>

      <div class="space-y-2">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
        <p class="break-all text-sm text-neutral-600 dark:text-neutral-300"> </p>
      </div>

      <button type="button" class="text-sm text-neutral-900 underline-offset-4 hover:underline disabled:opacity-50 dark:text-neutral-100"> </button>
    </div>
  `, 1);
var root_25 = from_html(`
    <p class="mt-3 text-sm text-red-500"> </p>
  `, 1);
var root_34 = from_html(`

<section class="mb-10">
  <p class="mb-6 text-sm text-neutral-400 dark:text-neutral-500"> </p>
  <!>
  <!>
</section>`, 1);
function FeverManager($$anchor, $$props) {
  push($$props, true);
  const inputClass = "w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100";
  let enabled = state(false);
  let user = state("");
  let password = state("");
  let hasPassword = state(false);
  let savedEnabled = state(false);
  let savedUser = state("");
  let formError = state("");
  let loading = state(true);
  let saving = state(false);
  const endpointUrl = user_derived(() => typeof window === "undefined" ? "/fever/" : `${window.location.origin}/fever/`);
  const isDirty = user_derived(() => get2(enabled) !== get2(savedEnabled) || get2(user).trim() !== get2(savedUser) || get2(password).length > 0);
  const saveDisabled = user_derived(() => get2(saving) || get2(loading) || !get2(isDirty));
  function toggleClass(active) {
    return active ? "text-neutral-900 underline underline-offset-4 decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-100" : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300";
  }
  async function loadFever() {
    set(formError, "");
    set(loading, true);
    try {
      const config = await fetchFever();
      set(enabled, config.enabled, true);
      set(user, config.user, true);
      set(hasPassword, config.hasPassword, true);
      set(password, "");
      set(savedEnabled, config.enabled, true);
      set(savedUser, config.user, true);
    } catch (e) {
      set(formError, e instanceof Error ? e.message : t("fever.loadFailed"), true);
    } finally {
      set(loading, false);
    }
  }
  async function handleSave() {
    if (get2(saveDisabled))
      return;
    set(formError, "");
    if (get2(enabled) && !get2(user).trim()) {
      set(formError, t("fever.userRequired"), true);
      return;
    }
    if (get2(enabled) && !get2(hasPassword) && !get2(password)) {
      set(formError, t("fever.passwordRequired"), true);
      return;
    }
    if (get2(password).length > 0 && !isStrongPassword(get2(password))) {
      set(formError, t("fever.passwordWeak"), true);
      return;
    }
    set(saving, true);
    try {
      const payload = { enabled: get2(enabled), user: get2(user).trim() };
      if (get2(password).length > 0) {
        payload.password = get2(password);
      }
      const updated = await updateFever(payload);
      set(enabled, updated.enabled, true);
      set(user, updated.user, true);
      set(hasPassword, updated.hasPassword, true);
      set(password, "");
      set(savedEnabled, updated.enabled, true);
      set(savedUser, updated.user, true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      set(formError, message.includes("at least 8 characters") ? t("fever.passwordWeak") : message || t("fever.saveFailed"), true);
    } finally {
      set(saving, false);
    }
  }
  onMount(() => {
    loadFever();
  });
  next();
  var fragment = root_34();
  var section = sibling(first_child(fragment));
  var p = sibling(child(section));
  var text2 = child(p);
  reset(p);
  var node = sibling(p, 2);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root17();
      var p_1 = sibling(first_child(fragment_1));
      var text_1 = child(p_1, true);
      reset(p_1);
      next();
      template_effect(($0) => set_text(text_1, $0), [() => t("items.loading")]);
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var fragment_2 = root_114();
      var div = sibling(first_child(fragment_2));
      var div_1 = sibling(child(div));
      var span = sibling(child(div_1));
      var text_2 = child(span);
      reset(span);
      var div_2 = sibling(span, 2);
      var button = sibling(child(div_2));
      var text_3 = child(button);
      reset(button);
      var button_1 = sibling(button, 2);
      var text_4 = child(button_1);
      reset(button_1);
      next();
      reset(div_2);
      next();
      reset(div_1);
      var label = sibling(div_1, 2);
      var span_1 = sibling(child(label));
      var text_5 = child(span_1);
      reset(span_1);
      var input = sibling(span_1, 2);
      remove_input_defaults(input);
      set_class(input, 1, clsx2(inputClass));
      next();
      reset(label);
      var label_1 = sibling(label, 2);
      var span_2 = sibling(child(label_1));
      var text_6 = child(span_2);
      reset(span_2);
      var input_1 = sibling(span_2, 2);
      remove_input_defaults(input_1);
      set_class(input_1, 1, clsx2(inputClass));
      next();
      reset(label_1);
      var div_3 = sibling(label_1, 2);
      var span_3 = sibling(child(div_3));
      var text_7 = child(span_3);
      reset(span_3);
      var p_2 = sibling(span_3, 2);
      var text_8 = child(p_2, true);
      reset(p_2);
      next();
      reset(div_3);
      var button_2 = sibling(div_3, 2);
      var text_9 = child(button_2);
      reset(button_2);
      next();
      reset(div);
      next();
      template_effect(($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) => {
        set_text(text_2, `
          ${$0 ?? ""}
        `);
        set_attribute2(div_2, "aria-label", $1);
        set_class(button, 1, `transition-colors ${$2 ?? ""}`);
        set_attribute2(button, "aria-pressed", get2(enabled));
        button.disabled = get2(saving);
        set_text(text_3, `
            ${$3 ?? ""}
          `);
        set_class(button_1, 1, `transition-colors ${$4 ?? ""}`);
        set_attribute2(button_1, "aria-pressed", !get2(enabled));
        button_1.disabled = get2(saving);
        set_text(text_4, `
            ${$5 ?? ""}
          `);
        set_text(text_5, `
          ${$6 ?? ""}
        `);
        input.disabled = get2(saving);
        set_text(text_6, `
          ${$7 ?? ""}
        `);
        set_attribute2(input_1, "placeholder", $8);
        input_1.disabled = get2(saving);
        set_text(text_7, `
          ${$9 ?? ""}
        `);
        set_text(text_8, get2(endpointUrl));
        button_2.disabled = get2(saveDisabled);
        set_text(text_9, `
        ${$10 ?? ""}
      `);
      }, [
        () => t("fever.enabled"),
        () => t("fever.enabled"),
        () => toggleClass(get2(enabled)),
        () => t("fever.on"),
        () => toggleClass(!get2(enabled)),
        () => t("fever.off"),
        () => t("fever.user"),
        () => t("fever.password"),
        () => get2(hasPassword) ? t("fever.passwordKeep") : "",
        () => t("fever.endpoint"),
        () => get2(saving) ? t("fever.saving") : t("fever.save")
      ]);
      delegated("click", button, () => set(enabled, true));
      delegated("click", button_1, () => set(enabled, false));
      bind_value(input, () => get2(user), ($$value) => set(user, $$value));
      bind_value(input_1, () => get2(password), ($$value) => set(password, $$value));
      delegated("click", button_2, () => void handleSave());
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if (get2(loading))
        $$render(consequent);
      else
        $$render(alternate, -1);
    });
  }
  var node_1 = sibling(node, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var fragment_3 = root_25();
      var p_3 = sibling(first_child(fragment_3));
      var text_10 = child(p_3, true);
      reset(p_3);
      next();
      template_effect(() => set_text(text_10, get2(formError)));
      append($$anchor2, fragment_3);
    };
    if_block(node_1, ($$render) => {
      if (get2(formError))
        $$render(consequent_1);
    });
  }
  next();
  reset(section);
  template_effect(($0) => set_text(text2, `
    ${$0 ?? ""}
  `), [() => t("fever.hint")]);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var FeverManager_default = FeverManager;
delegate(["click"]);

// web/src/components/SettingsManager.svelte
var root18 = from_html(`
        <button type="button" role="tab"> </button>
      `, 1);
var root_115 = from_html(`
        <!>
      `, 1);
var root_26 = from_html(`

<div class="flex min-w-0 flex-1 flex-col md:flex-row">
  <aside class="px-5 py-4 md:sticky md:top-4 md:m-4 md:flex md:h-[calc(100vh-2rem)] md:w-40 md:shrink-0 md:flex-col md:px-5 md:py-8">
    <nav class="flex min-w-0 gap-1 overflow-x-auto text-sm md:flex-col md:overflow-visible" role="tablist">
      <!>
    </nav>
  </aside>

  <div class="min-w-0 flex-1">
    <div class="mx-auto max-w-page px-5 py-10 md:py-16">
      <!>
    </div>
  </div>
</div>`, 1);
function SettingsManager($$anchor, $$props) {
  push($$props, true);
  let tab = state(proxy(settingsTabFromLocation()));
  const tabs = [
    { id: "preferences", key: "items.preferences" },
    { id: "filter", key: "items.filter" },
    { id: "translate", key: "items.translate" },
    { id: "fever", key: "items.fever" }
  ];
  function tabClass(active) {
    return `shrink-0 px-2 py-1.5 text-sm transition-colors md:w-full md:text-left ${active ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100"}`;
  }
  function selectTab(next2) {
    if (get2(tab) === next2)
      return;
    set(tab, next2, true);
    setSettingsTab(next2);
  }
  onMount(() => {
    set(tab, settingsTabFromLocation(), true);
    const onHash = () => {
      set(tab, settingsTabFromLocation(), true);
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
    };
  });
  next();
  var fragment = root_26();
  var div = sibling(first_child(fragment));
  var aside = sibling(child(div));
  var nav = sibling(child(aside));
  var node = sibling(child(nav));
  each(node, 17, () => tabs, (item) => item.id, ($$anchor2, item) => {
    next();
    var fragment_1 = root18();
    var button = sibling(first_child(fragment_1));
    var text2 = child(button);
    reset(button);
    next();
    template_effect(($0, $1) => {
      set_class(button, 1, $0);
      set_attribute2(button, "aria-selected", get2(tab) === get2(item).id);
      set_text(text2, `
          ${$1 ?? ""}
        `);
    }, [
      () => clsx2(tabClass(get2(tab) === get2(item).id)),
      () => t(get2(item).key)
    ]);
    delegated("click", button, () => selectTab(get2(item).id));
    append($$anchor2, fragment_1);
  });
  next();
  reset(nav);
  next();
  reset(aside);
  var div_1 = sibling(aside, 2);
  var div_2 = sibling(child(div_1));
  var node_1 = sibling(child(div_2));
  {
    var consequent = ($$anchor2) => {
      var fragment_2 = root_115();
      var node_2 = sibling(first_child(fragment_2));
      PreferencesManager_default(node_2, {});
      next();
      append($$anchor2, fragment_2);
    };
    var consequent_1 = ($$anchor2) => {
      var fragment_3 = root_115();
      var node_3 = sibling(first_child(fragment_3));
      FiltersManager_default(node_3, {});
      next();
      append($$anchor2, fragment_3);
    };
    var consequent_2 = ($$anchor2) => {
      var fragment_4 = root_115();
      var node_4 = sibling(first_child(fragment_4));
      TranslateManager_default(node_4, {});
      next();
      append($$anchor2, fragment_4);
    };
    var alternate = ($$anchor2) => {
      var fragment_5 = root_115();
      var node_5 = sibling(first_child(fragment_5));
      FeverManager_default(node_5, {});
      next();
      append($$anchor2, fragment_5);
    };
    if_block(node_1, ($$render) => {
      if (get2(tab) === "preferences")
        $$render(consequent);
      else if (get2(tab) === "filter")
        $$render(consequent_1, 1);
      else if (get2(tab) === "translate")
        $$render(consequent_2, 2);
      else
        $$render(alternate, -1);
    });
  }
  next();
  reset(div_2);
  next();
  reset(div_1);
  next();
  reset(div);
  template_effect(($0) => set_attribute2(nav, "aria-label", $0), [() => t("items.settings")]);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var SettingsManager_default = SettingsManager;
delegate(["click"]);

// web/src/components/ExportPage.svelte
var root19 = from_html(`
      <p class="text-sm text-red-500"> </p>
    `, 1);
var root_116 = from_html(`

<section class="space-y-8">
  <p class="text-sm text-neutral-400 dark:text-neutral-500"> </p>

  <div class="grid gap-6 sm:grid-cols-2">
    <label class="block space-y-2">
      <span class="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
      <!-- lang="sv-SE" forces a 24-hour, ISO-style (yyyy-mm-dd HH:mm) picker. -->
      <input type="datetime-local" lang="sv-SE"/>
    </label>
    <label class="block space-y-2">
      <span class="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"> </span>
      <input type="datetime-local" lang="sv-SE"/>
    </label>
  </div>

  <div class="flex items-center gap-4">
    <button type="button" class="inline-flex items-center gap-1.5 text-sm text-neutral-900 underline-offset-4 hover:underline disabled:opacity-50 dark:text-neutral-100">
      <!> </button>
    <!>
  </div>
</section>`, 1);
function ExportPage($$anchor, $$props) {
  push($$props, true);
  function toDatetimeLocal(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  const nowDate = new Date;
  let start = state(proxy(toDatetimeLocal(new Date(nowDate.getTime() - 24 * 60 * 60 * 1000))));
  let end = state(proxy(toDatetimeLocal(nowDate)));
  let exporting = state(false);
  let error = state("");
  const inputClass = "w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100";
  function toIso(local) {
    if (!local)
      return;
    const ms = Date.parse(local);
    if (Number.isNaN(ms))
      return;
    return new Date(ms).toISOString();
  }
  async function handleExport() {
    if (get2(exporting))
      return;
    set(error, "");
    const since = toIso(get2(start));
    const until = toIso(get2(end));
    if (since && until && since > until) {
      set(error, t("export.invalidRange"), true);
      return;
    }
    set(exporting, true);
    try {
      await downloadItemsExcel({ since, until });
    } catch (e) {
      set(error, e instanceof Error ? e.message : t("export.failed"), true);
    } finally {
      set(exporting, false);
    }
  }
  next();
  var fragment = root_116();
  var section = sibling(first_child(fragment));
  var p = sibling(child(section));
  var text2 = child(p);
  reset(p);
  var div = sibling(p, 2);
  var label = sibling(child(div));
  var span = sibling(child(label));
  var text_1 = child(span);
  reset(span);
  var node = sibling(span, 2);
  var input = sibling(node, 2);
  remove_input_defaults(input);
  set_class(input, 1, clsx2(inputClass));
  next();
  reset(label);
  var label_1 = sibling(label, 2);
  var span_1 = sibling(child(label_1));
  var text_2 = child(span_1);
  reset(span_1);
  var input_1 = sibling(span_1, 2);
  remove_input_defaults(input_1);
  set_class(input_1, 1, clsx2(inputClass));
  next();
  reset(label_1);
  next();
  reset(div);
  var div_1 = sibling(div, 2);
  var button = sibling(child(div_1));
  var node_1 = sibling(child(button));
  download_default(node_1, { size: 16, strokeWidth: 1.5, "aria-hidden": "true" });
  var text_3 = sibling(node_1);
  reset(button);
  var node_2 = sibling(button, 2);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root19();
      var p_1 = sibling(first_child(fragment_1));
      var text_4 = child(p_1, true);
      reset(p_1);
      next();
      template_effect(() => set_text(text_4, get2(error)));
      append($$anchor2, fragment_1);
    };
    if_block(node_2, ($$render) => {
      if (get2(error))
        $$render(consequent);
    });
  }
  next();
  reset(div_1);
  next();
  reset(section);
  template_effect(($0, $1, $2, $3) => {
    set_text(text2, `
    ${$0 ?? ""}
  `);
    set_text(text_1, `
        ${$1 ?? ""}
      `);
    set_text(text_2, `
        ${$2 ?? ""}
      `);
    button.disabled = get2(exporting);
    set_text(text_3, `
      ${$3 ?? ""}
    `);
  }, [
    () => t("export.hint"),
    () => t("export.startTime"),
    () => t("export.endTime"),
    () => get2(exporting) ? t("export.exporting") : t("export.button")
  ]);
  bind_value(input, () => get2(start), ($$value) => set(start, $$value));
  bind_value(input_1, () => get2(end), ($$value) => set(end, $$value));
  delegated("click", button, () => void handleExport());
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var ExportPage_default = ExportPage;
delegate(["click"]);

// node_modules/@lucide/svelte/dist/icons/ban.svelte
var rest_excludes11 = new Set(["$$slots", "$$events", "$$legacy"]);
var root20 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNNC45MjkgNC45MjkgMTkuMDcgMTkuMDcxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/ban
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Ban($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes11);
  const iconNode = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M4.929 4.929 19.07 19.071" }]
  ];
  var fragment = root20();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "ban" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var ban_default = Ban;
// node_modules/@lucide/svelte/dist/icons/eye.svelte
var rest_excludes12 = new Set(["$$slots", "$$events", "$$legacy"]);
var root21 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Eye($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes12);
  const iconNode = [
    [
      "path",
      {
        d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3" }]
  ];
  var fragment = root21();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "eye" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var eye_default = Eye;
// node_modules/@lucide/svelte/dist/icons/eye-closed.svelte
var rest_excludes13 = new Set(["$$slots", "$$events", "$$legacy"]);
var root22 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUgMTgtLjcyMi0zLjI1IiAvPgogIDxwYXRoIGQ9Ik0yIDhhMTAuNjQ1IDEwLjY0NSAwIDAgMCAyMCAwIiAvPgogIDxwYXRoIGQ9Im0yMCAxNS0xLjcyNi0yLjA1IiAvPgogIDxwYXRoIGQ9Im00IDE1IDEuNzI2LTIuMDUiIC8+CiAgPHBhdGggZD0ibTkgMTggLjcyMi0zLjI1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye-closed
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Eye_closed($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes13);
  const iconNode = [
    ["path", { d: "m15 18-.722-3.25" }],
    ["path", { d: "M2 8a10.645 10.645 0 0 0 20 0" }],
    ["path", { d: "m20 15-1.726-2.05" }],
    ["path", { d: "m4 15 1.726-2.05" }],
    ["path", { d: "m9 18 .722-3.25" }]
  ];
  var fragment = root22();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "eye-closed" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var eye_closed_default = Eye_closed;
// web/src/components/buttons/ItemFilterToggle.svelte
var root23 = from_html(`
    <!>
  `, 1);
var root_117 = from_html(`

<button type="button">
  <!>
</button>`, 1);
function ItemFilterToggle($$anchor, $$props) {
  push($$props, true);
  const iconProps = { size: 18, strokeWidth: 1.5, "aria-hidden": true };
  const label = user_derived(() => $$props.filter === "unread" ? t("items.switchToAll") : t("items.switchToUnread"));
  const title = user_derived(() => $$props.filter === "unread" ? t("items.filterUnread") : t("items.filterAll"));
  next();
  var fragment = root_117();
  var button = sibling(first_child(fragment));
  var node = sibling(child(button));
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root23();
      var node_1 = sibling(first_child(fragment_1));
      eye_default(node_1, spread_props(() => iconProps));
      next();
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var fragment_2 = root23();
      var node_2 = sibling(first_child(fragment_2));
      eye_closed_default(node_2, spread_props(() => iconProps));
      next();
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if ($$props.filter === "unread")
        $$render(consequent);
      else
        $$render(alternate, -1);
    });
  }
  next();
  reset(button);
  template_effect(() => {
    set_class(button, 1, `inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors ${$$props.filter === "unread" ? "text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800" : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"}`);
    set_attribute2(button, "aria-label", get2(label));
    set_attribute2(button, "aria-pressed", $$props.filter === "unread");
    set_attribute2(button, "title", get2(title));
  });
  delegated("click", button, function(...$$args) {
    $$props.onToggle?.apply(this, $$args);
  });
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var ItemFilterToggle_default = ItemFilterToggle;
delegate(["click"]);

// node_modules/@lucide/svelte/dist/icons/check-check.svelte
var rest_excludes14 = new Set(["$$slots", "$$events", "$$legacy"]);
var root24 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNiA3IDE3bC01LTUiIC8+CiAgPHBhdGggZD0ibTIyIDEwLTcuNSA3LjVMMTMgMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/check-check
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Check_check($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes14);
  const iconNode = [
    ["path", { d: "M18 6 7 17l-5-5" }],
    ["path", { d: "m22 10-7.5 7.5L13 16" }]
  ];
  var fragment = root24();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "check-check" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var check_check_default = Check_check;
// web/src/components/buttons/MarkAllReadButton.svelte
var root25 = from_html(`

<button type="button" class="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100">
  <!>
</button>`, 1);
function MarkAllReadButton($$anchor, $$props) {
  push($$props, true);
  const iconProps = { size: 18, strokeWidth: 1.5, "aria-hidden": true };
  const label = user_derived(() => t("items.markAllRead"));
  next();
  var fragment = root25();
  var button = sibling(first_child(fragment));
  var node = sibling(child(button));
  check_check_default(node, spread_props(() => iconProps));
  next();
  reset(button);
  template_effect(() => {
    set_attribute2(button, "aria-label", get2(label));
    set_attribute2(button, "title", get2(label));
  });
  delegated("click", button, () => void $$props.onMarkAllRead());
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var MarkAllReadButton_default = MarkAllReadButton;
delegate(["click"]);

// web/src/components/ItemList.svelte
var root26 = from_html(`
  <p class="py-6 text-sm text-red-500"> </p>
`, 1);
var root_118 = from_html(`
  <p class="text-sm text-neutral-300 dark:text-neutral-600"> </p>
`, 1);
var root_27 = from_html(`
              <p class="mt-2 line-clamp-2 text-sm text-neutral-400 dark:text-neutral-500"> </p>
            `, 1);
var root_35 = from_html(`
              <p class="group mt-2 flex h-4 items-center gap-1 text-xs leading-4 text-neutral-400 dark:text-neutral-500">
                <span> </span>
                <button type="button" class="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded p-0 text-neutral-400 opacity-0 transition-[color,background-color,opacity] group-hover:opacity-100 focus-visible:opacity-100 hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-50 dark:hover:bg-red-950/40 dark:hover:text-red-400">
                  <!>
                </button>
              </p>
            `, 1);
var root_44 = from_html(`
            <a target="_blank" rel="noopener noreferrer" class="block aspect-[4/3] w-50 shrink-0 overflow-hidden rounded-md" tabindex="-1" aria-hidden="true">
              <img alt="" class="h-full w-full bg-neutral-100 object-cover dark:bg-neutral-800" loading="lazy" referrerpolicy="no-referrer"/>
            </a>
          `, 1);
var root_52 = from_html(`
      <li class="py-5">
        <article class="flex items-start gap-4">
          <div class="min-w-0 flex-1">
            <div class="flex items-baseline gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
              <time> </time>
              <span class="text-neutral-300 dark:text-neutral-600" aria-hidden="true">·</span>
              <span> </span>
            </div>
            <a target="_blank" rel="noopener noreferrer"> </a>
            <!>
            <!>
          </div>
          <!>
        </article>
      </li>
    `, 1);
var root_62 = from_html(`
  <ul class="divide-y divide-neutral-100 dark:divide-neutral-800">
    <!>
  </ul>
`, 1);
var root_72 = from_html(`
  <p class="py-8 text-center text-sm text-neutral-300 dark:text-neutral-600"> </p>
`, 1);
var root_82 = from_html(`

<div class="mb-6 flex items-center justify-end gap-0.5">
  <!>
  <!>
</div>

<!>

<!>

<div class="h-1" aria-hidden="true"></div>`, 1);
function ItemList($$anchor, $$props) {
  push($$props, true);
  const PAGE_SIZE = 20;
  let items = state(proxy([]));
  let cursor = state(null);
  let hasMore = state(true);
  let loading = state(false);
  let error = state("");
  let sentinel = state(null);
  let filter = state("unread");
  let loadGeneration = 0;
  let blockingSources = state(proxy(new Set));
  let failedCovers = state(proxy(new Set));
  let now2 = state(proxy(Date.now()));
  const filterIsRead = user_derived(() => get2(filter) === "unread" ? 0 : undefined);
  function resetList() {
    set(items, [], true);
    set(cursor, null);
    set(hasMore, true);
    set(error, "");
    set(loading, false);
  }
  async function loadMore() {
    if (get2(loading) || !get2(hasMore))
      return;
    const gen = ++loadGeneration;
    set(loading, true);
    set(error, "");
    try {
      const page = await fetchItemsPage(get2(cursor) ?? undefined, PAGE_SIZE, get2(filterIsRead));
      if (gen !== loadGeneration)
        return;
      set(items, [...get2(items), ...page.data], true);
      set(cursor, page.nextCursor, true);
      set(hasMore, page.hasMore, true);
    } catch (e) {
      if (gen !== loadGeneration)
        return;
      set(error, e instanceof Error ? e.message : t("items.loadFailed"), true);
    } finally {
      if (gen === loadGeneration)
        set(loading, false);
    }
  }
  async function setReadFilter(next2) {
    if (next2 === get2(filter))
      return;
    set(filter, next2, true);
    loadGeneration++;
    resetList();
    await loadMore();
  }
  user_effect(() => {
    if (!get2(sentinel))
      return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting))
        loadMore();
    }, { rootMargin: "200px" });
    observer.observe(get2(sentinel));
    return () => observer.disconnect();
  });
  function compareItem(a, b) {
    const cmp = b.published_at.localeCompare(a.published_at);
    if (cmp !== 0)
      return cmp;
    return b.id.localeCompare(a.id);
  }
  function handleOpenItem(item) {
    if (item.is_read)
      return;
    if (get2(filter) === "unread") {
      set(items, get2(items).filter((n) => n.id !== item.id), true);
    } else {
      set(items, get2(items).map((n) => n.id === item.id ? { ...n, is_read: true } : n), true);
    }
    markItemRead(item.id).catch(() => {
      if (get2(filter) === "unread") {
        set(items, [...get2(items), { ...item, is_read: false }].sort(compareItem), true);
      } else {
        set(items, get2(items).map((n) => n.id === item.id ? { ...n, is_read: false } : n), true);
      }
    });
  }
  function handleCoverError(event2, item) {
    const image = event2.currentTarget;
    if (!(image instanceof HTMLImageElement))
      return;
    if (image.dataset.proxyFallback !== "true") {
      image.dataset.proxyFallback = "true";
      image.src = `/api/items/${item.id}/cover`;
      return;
    }
    set(failedCovers, new Set([...get2(failedCovers), item.id]), true);
  }
  async function handleBlockSource(source2) {
    if (get2(blockingSources).has(source2))
      return;
    set(blockingSources, new Set([...get2(blockingSources), source2]), true);
    set(error, "");
    try {
      await blockSource(source2);
      set(items, get2(items).filter((item) => item.source !== source2), true);
    } catch (e) {
      set(error, e instanceof Error ? e.message : t("items.blockSourceFailed"), true);
    } finally {
      const next2 = new Set(get2(blockingSources));
      next2.delete(source2);
      set(blockingSources, next2, true);
    }
  }
  async function markAllRead() {
    if (get2(items).length === 0)
      return;
    const until = get2(items).reduce((max, item) => {
      const publishedAt = item.published_at;
      if (!publishedAt)
        return max;
      if (!max || publishedAt > max)
        return publishedAt;
      return max;
    }, undefined);
    if (!until)
      return;
    await markAllItemsRead(until);
    if (get2(filter) === "unread") {
      set(items, get2(items).filter((item) => item.published_at > until), true);
    } else {
      set(items, get2(items).map((item) => item.published_at <= until ? { ...item, is_read: true } : item), true);
    }
  }
  onMount(() => {
    loadMore();
    const timer = setInterval(() => {
      set(now2, Date.now(), true);
    }, 60000);
    return () => {
      clearInterval(timer);
    };
  });
  var $$exports = { markAllRead };
  next();
  var fragment = root_82();
  var div = sibling(first_child(fragment));
  var node = sibling(child(div));
  ItemFilterToggle_default(node, {
    get filter() {
      return get2(filter);
    },
    onToggle: () => setReadFilter(get2(filter) === "unread" ? "all" : "unread")
  });
  var node_1 = sibling(node, 2);
  MarkAllReadButton_default(node_1, { onMarkAllRead: () => markAllRead() });
  next();
  reset(div);
  var node_2 = sibling(div, 2);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root26();
      var p = sibling(first_child(fragment_1));
      var text2 = child(p, true);
      reset(p);
      next();
      template_effect(() => set_text(text2, get2(error)));
      append($$anchor2, fragment_1);
    };
    var consequent_1 = ($$anchor2) => {
      var fragment_2 = root_118();
      var p_1 = sibling(first_child(fragment_2));
      var text_1 = child(p_1, true);
      reset(p_1);
      next();
      template_effect(($0) => set_text(text_1, $0), [() => t("items.noItems")]);
      append($$anchor2, fragment_2);
    };
    var alternate = ($$anchor2) => {
      var fragment_3 = root_62();
      var ul = sibling(first_child(fragment_3));
      var node_3 = sibling(child(ul));
      each(node_3, 17, () => get2(items), (item) => item.id, ($$anchor3, item) => {
        next();
        var fragment_4 = root_52();
        var li = sibling(first_child(fragment_4));
        var article = sibling(child(li));
        var div_1 = sibling(child(article));
        var div_2 = sibling(child(div_1));
        var time = sibling(child(div_2));
        var text_2 = child(time);
        reset(time);
        var span = sibling(time, 4);
        var text_3 = child(span, true);
        reset(span);
        next();
        reset(div_2);
        var a_1 = sibling(div_2, 2);
        var text_4 = child(a_1);
        reset(a_1);
        var node_4 = sibling(a_1, 2);
        {
          var consequent_2 = ($$anchor4) => {
            var fragment_5 = root_27();
            var p_2 = sibling(first_child(fragment_5));
            var text_5 = child(p_2);
            reset(p_2);
            next();
            template_effect(() => set_text(text_5, `
                ${get2(item).content ?? ""}
              `));
            append($$anchor4, fragment_5);
          };
          if_block(node_4, ($$render) => {
            if (get2(item).content)
              $$render(consequent_2);
          });
        }
        var node_5 = sibling(node_4, 2);
        {
          var consequent_3 = ($$anchor4) => {
            var fragment_6 = root_35();
            var p_3 = sibling(first_child(fragment_6));
            var span_1 = sibling(child(p_3));
            var text_6 = child(span_1, true);
            reset(span_1);
            var button = sibling(span_1, 2);
            var node_6 = sibling(child(button));
            ban_default(node_6, { size: 14, strokeWidth: 1.5, "aria-hidden": true });
            next();
            reset(button);
            next();
            reset(p_3);
            next();
            template_effect(($0, $1, $2) => {
              set_text(text_6, get2(item).source);
              set_attribute2(button, "aria-label", $0);
              set_attribute2(button, "title", $1);
              button.disabled = $2;
            }, [
              () => `${t("items.blockSource")} ${get2(item).source}`,
              () => t("items.blockSource"),
              () => get2(blockingSources).has(get2(item).source)
            ]);
            delegated("click", button, () => void handleBlockSource(get2(item).source));
            append($$anchor4, fragment_6);
          };
          if_block(node_5, ($$render) => {
            if (get2(item).source)
              $$render(consequent_3);
          });
        }
        next();
        reset(div_1);
        var node_7 = sibling(div_1, 2);
        {
          var consequent_4 = ($$anchor4) => {
            var fragment_7 = root_44();
            var a_2 = sibling(first_child(fragment_7));
            var img = sibling(child(a_2));
            next();
            reset(a_2);
            next();
            template_effect(() => {
              set_attribute2(a_2, "href", get2(item).link);
              set_attribute2(img, "src", get2(item).cover);
            });
            delegated("click", a_2, () => handleOpenItem(get2(item)));
            event("error", img, (event2) => handleCoverError(event2, get2(item)));
            replay_events(img);
            append($$anchor4, fragment_7);
          };
          var d = user_derived(() => get2(item).cover && !get2(failedCovers).has(get2(item).id));
          if_block(node_7, ($$render) => {
            if (get2(d))
              $$render(consequent_4);
          });
        }
        next();
        reset(article);
        next();
        reset(li);
        next();
        template_effect(($0) => {
          set_attribute2(time, "datetime", get2(item).published_at);
          set_text(text_2, `
                ${$0 ?? ""}
              `);
          set_text(text_3, get2(item).feed_title);
          set_attribute2(a_1, "href", get2(item).link);
          set_class(a_1, 1, `mt-1 block text-sm leading-snug hover:text-neutral-600 dark:hover:text-neutral-300 ${get2(item).is_read ? "font-normal text-neutral-500 dark:text-neutral-500" : "font-medium text-neutral-900 dark:text-neutral-100"}`);
          set_text(text_4, `
              ${get2(item).title ?? ""}
            `);
        }, [() => formatTime(get2(item).published_at, get2(now2))]);
        delegated("click", a_1, () => handleOpenItem(get2(item)));
        append($$anchor3, fragment_4);
      });
      next();
      reset(ul);
      next();
      append($$anchor2, fragment_3);
    };
    if_block(node_2, ($$render) => {
      if (get2(error))
        $$render(consequent);
      else if (get2(items).length === 0 && !get2(loading))
        $$render(consequent_1, 1);
      else
        $$render(alternate, -1);
    });
  }
  var node_8 = sibling(node_2, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var fragment_8 = root_72();
      var p_4 = sibling(first_child(fragment_8));
      var text_7 = child(p_4);
      reset(p_4);
      next();
      template_effect(($0) => set_text(text_7, `
    ${$0 ?? ""}
  `), [() => t("items.loading")]);
      append($$anchor2, fragment_8);
    };
    var consequent_6 = ($$anchor2) => {
      var fragment_9 = root_72();
      var p_5 = sibling(first_child(fragment_9));
      var text_8 = child(p_5);
      reset(p_5);
      next();
      template_effect(($0) => set_text(text_8, `
    ${$0 ?? ""}
  `), [() => t("items.noMore")]);
      append($$anchor2, fragment_9);
    };
    if_block(node_8, ($$render) => {
      if (get2(loading))
        $$render(consequent_5);
      else if (!get2(hasMore) && get2(items).length > 0)
        $$render(consequent_6, 1);
    });
  }
  var div_3 = sibling(node_8, 2);
  bind_this(div_3, ($$value) => set(sentinel, $$value), () => get2(sentinel));
  append($$anchor, fragment);
  return pop($$exports);
}
if (undefined) {}
var ItemList_default = ItemList;
delegate(["click"]);

// web/src/components/buttons/LanguageToggle.svelte
var root27 = from_html(`

<button type="button" class="inline-flex min-w-[2rem] cursor-pointer items-center justify-center rounded-md p-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"> </button>`, 1);
function LanguageToggle($$anchor, $$props) {
  push($$props, true);
  const next2 = user_derived(() => nextLocale(localeState.locale));
  const label = user_derived(() => get2(next2) === "en" ? "EN" : get2(next2) === "zh-Hans" ? "简" : "繁");
  const aria = user_derived(() => get2(next2) === "en" ? t("lang.switchToEn") : get2(next2) === "zh-Hans" ? t("lang.switchToZhHans") : t("lang.switchToZhHant"));
  next();
  var fragment = root27();
  var button = sibling(first_child(fragment));
  var text2 = child(button);
  reset(button);
  template_effect(() => {
    set_attribute2(button, "aria-label", get2(aria));
    set_attribute2(button, "title", get2(aria));
    set_text(text2, `
  ${get2(label) ?? ""}
`);
  });
  delegated("click", button, function(...$$args) {
    toggleLocale?.apply(this, $$args);
  });
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var LanguageToggle_default = LanguageToggle;
delegate(["click"]);

// node_modules/@lucide/svelte/dist/icons/moon.svelte
var rest_excludes15 = new Set(["$$slots", "$$events", "$$legacy"]);
var root28 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAuOTg1IDEyLjQ4NmE5IDkgMCAxIDEtOS40NzMtOS40NzJjLjQwNS0uMDIyLjYxNy40Ni40MDIuODAzYTYgNiAwIDAgMCA4LjI2OCA4LjI2OGMuMzQ0LS4yMTUuODI1LS4wMDQuODAzLjQwMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/moon
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Moon($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes15);
  const iconNode = [
    [
      "path",
      {
        d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      }
    ]
  ];
  var fragment = root28();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "moon" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var moon_default = Moon;
// node_modules/@lucide/svelte/dist/icons/sun.svelte
var rest_excludes16 = new Set(["$$slots", "$$events", "$$legacy"]);
var root29 = from_html(`<!--
@lucide/svelte v1.34.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
-->




<!--
@component

Lucide SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiAvPgogIDxwYXRoIGQ9Ik0xMiAydjIiIC8+CiAgPHBhdGggZD0iTTEyIDIwdjIiIC8+CiAgPHBhdGggZD0ibTQuOTMgNC45MyAxLjQxIDEuNDEiIC8+CiAgPHBhdGggZD0ibTE3LjY2IDE3LjY2IDEuNDEgMS40MSIgLz4KICA8cGF0aCBkPSJNMiAxMmgyIiAvPgogIDxwYXRoIGQ9Ik0yMCAxMmgyIiAvPgogIDxwYXRoIGQ9Im02LjM0IDE3LjY2LTEuNDEgMS40MSIgLz4KICA8cGF0aCBkPSJtMTkuMDcgNC45My0xLjQxIDEuNDEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/sun
@see https://lucide.dev/guide/packages/lucide-svelte - Documentation
-->

<!>`, 1);
function Sun($$anchor, $$props) {
  let props = rest_props($$props, rest_excludes16);
  const iconNode = [
    ["circle", { cx: "12", cy: "12", r: "4" }],
    ["path", { d: "M12 2v2" }],
    ["path", { d: "M12 20v2" }],
    ["path", { d: "m4.93 4.93 1.41 1.41" }],
    ["path", { d: "m17.66 17.66 1.41 1.41" }],
    ["path", { d: "M2 12h2" }],
    ["path", { d: "M20 12h2" }],
    ["path", { d: "m6.34 17.66-1.41 1.41" }],
    ["path", { d: "m19.07 4.93-1.41 1.41" }]
  ];
  var fragment = root29();
  var node = first_child(fragment);
  var node_1 = sibling(node, 2);
  var node_2 = sibling(node_1, 2);
  Icon_default(node_2, spread_props({ name: "sun" }, () => props, {
    get iconNode() {
      return iconNode;
    }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var sun_default = Sun;
// web/src/components/buttons/ThemeToggle.svelte
var root30 = from_html(`
    <!>
  `, 1);
var root_119 = from_html(`

<button type="button" class="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100">
  <!>
</button>`, 1);
function ThemeToggle($$anchor, $$props) {
  push($$props, false);
  const iconProps = { size: 18, strokeWidth: 1.5, "aria-hidden": true };
  init();
  next();
  var fragment = root_119();
  var button = sibling(first_child(fragment));
  var node = sibling(child(button));
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root30();
      var node_1 = sibling(first_child(fragment_1));
      sun_default(node_1, spread_props(() => iconProps));
      next();
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var fragment_2 = root30();
      var node_2 = sibling(first_child(fragment_2));
      moon_default(node_2, spread_props(() => iconProps));
      next();
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if (themeState.mode === "dark")
        $$render(consequent);
      else
        $$render(alternate, -1);
    });
  }
  next();
  reset(button);
  template_effect(($0, $1) => {
    set_attribute2(button, "aria-label", $0);
    set_attribute2(button, "title", $1);
  }, [
    () => themeState.mode === "dark" ? t("theme.switchToLight") : t("theme.switchToDark"),
    () => themeState.mode === "dark" ? t("theme.lightMode") : t("theme.darkMode")
  ]);
  delegated("click", button, function(...$$args) {
    toggleTheme?.apply(this, $$args);
  });
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var ThemeToggle_default = ThemeToggle;
delegate(["click"]);

// web/src/components/LoginGate.svelte
var root31 = from_html(`
      <p class="mt-3 text-sm text-red-500"> </p>
    `, 1);
var root_120 = from_html(`

<main class="flex min-h-screen items-center justify-center px-5">
  <form class="w-full max-w-sm">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-medium tracking-tight">NanoFlux</h1>
      <div class="flex items-center gap-1">
        <!>
        <!>
      </div>
    </div>
    <p class="mt-3 text-sm text-neutral-500 dark:text-neutral-400"> </p>
    <label class="mt-8 block">
      <span class="sr-only"> </span>
      <input type="password" name="password" autocomplete="current-password"/>
    </label>
    <!>
    <button type="submit" class="mt-8 w-full cursor-pointer rounded-md bg-neutral-900 py-2 text-sm text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"> </button>
  </form>
</main>`, 1);
function LoginGate($$anchor, $$props) {
  push($$props, true);
  const inputClass = "w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100";
  let password = state("");
  let submitting = state(false);
  let error = state("");
  async function handleSubmit(event2) {
    event2.preventDefault();
    if (get2(submitting))
      return;
    set(error, "");
    set(submitting, true);
    try {
      await submitLogin(get2(password));
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      if (message === "Invalid password")
        set(error, t("auth.invalid"), true);
      else if (message === "Too many login attempts")
        set(error, t("auth.tooMany"), true);
      else
        set(error, message || t("auth.failed"), true);
    } finally {
      set(submitting, false);
    }
  }
  next();
  var fragment = root_120();
  var main = sibling(first_child(fragment));
  var form = sibling(child(main));
  var div = sibling(child(form));
  var div_1 = sibling(child(div), 3);
  var node = sibling(child(div_1));
  LanguageToggle_default(node, {});
  var node_1 = sibling(node, 2);
  ThemeToggle_default(node_1, {});
  next();
  reset(div_1);
  next();
  reset(div);
  var p = sibling(div, 2);
  var text2 = child(p);
  reset(p);
  var label = sibling(p, 2);
  var span = sibling(child(label));
  var text_1 = child(span, true);
  reset(span);
  var input = sibling(span, 2);
  remove_input_defaults(input);
  set_class(input, 1, clsx2(inputClass));
  next();
  reset(label);
  var node_2 = sibling(label, 2);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root31();
      var p_1 = sibling(first_child(fragment_1));
      var text_2 = child(p_1, true);
      reset(p_1);
      next();
      template_effect(() => set_text(text_2, get2(error)));
      append($$anchor2, fragment_1);
    };
    if_block(node_2, ($$render) => {
      if (get2(error))
        $$render(consequent);
    });
  }
  var button = sibling(node_2, 2);
  var text_3 = child(button);
  reset(button);
  next();
  reset(form);
  next();
  reset(main);
  template_effect(($0, $1, $2, $3) => {
    set_text(text2, `
      ${$0 ?? ""}
    `);
    set_text(text_1, $1);
    set_attribute2(input, "placeholder", $2);
    input.disabled = get2(submitting);
    button.disabled = get2(submitting) || !get2(password);
    set_text(text_3, `
      ${$3 ?? ""}
    `);
  }, [
    () => t("auth.hint"),
    () => t("auth.password"),
    () => t("auth.password"),
    () => get2(submitting) ? t("auth.submitting") : t("auth.submit")
  ]);
  event("submit", form, handleSubmit);
  bind_value(input, () => get2(password), ($$value) => set(password, $$value));
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var LoginGate_default = LoginGate;

// web/src/App.svelte
var root32 = from_html(`
  <main class="flex min-h-screen items-center justify-center px-5 text-sm text-neutral-400"> </main>
`, 1);
var root_121 = from_html(`
  <!>
`, 1);
var root_28 = from_html(`
      <!>
    `, 1);
var root_36 = from_html(`
            <!>
          `, 1);
var root_45 = from_html(`
      <div class="min-w-0 flex-1">
        <div class="mx-auto max-w-page px-5 py-10 md:py-16">
          <!>
        </div>
      </div>
    `, 1);
var root_53 = from_html(`
  <main class="w-full font-sans md:flex">
    <!>
    <!>
  </main>
`, 1);
var root_63 = from_html(`

<!>`, 1);
function App($$anchor, $$props) {
  push($$props, true);
  const $route = () => store_get(route, "$route", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  onMount(() => {
    initAuth();
  });
  const locked = user_derived(() => authState.required && !authState.authenticated);
  next();
  var fragment = root_63();
  var node = sibling(first_child(fragment));
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root32();
      var main = sibling(first_child(fragment_1));
      var text2 = child(main);
      reset(main);
      next();
      template_effect(($0) => set_text(text2, `
    ${$0 ?? ""}
  `), [() => t("items.loading")]);
      append($$anchor2, fragment_1);
    };
    var consequent_1 = ($$anchor2) => {
      var fragment_2 = root_121();
      var node_1 = sibling(first_child(fragment_2));
      LoginGate_default(node_1, {});
      next();
      append($$anchor2, fragment_2);
    };
    var alternate_2 = ($$anchor2) => {
      var fragment_3 = root_53();
      var main_1 = sibling(first_child(fragment_3));
      var node_2 = sibling(child(main_1));
      Header_default(node_2, {});
      var node_3 = sibling(node_2, 2);
      {
        var consequent_2 = ($$anchor3) => {
          var fragment_4 = root_28();
          var node_4 = sibling(first_child(fragment_4));
          SettingsManager_default(node_4, {});
          next();
          append($$anchor3, fragment_4);
        };
        var alternate_1 = ($$anchor3) => {
          var fragment_5 = root_45();
          var div = sibling(first_child(fragment_5));
          var div_1 = sibling(child(div));
          var node_5 = sibling(child(div_1));
          {
            var consequent_3 = ($$anchor4) => {
              var fragment_6 = root_36();
              var node_6 = sibling(first_child(fragment_6));
              FeedsManager_default(node_6, {});
              next();
              append($$anchor4, fragment_6);
            };
            var consequent_4 = ($$anchor4) => {
              var fragment_7 = root_36();
              var node_7 = sibling(first_child(fragment_7));
              ExportPage_default(node_7, {});
              next();
              append($$anchor4, fragment_7);
            };
            var alternate = ($$anchor4) => {
              var fragment_8 = root_36();
              var node_8 = sibling(first_child(fragment_8));
              ItemList_default(node_8, {});
              next();
              append($$anchor4, fragment_8);
            };
            if_block(node_5, ($$render) => {
              if ($route() === "/feeds")
                $$render(consequent_3);
              else if ($route() === "/export")
                $$render(consequent_4, 1);
              else
                $$render(alternate, -1);
            });
          }
          next();
          reset(div_1);
          next();
          reset(div);
          next();
          append($$anchor3, fragment_5);
        };
        if_block(node_3, ($$render) => {
          if ($route() === "/settings")
            $$render(consequent_2);
          else
            $$render(alternate_1, -1);
        });
      }
      next();
      reset(main_1);
      next();
      append($$anchor2, fragment_3);
    };
    if_block(node, ($$render) => {
      if (authState.loading)
        $$render(consequent);
      else if (get2(locked))
        $$render(consequent_1, 1);
      else
        $$render(alternate_2, -1);
    });
  }
  append($$anchor, fragment);
  pop();
  $$cleanup();
}
if (undefined) {}
var App_default = App;

// web/src/lib/pwa.ts
function registerPwa() {
  if (!("serviceWorker" in navigator))
    return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((err) => console.warn("[pwa] service worker registration failed", err));
  });
}

// web/src/main.ts
initRouter();
initTheme();
initSidebar();
initFontSize();
initLocale();
registerPwa();
mount(App_default, { target: document.getElementById("app") });
