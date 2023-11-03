import { defineService, Data } from "@skyslit/ark-backend";

export default defineService("get-logs", (props) => {
    const { useModel } = props.use(Data);
    const LogModel = useModel("log");
    props.defineLogic(async (props) => {
        let logs: any = null;
        let result: any = null;

        await new Promise(async (operationComplete, error) => {
            const { date } = props.args.input;
            const inputDate = new Date(date);
            const startOfDay = new Date(inputDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(inputDate);
            endOfDay.setHours(23, 59, 59, 999);
            logs = await LogModel.find({
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                }
            }).exec();
            const productCounts = {};
            let total = 0;

            logs.forEach(order => {
                total += order.totalPrice;
                order.products.forEach(product => {
                    const { productName, Qty } = product;
                    if (productCounts[productName]) {
                        productCounts[productName] += Qty;
                    } else {
                        productCounts[productName] = Qty;
                    }
                });
            });

            const products = Object.keys(productCounts).map(productName => ({
                itemName: productName,
                count: productCounts[productName],
            }));
            result = {
                products,
                total,
            };
            operationComplete(true);
        });
        return props.success({ message: "logs listed" }, result);
    });
});