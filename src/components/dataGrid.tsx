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
    })

    return (
        <table >
            <thead>
                <tr>
                    {header}
                </tr>
            </thead>
        </table>
    );
}

export default DataGrid;