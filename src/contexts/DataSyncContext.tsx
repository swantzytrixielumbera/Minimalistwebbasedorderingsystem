import React, { createContext, useContext, useEffect, useCallback, useState, useRef } from 'react';

// Types of data changes that can be synced
export type SyncEventType = 
  | 'orders'
  | 'products'
  | 'promotions'
  | 'reviews'
  | 'inventory';

interface SyncEvent {
  type: SyncEventType;
  action: 'create' | 'update' | 'delete';
  timestamp: number;
}

interface DataSyncContextType {
  broadcastChange: (type: SyncEventType, action: 'create' | 'update' | 'delete') => void;
  subscribeToChanges: (callback: (event: SyncEvent) => void) => () => void;
}

const DataSyncContext = createContext<DataSyncContextType | undefined>(undefined);

export const DataSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channel] = useState(() => {
    // BroadcastChannel for cross-tab communication
    if (typeof BroadcastChannel !== 'undefined') {
      return new BroadcastChannel('laroza-data-sync');
    }
    return null;
  });
  
  const listenersRef = useRef<Set<(event: SyncEvent) => void>>(new Set());

  // Broadcast a data change to all tabs and listeners
  const broadcastChange = useCallback((type: SyncEventType, action: 'create' | 'update' | 'delete') => {
    const event: SyncEvent = {
      type,
      action,
      timestamp: Date.now(),
    };

    // Broadcast to other tabs via BroadcastChannel
    if (channel) {
      channel.postMessage(event);
    }

    // Also use localStorage as a fallback for older browsers
    const storageEvent = new StorageEvent('storage', {
      key: 'laroza-sync-event',
      newValue: JSON.stringify(event),
    });
    window.dispatchEvent(storageEvent);

    // Notify local listeners in the same tab
    listenersRef.current.forEach(listener => listener(event));
  }, [channel]);

  // Subscribe to data changes
  const subscribeToChanges = useCallback((callback: (event: SyncEvent) => void) => {
    listenersRef.current.add(callback);

    return () => {
      listenersRef.current.delete(callback);
    };
  }, []);

  // Listen to BroadcastChannel messages from other tabs
  useEffect(() => {
    if (!channel) return;

    const handleMessage = (event: MessageEvent<SyncEvent>) => {
      listenersRef.current.forEach(listener => listener(event.data));
    };

    channel.addEventListener('message', handleMessage);

    return () => {
      channel.removeEventListener('message', handleMessage);
    };
  }, [channel]);

  // Listen to localStorage events (for cross-tab communication fallback)
  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === 'laroza-sync-event' && event.newValue) {
        try {
          const syncEvent: SyncEvent = JSON.parse(event.newValue);
          listenersRef.current.forEach(listener => listener(syncEvent));
        } catch (error) {
          console.error('Failed to parse sync event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, [channel]);

  return (
    <DataSyncContext.Provider value={{ broadcastChange, subscribeToChanges }}>
      {children}
    </DataSyncContext.Provider>
  );
};

export const useDataSync = () => {
  const context = useContext(DataSyncContext);
  if (!context) {
    throw new Error('useDataSync must be used within DataSyncProvider');
  }
  return context;
};

// Hook for auto-reloading data when changes occur
export const useAutoRefresh = (types: SyncEventType[], onRefresh: () => void) => {
  const { subscribeToChanges } = useDataSync();

  useEffect(() => {
    const unsubscribe = subscribeToChanges((event) => {
      if (types.includes(event.type)) {
        onRefresh();
      }
    });

    return unsubscribe;
  }, [types, onRefresh, subscribeToChanges]);
};