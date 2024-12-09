// src/store/persistConfig.ts

import storage from 'redux-persist/lib/storage/session'; // Use session storage
import { PersistConfig } from 'redux-persist';
import { RootState } from './rootReducer';

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  whitelist: ['auth', 'error'],
}

export default persistConfig;