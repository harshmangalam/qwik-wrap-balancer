import {
  $,
  component$,
  Slot,
  useVisibleTask$,
  useSignal,
  type HTMLAttributes,
} from "@builder.io/qwik";

const SYMBOL_OBSERVER_KEY = "__wrap_o";

interface WrapperElement extends HTMLElement {
  [SYMBOL_OBSERVER_KEY]?: ResizeObserver | undefined;
}

interface BalancerProps extends HTMLAttributes<HTMLElement> {
  /**
   * The HTML tag to use for the wrapper element.
   * @default 'span'
   */
  as?: any;
  /**
   * The balance ratio of the wrapper width (0 <= ratio <= 1).
   * 0 means the wrapper width is the same as the container width (no balance, browser default).
   * 1 means the wrapper width is the minimum (full balance, most compact).
   * @default 1
   */
  ratio?: number;
}

export const WrapBalancer = component$((props: BalancerProps) => {
  const { as: Wrapper = "span", ratio = 1 } = props;
  const wrapperRef = useSignal<WrapperElement>();

  const SYMBOL_KEY = "__wrap_b";

  const relayout = $((id: string, ratio: number, wrapper: WrapperElement) => {
    wrapper =
      wrapper || document.querySelector<WrapperElement>(`[data-br="${id}"]`);
    const container = wrapper.parentElement;

    const update = (width: number) => (wrapper.style.maxWidth = width + "px");

    // Reset wrapper width
    wrapper.style.maxWidth = "";

    // Get the initial container size
    const width = container?.clientWidth;
    const height = container?.clientHeight;

    // Synchronously do binary search and calculate the layout
    let left = (width as number) / 2;
    let right = width as number;
    let middle: number;

    if (width) {
      while (left + 1 < right) {
        middle = ~~((left + right) / 2);
        update(middle);
        if (container.clientHeight === height) {
          right = middle;
        } else {
          left = middle;
        }
      }

      // Update the wrapper width
      update(right * ratio + width * (1 - ratio));
    }

    // Create a new observer if we don't have one.
    // Note that we must inline the key here as we use `toString()` to serialize
    // the function.
    if (!wrapper["__wrap_o"]) {
      (wrapper["__wrap_o"] = new ResizeObserver(() => {
        (self as any).__wrap_b(0, +(wrapper.dataset.brr as any), wrapper);
      })).observe(container as HTMLElement);
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => ratio);
    track(() => wrapperRef.value);
    if (wrapperRef.value) {
      // Re-assign the function here as the component can be dynamically rendered, and script tag won't work in that case.
      ((self as any)[SYMBOL_KEY] = relayout)(
        "balancer",
        ratio,
        wrapperRef.value
      );
    }
  });

  return (
    <>
      <Wrapper
        {...props}
        data-br={"balancer"}
        data-brr={ratio}
        ref={wrapperRef}
        style={{
          display: "inline-block",
          verticalAlign: "top",
          textDecoration: "inherit",
        }}
      >
        <Slot />
      </Wrapper>
    </>
  );
});
