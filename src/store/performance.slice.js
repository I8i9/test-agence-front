import { subMonths } from 'date-fns';

export const createRangeSlice = (set) => ({
  range: {
    type: "LASTWEEK", // Note: You might want to rename this to "LAST_QUARTER" or similar if using 3 months
    // 3 months by default using date fns
    from: subMonths(new Date(), 3),
    to: new Date(),
  },
  setRangeStore: (range) => set({ range }),
});