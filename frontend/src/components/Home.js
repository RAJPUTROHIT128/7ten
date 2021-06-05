import React from 'react';
import {Fragment, useEffect, useState } from "react";
import Pagination from "react-js-pagination";


import MetaData from "./layouts/MetaData";
import Product from "./product/Product";
import Loader from "./layouts/Loader";

import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions"; 
import { useAlert } from "react-alert";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Home = ({ match }) => {

    //pagination 
    const [currentPage, setCurrentPage] = useState(1);
    //prices
    const [price, setPrice] = useState([1, 1000]);

    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading , products, error, productsCount, resultPerPage } = useSelector(state => state.products);

    const keyword = match.params.keyword;

    //slider

    const createSliderWithTooltip  = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);


    useEffect(() => {
        if(error){
            return alert.error(error);
        }
        dispatch(getProducts(keyword, currentPage, price));
       
    }, [dispatch, alert, error, keyword, currentPage, price]);

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

                            {keyword ? (
                                <Fragment>
                                    <div className="col-6 col-md-3 mt-5 mb-5">
                                        <div className="px-5">
                                            <Range 
                                                marks={{ 
                                                    1: `$1`,
                                                    1000: `1000`
                                                }}
                                                min={1}
                                                max={1000}
                                                defaultValue={[1,1000]}
                                                tipFormatter={value => `$${value}`}
                                                tipProps ={{
                                                    placement: "top",
                                                    visible: true
                                                }}
                                                value={price}
                                                onChange={price => setPrice(price)}
                                                />
                                        </div>
                                    </div>

                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                       { products && products.map(product =>(
                                        <Product key={product._id} product={product} col={4} />
                                         ))}
                                        </div>
                                    </div>

                                </Fragment>
                            ) : (
                                products && products.map(product =>(
                                    <Product key={product._id} product={product} col={3} />
                                ))
                            )}  
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
