import React from "react";
import { createComponent, Frontend } from "@skyslit/ark-frontend";
import { Col, Row, Typography, Layout, Button, Input, message, Divider, Card, List, Modal, InputNumber } from "antd";
// import '../styles/admin-page.scss';
import Lottie from "react-lottie";
import AbstractBlue from "../assets/lottie-files/abstract-blue-and-yellow.json";
import { useHistory } from "react-router-dom";
import { LoadingOutlined } from '@ant-design/icons';
import { Helmet } from "react-helmet-async";
import Fade from "react-reveal/Fade";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;
const { Header, Content } = Layout;

export default createComponent((props) => {
    const { useService } = props.use(Frontend);

    const addOrUpdateProduct = useService({ serviceId: "add-or-update-product" });
    const listAllProduct = useService({ serviceId: "list-all-products" });

    const [showEditModal, setShowEditModal] = React.useState(false);

    const [productName, setProductName] = React.useState("")
    const [price, setPrice] = React.useState(0)
    const [mode, setMode] = React.useState("")
    const [allProducts, setAllProducts] = React.useState([])
    const [productId, setProductId] = React.useState("")
    const [keyword, setKeyword] = React.useState("")


    const addNewProduct = React.useCallback(() => {
        addOrUpdateProduct.invoke({
            productName:productName.toLowerCase(),
            price,
            mode
        }, { force: true })
            .then((res) => {
                handleListAllProduct()
                setShowEditModal(false)
                setProductName("")
                setPrice(0)
            })
            .catch((e) => {
                message.error(e.message)
            })
    }, [productName, price, mode])

    const editProduct = React.useCallback(() => {
        addOrUpdateProduct.invoke({
            productName: productName.toLowerCase(),
            price,
            productId,
            mode
        }, { force: true })
            .then((res) => {
                handleListAllProduct()
                setShowEditModal(false)
                setProductName("")
                setPrice(0)
            })
            .catch((e) => {
                message.error(e.message)
            })
    }, [productName, price, mode, productId])

    const filteredProducts = React.useMemo(()=>{
        const regex = new RegExp(keyword, 'i');
        if(keyword){
            return allProducts.filter(product => regex.test(product.productName));
        } else{
            return allProducts
        }
    },[keyword,allProducts])

    const handleListAllProduct = React.useCallback(() => {
        listAllProduct.invoke({}, { force: true })
            .then((res) => {
                setAllProducts(res.data)
            })
            .catch((e) => {
                message.error(e.message)
            })
    }, [productName, price, mode])

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleModalCancel = () => {
        setShowEditModal(false);
        setMode("")
        setPrice(0)
        setProductName("")
    };

    React.useEffect(() => {
        handleListAllProduct()
    }, [])

    return (
        <Layout>
            <Header>
                <Input placeholder="Search" onChange={(e)=>{setKeyword(e.target.value)}}/>
            </Header>
            <Content>
                <div style={{ padding: "20px 24px", background: "white", width: "100%" }}>
                    <Button type="primary" onClick={() => { handleEditClick(), setMode("new") }}>Add New</Button>
                </div>

                {filteredProducts.map((product: any, index) => (
                    <Card
                        key={index}
                        title={product.productName}
                        extra={<Button onClick={() => {
                            handleEditClick(),
                            setMode("edit"),
                            setPrice(product.price),
                            setProductName(product.productName),
                            setProductId(product._id)
                        }}>
                            Edit</Button>}
                    >
                        <p>Price: {product.price}</p>
                    </Card>
                ))}
            </Content>
            <Modal
                title="Edit Product"
                visible={showEditModal}
                onOk={mode === "new" ? addNewProduct : editProduct}
                onCancel={handleModalCancel}
                okButtonProps={{ disabled: addOrUpdateProduct.isLoading || !price || !productName }}
                okText={addOrUpdateProduct.isLoading ? "Please Wait" : mode === "edit" ? "Edit" : "Add"}
            >
                <Input
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
                <InputNumber
                    style={{ marginTop: 20 }}
                    placeholder="Product Price"
                    value={price}
                    onChange={(value:any) => setPrice(value)}
                />

            </Modal>
        </Layout>
    );
});
