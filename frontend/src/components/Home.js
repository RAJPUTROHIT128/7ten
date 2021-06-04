import React from 'react';
import {Fragment, useEffect } from "react";
import MetaData from "./layouts/MetaData";
import Product from "./product/Product";
import Loader from "./layouts/Loader";

import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions"; 

const Home = () => {

    const dispatch = useDispatch();
    const { loading , products, error, productsCount } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch])



    
    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={"Buy best Product Online"} />
                    <h1 id="products_heading">Latest Products</h1>

                    <section id="products" className="container mt-5">  
                        <div className="row">
                            {products && products.map(product =>(
                                <Product key={product._id} product={product} />
                            ))}   
                        </div>
                    </section>
                </Fragment>
            )} 
        </Fragment>
    )
}

export default Home;
