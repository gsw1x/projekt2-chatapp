import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState(true);

  const updateOnlineStatus = (state) => {
    setIsOnline(state.isConnected);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(updateOnlineStatus);

    return () => {
      unsubscribe();
    };
  }, []);

  return isOnline;
};

export default useIsOnline;

