import mongoose from 'mongoose';
import { getConfiguration } from '../config';
import { CustomerModel } from '../models';
import { ProductModel } from '../models';

let CustomerMappedModel = mongoose.model('customers', CustomerModel);
let ProductMappedModel = mongoose.model('products', ProductModel);

class DbService {
    static get Connection() {
        return mongoose;
    }

    static get Customers() {
        return CustomerMappedModel;
    }

    static get Products() {
        return ProductMappedModel;
    }
}

export {
    DbService
};
