import React, { useEffect } from 'react'
import { useTryRefresh } from '../../api/queries/auth/useTryRefresh.js';
import LoadingPage from '../../pages/util.pages/loading.page.jsx';
import DownPage from '../../pages/util.pages/down.page.jsx';
import { useStore } from '../../store/store.js';


const CanLogin = (props) => {
    const {mutate:refresh , isPending , isIdle } = useTryRefresh();
    const user = useStore((state) => state.user);
    // If user is already logged in, redirect to dashboard
    useEffect(() => {
        if (!user || !user?.token) {
            // If user is not authenticated, refresh the token
            refresh();
        }
    }, []);


    if (isPending || isIdle) {
        return <LoadingPage/>; // Show a loading state while refreshing
    }else if (!user || !user?.token ) {
        return props.children; // If not authenticated, render the child components
    }
}

export default CanLogin