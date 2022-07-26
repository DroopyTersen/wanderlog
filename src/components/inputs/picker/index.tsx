export * from "./Picker.types";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "~/components/loaders/LoadingSpinner";
import { PickerMultiProps, PickerSingleProps } from "./Picker.types";

const LazyPickerMulti = lazy(() => import("./PickerMulti"));
const LazyPickerSingle = lazy(() => import("./PickerSingle"));

export function SuspendedPickerMulti(props: PickerMultiProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyPickerMulti {...props} />
    </Suspense>
  );
}

export function SuspendedPickerPickerSingle(props: PickerSingleProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyPickerSingle {...props} />
    </Suspense>
  );
}
