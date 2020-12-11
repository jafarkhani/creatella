import { Record, SortDirection } from '../../modals/types';

export interface Column {
    title: string;
    key: string;
    sortable?: boolean;
    renderer?: (value: any, record: any) => JSX.Element | string;
}

export enum DataAction {
    FETCH_INIT,
    FETCH_SUCCESS,
    FETCH_FAILURE,
    CHANGE_SORT,
    NEXT_PAGE,
    FIRST_PAGE
}

export interface DataState {
    preloaddata: Record[];
    data: Record[];
    loading: boolean;
    error: boolean;
    page: number;
    allLoaded: boolean;
    sortKey: string;
    sortDir: SortDirection;
}