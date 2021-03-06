import {createSelector} from '@ngrx/store'
import {AppStateInterface} from '../../../types/app-state.interface'
import {FeedStateInterface} from '../types/feed-state.interface'

export const feedFeatureSelector =
  (state: AppStateInterface): FeedStateInterface => state.feed

export const isLoadingSelector = createSelector(
  feedFeatureSelector,
  (feedState) => feedState.isLoading
)

export const errorSelector = createSelector(
  feedFeatureSelector,
  (feedState) => feedState.error
)

export const feedSelector = createSelector(
  feedFeatureSelector,
  (feedState) => feedState.data
)
