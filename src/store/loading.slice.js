
export const createLoadingSlice = (set) => ({
    isLoadingBar: false,
    startLoading: () => set({ isLoadingBar: true }),
    stopLoading: () => set({ isLoadingBar: false }),
});

    