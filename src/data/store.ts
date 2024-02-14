import storage from 'redux-persist/lib/storage';
import { RematchDispatch, RematchRootState, init } from '@rematch/core'
import createPersistPlugin from '@rematch/persist'
import models, { RootModel } from "./models";


const persistPlugin = createPersistPlugin({
	key: 'root',
	storage,
	version: 2,
	whitelist: ["ships"],
})

const store = init<RootModel>({
	models,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	plugins: [persistPlugin as any],
});


export default store;

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
