export class ListEvents {
  time?: WhenEventFilter = WhenEventFilter.All;
  page = 1;
}

export enum WhenEventFilter {
  All = 1,
  Today,
  Tomorrow,
  ThisWeek,
  NextWeek,
}
