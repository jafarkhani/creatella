import React from 'react';

import { Product } from '../modal/product';

interface Column {
    title: string,
    field: string,
    sortable?: boolean
}
interface Props {
    columns: Column[],
    data: Product[] | null
}

const DataGrid: React.FC<Props> = (props) => {

    let header = props.columns.map(item => {
        return (
            <th key={item.title}>{item.title}</th>
        );
    });

    let rows;
    if(props.data == null){
        rows = <tr>
            <td colSpan={props.columns.length}>No Record found</td>
        </tr>
    }
    else{
        rows = props.data.map(record => {

            let columns = props.columns.map(column => {
                return (
                    <td>{record[column.field as keyof Product]}</td>
                );
            });

            return (
                <tr>
                    {columns}
                </tr>
            );
        })
    }

    return (
        <table className="table table-striped table-bordered">
            <thead>
                <tr>
                    {header}
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

export default DataGrid;