import ProductEditor from "../../components/ProductEditor";
import ProductList from "../../components/ProductList";
import { useState } from "react";

function AdminDashboard() {

    const [refresh, setRefresh] = useState(false);

    const reloadProducts = () => {
        setRefresh(!refresh);
    };

    return (

        <div className="p-10">

            <h1 className="text-3xl font-bold mb-6">
                Admin Dashboard
            </h1>

            <ProductEditor onCreated={reloadProducts} />

            <ProductList key={refresh} admin={true} />

        </div>

    )

}

export default AdminDashboard;