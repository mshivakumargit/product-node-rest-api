import express from 'express';
import { ProductService } from '../services';
import { PushNotificationEvents, HttpStatusCodes, ErrorConstants } from '../constants';

const MIN_SEARCH_LENGTH = 3;
const MIN_PRODUCT_ID = 1;

class ProductRouting {
    constructor(pushNotificationService) {
        this.productService = new ProductService();
        this.pushNotificationService = pushNotificationService;
        this.routerDefinition = express.Router();

        this.initializeRouting();
    }

    initializeRouting() {
        this.routerDefinition.get('/', async (request, response) => {
            try {
                let products = await this.productService.getProducts();

                response
                    .status(HttpStatusCodes.OK)
                    .send(products);
            } catch (error) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send({
                        reason: ErrorConstants.UNKNOWN_ERROR
                    });
            }
        });

        this.routerDefinition.get('/search/:productName', async (request, response) => {
            try {
                let productName = request.params.productName;
                let validation = productName && productName.length >= MIN_SEARCH_LENGTH;

                if (!validation) {
                    response
                        .status(HttpStatusCodes.BAD_REQUEST)
                        .send({
                            status: ErrorConstants.INVALID_ARGUMENTS
                        });

                    return;
                }

                let filteredProducts = await this.productService.filterProducts(productName);

                response
                    .status(HttpStatusCodes.OK)
                    .send(filteredProducts);
            } catch (error) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send({
                        status: ErrorConstants.UNKNOWN_ERROR
                    });
            }
        });

        this.routerDefinition.get('/detail/:productId', async (request, response) => {
            try {
                let productId = parseInt(request.params.productId);
                let validation = productId && productId >= MIN_PRODUCT_ID;

                if (!validation) {
                    response.status(HttpStatusCodes.BAD_REQUEST)
                        .send({
                            reason: ErrorConstants.INVALID_ARGUMENTS
                        });

                    return;
                }

                let filteredProduct = await this.productService.getProduct(productId);

                response.status(HttpStatusCodes.OK)
                    .send(filteredProduct);
            } catch (error) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send({
                        status: ErrorConstants.UNKNOWN_ERROR
                    });
            }
        });

        this.routerDefinition.post('/', async (request, response) => {
            try {
                let product = request.body;
                let validation = product && (product.id || product.productId) &&
                product.title && product.unitprice;

                if (!validation) {
                    response
                        .status(HttpStatusCodes.BAD_REQUEST)
                        .send({
                            reason: ErrorConstants.INVALID_ARGUMENTS
                        });

                    return;
                }

                product.id = product.id || product.customerId;

                let savedProductRecord = await this.productService.saveProduct(product);

                if (this.pushNotificationService) {
                    this.pushNotificationService.notify(
                        PushNotificationEvents.NEW_PRODUCT, savedProductRecord);
                }

                response
                    .status(HttpStatusCodes.CREATED)
                    .send(savedProductRecord);
            } catch (error) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send({
                        status: ErrorConstants.UNKNOWN_ERROR
                    });
            }
        });
    }

    get Router() {
        return this.routerDefinition;
    }
}

export {
    ProductRouting
};
