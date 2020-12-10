import React, { useEffect, useState } from 'react';
import DataGrid from './DataGrid';
import { Product } from '../modal/product';

const ProductGrid = () => {

    const [data, SetData] = useState<Product[] | null>(null);
    useEffect(()=> {

        const fetchData = async () => {

            fetch("http://localhost:5000/products?_page=10&_limit=15")
            .then(response => response.json())
            .then(response => {
                console.log(response);
                SetData(response);
            })
        }

        fetchData();
    },[]);


    let columns = [
        {title: "id", field: "id", sortable: true},
        {title: "price", field: "price", sortable: true}
    ]

    return (

        <div>
            <DataGrid 
                columns={columns}
                data={data}
            />
        </div>
    );
}

export default ProductGrid;