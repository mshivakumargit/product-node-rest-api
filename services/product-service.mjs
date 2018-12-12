import { DbService } from './db-service';
import { getConfiguration } from '../config';
import { ErrorConstants } from '../constants';

const MIN_SEARCH_LENGTH = 3;

async function connect() {
    let connectionString = getConfiguration().ConnectionString;

    await DbService.Connection.connect(connectionString);
}

async function disconnect() {
    await DbService.Connection.disconnect();
}

class ProductService {
    async getProducts() {
        let products = null;

        try {
            await connect();

            products = await DbService.Products.find({});
        } catch (error) {
            console.log(`Error Occurred, Details : ${JSON.stringify(error)}`);

            throw error;
        } finally {
            await disconnect();
        }

        return products;
    }

    async filterProducts(productName) {
        let filteredProducts = null;
        let validation = productName && productName.length >= MIN_SEARCH_LENGTH;

        if (!validation)
            throw new Error(ErrorConstants.BUSINESS_VALIDATION_FAILED);

        try {
            await connect();

            filteredProducts = await DbService.Products.find({
                title: new RegExp(productName, 'i')
            });
        } catch (error) {
            console.log(`Error Occurred, Details : ${JSON.stringify(error)}`);

            throw error;
        } finally {
            await disconnect();
        }

        return filteredProducts;
    }

    async getProduct(productId) {
        if (!productId)
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);

        let filteredProduct = null;

        try {
            await connect();

            filteredProduct = await DbService.Products.findOne({
                id: productId
            });
        } catch (error) {
            console.log(`Error Occurred, Details : ${JSON.stringify(error)}`);

            throw error;
        } finally {
            await disconnect();
        }

        return filteredProduct;
    }

    async saveProduct(product) {
        let validation = product && product.id && product.title &&
        product.description && product.unitprice && product.sellingprice && product.unitsinstock &&
        product.remarks && product.productphotourl;

        if (!validation)
            throw new Error(ErrorConstants.BUSINESS_VALIDATION_FAILED);

        let savedProductRecord = null;

        try {
            await connect();

            savedProductRecord = await DbService.Products.create(product);
        } catch (error) {
            console.log(`Error Occurred, Details : ${JSON.stringify(error)}`);

            throw error;
        } finally {
            await disconnect();
        }

        return savedProductRecord;
    }
}

export {
    ProductService
};
