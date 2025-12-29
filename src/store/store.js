import { create } from 'zustand';
import { createUserSlice } from './user.slice';
import { createSocketSlice } from './socket.slice';
import {createLoadingSlice} from './loading.slice';
import { createDashboardSlice } from './dashboard.slice';
import { createRangeSlice } from './performance.slice';
import { createFirstLoadingSlice } from './firstLoad.slice';

export const useStore = create((set,get) => ({
    ...createUserSlice(set,get),
    ...createSocketSlice(set, get),
    ...createLoadingSlice(set, get),
    ...createDashboardSlice(set, get),
    ...createRangeSlice(set, get),
    ...createFirstLoadingSlice(set, get),
}));