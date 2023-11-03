import { defineService, Data } from '@skyslit/ark-backend';

export default defineService('add-or-update-product', (props) => {
    const { useModel } = props.use(Data);
    const ProductModel = useModel("product");

    props.defineLogic(async (props) => {
        let product: any = null;
        const { productName, price, mode, productId } = props.args.input;
        await new Promise(async (operationComplete, error) => {
            if (mode === 'new') {
                const existingTitle = await ProductModel.findOne({
                    productName,
                }).exec();
                if (!existingTitle) {
                    product = new ProductModel({
                        productName,
                        price
                    });
                    await product.save();
                    operationComplete(true);
                } else {
                    error({ message: "Product Already Exists" });
                }
            } else {
                product = await ProductModel.findOne({
                    _id: productId,
                }).exec();
                if (product) {
                    product.productName = productName ? productName : product.productName;
                    product.price = price ? price : product.price;
                    await product.save();
                    operationComplete(true)
                } else {
                    error({ message: "Group with this id not found" });
                }
            }
        });
        return props.success({ message: 'Product added' }, [product]);
    });
});