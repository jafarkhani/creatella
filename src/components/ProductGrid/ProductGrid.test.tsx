import { cleanup, render, waitFor } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';
import ProductGrid from './ProductGrid';
import CharacterInfo from './ProductGrid';

describe("Product datagrid component tests", ()=>{

    afterEach(cleanup);
    
    it("renders without crashing", () => {
        let wrapper = shallow(<ProductGrid />)
        expect(wrapper.length).toBe(1)
    });

    it("renders correctly", () => {
        const wrapper = shallow(<ProductGrid />);
        expect(wrapper.find("DataGrid").length).toEqual(1);
    });

})