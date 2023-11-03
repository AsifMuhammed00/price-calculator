import { defineService, Data } from "@skyslit/ark-backend";

// Replace 'hello-service' with a unique service id (unique within the module)
export default defineService("list-all-products", (props) => {
    const { useModel } = props.use(Data);
    const ProductModel = useModel("product");
    props.defineLogic(async (props) => {
        let group: any = null;
        await new Promise(async (operationComplete, error) => {
            const { groupId } = props.args.input;
            group = await ProductModel.find({}).exec();
            operationComplete(true);
        });
        return props.success({ message: "products listed" }, group);
    });
});