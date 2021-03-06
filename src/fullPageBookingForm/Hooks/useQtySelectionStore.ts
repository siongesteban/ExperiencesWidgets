import { EventDBO } from "../../typings/Event";
import { clone } from "ramda";
import { NumberCarouselVariants } from "../Components/Common/QuantitySelection";
import create from "zustand";

export type QuantitySelectionStore = {
  /**Update variant count on decrease click. */
  onDecreaseClick: (variantIdx: number) => void;
  /**Update variant count on increase click. */
  onIncreaseClick: (variantIdx: number) => void;
  /**Update quantity on change of input field. */
  onChange: (variantIdx: number, variantQty: string) => void;
  /**Whether the customer can confirm their order per store. */
  canConfirmOrder: () => boolean;
  /**Variants in the store. */
  variants: (NumberCarouselVariants[number] & { shopifyVariantId: number })[];
  /**Minimum quantity for a variant in the event. */
  minLimit: number;
  /**Current maximum quantity for variants. Is null if API response for event
   * has a maximum qty of 0.
   */
  maxLimit: number | null;
  /**Number of total units left for the event. */
  unitsLeft: number;
  /**Populate initial variants of store based upon event. */
  setVariants: (event: EventDBO, unitsLeft: number) => void;
  /**Disables the variants from being edited in view. */
  disableVariants: () => void;
  /**Enables all variants for edit in view. */
  enableVariants: () => void;
  /**Handles the removal of a variant when filling out custom per attendee form. */
  handleRemoveVariant: (variantName: string) => void;
};

export const useQtySelectionStore = create<QuantitySelectionStore>(
  (set, get) => ({
    onDecreaseClick: (variantIdx: number) =>
      set((state) => {
        let oldArray = clone(state.variants);
        oldArray[variantIdx].currentQty -= 1;

        return {
          variants: oldArray,
          unitsLeft: state.unitsLeft + 1,
        };
      }),
    onIncreaseClick: (variantIdx: number) =>
      set((state) => {
        let oldArray = clone(state.variants);
        const currentQty = oldArray[variantIdx].currentQty;

        //If we are at a qty of 0, and the tickets have a min limit, we want to
        //increase the value of the variant by the min limit.
        const increaseValue =
          currentQty === 0 && state.minLimit > 0 ? state.minLimit : 1;

        //Update value
        oldArray[variantIdx].currentQty =
          oldArray[variantIdx].currentQty + increaseValue;

        return {
          variants: oldArray,
          unitsLeft: state.unitsLeft - increaseValue,
        };
      }),
    onChange: (variantIdx: number, variantQty: string) =>
      set((state) => {
        let oldArray = clone(state.variants);
        const oldQuantity = oldArray[variantIdx].currentQty;

        //Maximum quantity for event will be maxLimit first, and then a tracked value
        //of the addition of the current variant value + units left if no max limit is provided.
        const maxQty = state.maxLimit
          ? state.maxLimit
          : state.unitsLeft + oldQuantity;
        /**Ensure maximum qty typed in is at most the maximum variant quantity.
         * If user enters an empty string, disallow change.
         */
        let newQuantity =
          parseInt(variantQty) > maxQty ? maxQty : parseInt(variantQty);

        newQuantity = isNaN(newQuantity) ? 0 : newQuantity;

        //Ensure typed value is at minimum minLimit, if one exists.
        newQuantity =
          newQuantity < state.minLimit ? state.minLimit : newQuantity;

        oldArray[variantIdx].currentQty = newQuantity;

        //Update unitsLeft according to quantity differences between
        //old quantity in field and entered quantity.
        const qtyDifference = newQuantity - oldQuantity;

        return {
          variants: oldArray,
          unitsLeft: state.unitsLeft - qtyDifference,
        };
      }),
    canConfirmOrder: () => {
      const variants = get().variants;

      return variants.some((variant) => variant.currentQty > 0);
    },
    variants: [],
    unitsLeft: 0,
    maxLimit: null,
    minLimit: 0,
    setVariants: (event: EventDBO, unitsLeft: number) =>
      set((_) => {
        return {
          unitsLeft: unitsLeft,
          maxLimit: event.maxLimit === 0 ? null : event.maxLimit,
          minLimit: event.minLimit,
          variants: event.variants.map((variant) => ({
            isDisabled: false,
            currentQty: 0,
            name: variant.name,
            price: variant.price,
            shopifyVariantId: variant.shopifyVariantId,
          })),
        };
      }),
    disableVariants: () =>
      set((state) => {
        return {
          variants: state.variants.map((variant) => ({
            ...variant,
            isDisabled: true,
          })),
        };
      }),
    enableVariants: () =>
      set((state) => {
        return {
          variants: state.variants.map((variant) => ({
            ...variant,
            isDisabled: false,
          })),
        };
      }),
    handleRemoveVariant: (variantName) =>
      set((state) => {
        return {
          unitsLeft: state.unitsLeft + 1,
          variants: state.variants.map((variant) => {
            if (variant.name === variantName) {
              return {
                ...variant,
                currentQty: variant.currentQty - 1,
              };
            }

            return {
              ...variant,
            };
          }),
        };
      }),
  }),
);
