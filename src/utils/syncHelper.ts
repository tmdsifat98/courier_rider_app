import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SyncAction, SyncPayload } from '../types';

const QUEUE_KEY = '@rider_sync_queue';

interface SyncResponse {
  success: boolean;
  queued: boolean;
}

export const SyncHelper = {
  async saveAction(actionType: string, payload: SyncPayload): Promise<SyncResponse> {
    const state = await NetInfo.fetch();
    const actionItem: SyncAction = {
      id: Math.random().toString(36).substring(7),
      type: actionType,
      payload,
      timestamp: new Date().toISOString(),
    };

    if (state.isConnected) {
      await this.syncToServer(actionItem);
      return { success: true, queued: false };
    } else {
      await this.queueAction(actionItem);
      return { success: true, queued: true };
    }
  },

  async queueAction(item: SyncAction): Promise<void> {
    try {
      const existingQueue = await AsyncStorage.getItem(QUEUE_KEY);
      const queue: SyncAction[] = existingQueue ? JSON.parse(existingQueue) : [];
      queue.push(item);
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error("Queueing failed: ", error);
    }
  },

  async processQueue(): Promise<void> {
    try {
      const existingQueue = await AsyncStorage.getItem(QUEUE_KEY);
      if (!existingQueue) return;

      const queue: SyncAction[] = JSON.parse(existingQueue);
      if (queue.length === 0) return;

      for (const action of queue) {
        await this.syncToServer(action);
      }

      await AsyncStorage.removeItem(QUEUE_KEY);
    } catch (error) {
      console.error("Queue synchronization failed: ", error);
    }
  },

  async syncToServer(action: SyncAction): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }
};