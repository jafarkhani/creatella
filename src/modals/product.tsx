

import { Record } from './types';

export interface Product extends Record {
    date: Date,
    face: string,
    id: string,
    price: number,
    size: number
}
