import React from 'react';
import {Fragment, useEffect, useState } from "react";
import Pagination from "react-js-pagination";


import MetaData from "./layouts/MetaData";
import Product from "./product/Product";
import Loader from "./layouts/Loader";

import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions"; 
import { useAlert } from "react-alert";

const Home = ({ match }) => {

    const [currentPage, setCurrentPage] = useState(1);

    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading , products, error, productsCount, resultPerPage } = useSelector(state => state.products);

    const keyword = match.params.keyword;

    useEffect(() => {
        if(error){
            return alert.error(error);
        }
        dispatch(getProducts(keyword, currentPage));
       
    }, [dispatch, alert, error, keyword, currentPage])

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber);
    }



    
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
                    

                    {resultPerPage <= productsCount && (
                         <div className="d-flex justify-content-center mt-5">
                         <Pagination 
                             activePage ={currentPage}
                             itemsCountPerPage={resultPerPage}
                             totalItemsCount={productsCount}
                             onChange={setCurrentPageNo}
                             nextPageText = {"Next"}
                             prevPageText = {"Prev"}
                             firstPageText = {"first"}
                             lastPageText = {"last"}
                             itemClass = "page-item"
                             linkClass = "page-link"
                         />
                     </div>
                    )}
                   

                </Fragment>
            )} 
        </Fragment>
    )
}

export default Home;
