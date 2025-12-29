export const createDashboardSlice = (set) => ({
  dataOld: {
    revenue : null,
    expenses : null,
    views : null,
    activeOffers: null,
    activePromotions: null,
    contrats: null,
  },
setDataOld: (dataOld) => set({ dataOld }),
});