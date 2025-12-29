import { useEffect } from 'react'
import { useStore } from '../../store/store.js';
import { useRefresh } from '../../api/queries/auth/useRefresh.js';
import LoadingPage from '../../pages/util.pages/loading.page.jsx';


const ProtectedRoute = (props) => {
  const user = useStore((state) => state.user);
  const {mutate:refresh , isPending } = useRefresh();

  useEffect(() => {
    //if user is not authenticated , refresh the token
    if (!user || !user?.token) {
      refresh();
    }
  }, []);

  if (isPending) {
    return <LoadingPage/>; // Show a loading state while refreshing
  }
  if(user.token) {
    return props.children ; // If authenticated, render the child components
  }
}

export default ProtectedRoute