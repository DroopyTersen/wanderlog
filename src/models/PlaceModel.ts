export interface PlaceItem {
  id?: string;
  title: string;
  coords?: [number, number];
  visitDates?: Date[];
}

export const NEW_PLACE = {
  id: Date.now() + "",
  title: "",
  coords: null,
  visitDates: [],
};
