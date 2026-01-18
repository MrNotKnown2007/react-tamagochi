// utils/storage.ts - УНИВЕРСАЛЬНАЯ ВЕРСИЯ ДЛЯ ВЕБА И МОБИЛЬНЫХ
import { Platform } from 'react-native';

// Для веба используем localStorage, для мобильных - AsyncStorage
let storageImpl: any;

if (Platform.OS === 'web') {
  // Веб-версия
  storageImpl = {
    getItem: async (key: string) => {
      return localStorage.getItem(key);
    },
    setItem: async (key: string, value: string) => {
      localStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
      localStorage.removeItem(key);
    },
    getAllKeys: async () => {
      return Object.keys(localStorage);
    },
  };
} else {
  // Мобильная версия - будет загружена динамически
  storageImpl = {
    getItem: async (key: string) => {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return AsyncStorage.getItem(key);
    },
    setItem: async (key: string, value: string) => {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return AsyncStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return AsyncStorage.removeItem(key);
    },
    getAllKeys: async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return AsyncStorage.getAllKeys();
    },
  };
}

export const storage = storageImpl;