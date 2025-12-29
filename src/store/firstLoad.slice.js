
export const createFirstLoadingSlice = (set) => ({
    firstLoad: true,
    stopFirstLoad: () => set({ firstLoad: false }),
});

    