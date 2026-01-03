
export const createUserSlice = (set) => ({
  user: {
    name: null,
    email: null,
    role: null,
    token: null,
    config : null,
    threshold : null,
    twoFAEnabled: null,
    agency: {
      name_agency: null,
      subscription: null,
      logo_path: null,
      isExpired: false,
      max_logins : null,
    },
  },

  setUser: (user) => set({ user }),

  setLogoPath: (logoPath) =>
    set((state) => ({
      user: {
        ...state.user,
        agency: {
          ...state.user.agency,
          logo_path: logoPath,
        },
      },
    })),

  setNameAgency: (name_agency) =>
    set((state) => ({
      user: {
        ...state.user,
        agency: {
          ...state.user.agency,
          name_agency,
        },
      },
    })),

    setThreshold: (threshold) =>
    set((state) => ({
      user: {
        ...state.user,
        threshold,
      },
    })),

  logout: () =>
    set({
      user: {
        name: null,
        email: null,
        role: null,
        token: null,
        config : null,
        threshold : null,
        twoFAEnabled: null,
        agency: {
          name_agency: null,
          subscription: null,
          logo_path: null,
          isExpired: false,
          max_logins : null,
        },
      },
    }),
});