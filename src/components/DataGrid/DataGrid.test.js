import { cleanup, render, waitFor } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';
import DataGrid from './DataGrid';


describe("datagrid component tests", ()=>{

    afterEach(cleanup);
    
    jest.spyOn(global, "fetch").mockImplementation(() =>    
      Promise.resolve({      
        json: () => Promise.resolve([
            {
                date: "Mon Nov 30 2020 22:49:12 GMT+0330 (Iran Standard Time)",
                face: "(ᵔᴥᵔ)",
                id: "66556-elxns2pxl3c_32",
                price: 950,
                size: 15
            }
        ])    
      })  
    );    
    const props = {
        pageCount: 32,
        columns: [
            {title: "ID", key: "id", sortable: true},
            {title: "Field1", key: "field1"},
            {title: "Field2", key: "field2", renderer: (value,record) => {
                return (<span>{value}-{record.id}</span>)
                }
            }
        ],
        dataUrl: "",
        adUrl: "",
        key: "id",
        RowCountForAd: 20
    }

    it("renders without crashing", () => {
        let wrapper = shallow(<DataGrid {...props}/>)
        expect(wrapper.length).toBe(1)
    });

    it("renders correctly", async () => {
        
        const {getByTestId} = render(<DataGrid {...props}/>);            
        expect(getByTestId("loading")).toBeTruthy();
    });


    it("create headers correctly", async () => {
        
        const {getByTestId} = render(<DataGrid {...props} />);
        await waitFor(() => getByTestId("headers"));

        expect(getByTestId("headers").textContent).toContain(props.columns[0].title);
        expect(getByTestId("headers").textContent).toContain(props.columns[1].title);
        expect(getByTestId("headers").textContent).toContain(props.columns[2].title);
        
    });

    
})