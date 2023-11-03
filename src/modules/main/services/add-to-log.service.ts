import { defineService, Data } from '@skyslit/ark-backend';

export default defineService('add-to-log', (props) => {
    const { useModel } = props.use(Data);
    const LogSchema = useModel("log");

    props.defineLogic(async (props) => {
        let product: any = null;
        const { products, totalPrice } = props.args.input;
        await new Promise(async (operationComplete, error) => {
            product = new LogSchema({
                products,
                totalPrice
            });
            await product.save();
            operationComplete(true);

        });
        return props.success({ message: 'Log added' }, product);
    });
});