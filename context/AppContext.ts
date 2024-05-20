import React, { Dispatch, SetStateAction } from "react";

export type BottomSheetModalOptions = "shown" | "hidden";
export interface CustomerDetails {
  name: string;
  phoneNumber: string;
}

export interface SaleReference {
  amount: number;
  saleRefNo: string;
}

export const GlobalModalContext = React.createContext<{
  state: {
    modalValue: BottomSheetModalOptions;
    customerValue?: CustomerDetails;
    saleReference?: SaleReference;
  };
  setStateValue: React.Dispatch<
    React.SetStateAction<{
      modalValue: BottomSheetModalOptions;
      customerValue?: CustomerDetails;
      saleReference?: SaleReference;
    }>
  >;
}>({
  state: {
    modalValue: "hidden",
    customerValue: {} as CustomerDetails,
    saleReference: {} as SaleReference,
  }, // default value
  setStateValue: () => {}, // placeholder function
});
