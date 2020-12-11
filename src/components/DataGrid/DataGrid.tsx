import React, { useEffect, useReducer, Fragment, useState } from 'react';
import _ from 'underscore';
import { Record, SortDirection } from '../../modals/types';
import { Column, DataState, DataAction } from './types';
import Loading from '../loading/Loading';
import './DataGrid.scss';
import ErrorHandler from '../error/ErrorHandler';

interface Props {
    columns: Column[];
    key: string;
    pageCount: number;
    defaultSort?: string;
    defaultSortDir?: SortDirection;
    dataUrl: string;
    RowCountForAd: number;
    adUrl: string;
}

const DataGrid: React.FC<Props> = (props) => {

    const [advertisements , setAdvertisements] = useState<number[]>([]);

    const initialState: DataState = {
        preloaddata: [],
        data: [],
        loading: false,
        error: false,
        page: 1,
        allLoaded: false,
        sortKey: props.defaultSort !== undefined ? props.defaultSort : "",
        sortDir: props.defaultSortDir !== undefined ? props.defaultSortDir : SortDirection.asc
    };

    function fetchDataReducer(state: DataState, action: any): DataState {

        switch (action.type) {

            case DataAction.FETCH_INIT:
                return {
                    ...state,
                    data: state.loading ? state.data : [...state.data, ...state.preloaddata],
                    loading: !state.allLoaded,
                    allLoaded: state.preloaddata.length > 0 && state.preloaddata.length < props.pageCount,
                    error: false
                };
            
            case DataAction.FETCH_SUCCESS:

                if (state.page === 1) {
                    return {
                        ...state,
                        preloaddata: action.data,
                        page: 2,
                        loading: false,
                        error: false
                    };
                }
                return {
                    ...state,
                    preloaddata: action.data,
                    loading: false,
                    error: false
                }

            case DataAction.FETCH_FAILURE:
                return {
                    ...state,
                    loading: false,
                    error: true
                }
                    ;
            case DataAction.CHANGE_SORT:
                return {
                    ...initialState,
                    page: 1,
                    sortKey: action.key,
                    sortDir: state.sortKey === action.key
                        ? (state.sortDir === SortDirection.asc ? SortDirection.desc : SortDirection.asc)
                        : SortDirection.asc
                }

            case DataAction.NEXT_PAGE:

                if (state.allLoaded)
                    return { ...state };

                return {
                    ...state,
                    page: state.loading ? state.page : state.page + 1
                }
            default:
                return { ...state };
        }

    }

    const [datastate, dispatch] = useReducer(fetchDataReducer, initialState);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    },[]);

    useEffect(() => {

        FechDate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datastate.page, props.dataUrl, props.pageCount]);


    const FechDate = async () => {

        dispatch({ type: DataAction.FETCH_INIT });

        if (datastate.allLoaded)
            return;
        try{
            let response = await fetch(props.dataUrl + "?" + new URLSearchParams({
                _page: datastate.page.toString(),
                _limit: props.pageCount.toString(),
                _sort: datastate.sortKey
            }));
            let result = await response.json();

            dispatch({ type: DataAction.FETCH_SUCCESS, data: result });
        }
        catch(err){
            dispatch({ type: DataAction.FETCH_FAILURE});
        }
    }

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight)
            return;
        dispatch({ type: DataAction.NEXT_PAGE });
    }

    const SortData = (key: string) => {

        dispatch({ type: DataAction.CHANGE_SORT, key: key });
    }

    //--------------- create headers ------------------
    let header = props.columns.map(item => {

        if (item.sortable) {

            let sortIcon;
            if (datastate.sortKey === item.key) {
                sortIcon = datastate.sortDir === SortDirection.asc
                    ? <span className="sort-icon">▼</span>
                    : <span className="sort-icon">▲</span>;
            }
            return (
                <th>
                    <button className="sortable-header" onClick={() => SortData(item.key)}>
                        {item.title}
                        {sortIcon}
                    </button>
                </th>
            );
        }

        return (
            <th key={item.title}>{item.title}
            </th>
        );
    });

    //-------------- create rows -----------------------
    let rows;
    if (!datastate.loading && !datastate.error && datastate.data.length === 0) {
        rows = <tr key="NoRecord">
            <td align="center" colSpan={props.columns.length}>No Record founds</td>
        </tr>
    }
    else {
        var index = 1;
        rows = datastate.data.map(record => {

            let adEl = null;
            // show advertisement ----------------
            if (index % props.RowCountForAd === 0) {

                let rand;
                if(advertisements.length > index/props.RowCountForAd){
                    rand = advertisements[index/props.RowCountForAd-1];
                }
                else{
                    // check for duplication of random number
                    while (true) {
                        rand = Math.floor(Math.random() * 1000);
                        if (_.indexOf(advertisements, rand) === -1) {
                            setAdvertisements([...advertisements, rand]);                            
                            break;
                        }
                    }
                }
                adEl = (
                    <tr>
                        <td align="center" colSpan={props.columns.length}>
                            <img alt={rand.toString()} src={props.adUrl + rand} ></img>
                        </td>
                    </tr>);
            }

            // create rows -----------------------
            let columns = props.columns.map(column => {

                if (column.renderer !== undefined) {
                    let renderData = column.renderer(record[column.key as keyof Record], record);
                    return (<td>{renderData}</td>);
                }
                else {
                    return (<td>{record[column.key as keyof Record]}</td>);
                }
            });

            index++;
            return (
                <Fragment>
                    {adEl}
                    <tr data-testid={record[props.key as keyof Record]} key={record[props.key as keyof Record]}>
                        {columns}
                    </tr>
                </Fragment>
            );
        })
    }

    //-------------- return elements -----------------------
    return (
        <table className="table table-striped table-bordered">
            <thead>
                <tr data-testid="headers" key="headers">
                    {header}
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
            <tfoot>
                {!datastate.loading ? null :
                    <tr>
                        <td align="center" colSpan={props.columns.length}><Loading /></td>
                    </tr>
                }
                {!datastate.allLoaded ? null :
                    <tr>
                        <td align="center" colSpan={props.columns.length}>~ end of catalogue ~</td>
                    </tr>
                }
                {!datastate.error ? null :
                    <tr>
                        <td align="center" colSpan={props.columns.length}><ErrorHandler /></td>
                    </tr>
                }
            </tfoot>
        </table>
    );
}

export default DataGrid;