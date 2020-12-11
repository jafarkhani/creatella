import React from 'react';
import DataGrid from '../DataGrid/DataGrid';
import { Product } from '../../modals/product';
import XDate from '../../utils/XDate';

const ProductGrid = () => {

    const DataUrl = "http://localhost:5000/products";
    const adUrl = "http://localhost:5000/ads/?r=";

    let columns = [
        {title: "ID", key: "id", sortable: true},
        {title: "Face", key: "face", renderer: (value:number,record:Product)=>{
            return (<span style={{fontSize: record.size+'px'}}>{value}</span>)
            }
        },       
        {title: "Price", key: "price", sortable: true, renderer:(value:number,record:Product)=>{
            return (<span>{"$" + value/100}</span>)
        }},
        {title: "Size", key: "size", sortable: true},
        {title: "Added Date", key: "date" , renderer:(value:string, record:Product)=>{
            let days = XDate.getDaysBetweenDates(value, XDate.now());
            if(days < 7)
                return days + " days ago";
            if(days === 7)
                return "1 week ago";
            
            return XDate.format(value, "dS M Y");
        }}
    ]

    return (

        <div>
            <DataGrid 
                pageCount={32}
                columns={columns}
                dataUrl={DataUrl}               
                adUrl={adUrl}
                key="id"
                RowCountForAd={20}
            />
        </div>
    );
}

export default ProductGrid;