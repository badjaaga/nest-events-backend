export class ListEvents {
  time?: WhenEventFilter = WhenEventFilter.All;
}

export enum WhenEventFilter {
  All = 1,
  Today,
  Tomorrow,
  THisWeek,
  NextWeek,
}
