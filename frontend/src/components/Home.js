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
    //prices filter
    const [price, setPrice] = useState([1, 1000]);
    //category filter
    const [category, setCategory] = useState("");
    // filter rating
    const [rating, setRating] = useState(0); 

    const Categories =[
        'Electronics',
        'Cameras',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        "Books",
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'      
    ]

    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading , products, error, productsCount, resultPerPage, filterProductCount } = useSelector(state => state.products);

    const keyword = match.params.keyword;

    //slider

    const createSliderWithTooltip  = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);


    useEffect(() => {
        if(error){
            return alert.error(error);
        }
        dispatch(getProducts(keyword, currentPage, price, category, rating));
       
    }, [dispatch, alert, error, keyword, currentPage, price, category, rating]);

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber);
    }

    let count = productsCount;

    if(keyword){
        count = filterProductCount;
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
                                                <hr className="my-5"/>

                                                <div className="mt-5">
                                                    <h4 className="mb-3">
                                                        Categories
                                                    </h4>
                                                <ul className="pl-0">
                                                    {Categories.map(category =>(
                                                        <li style={{cursor: "pointer", listStyleType: "none" }}
                                                        
                                                        key= {category}
                                                        onClick={() => setCategory(category)}
                                                        
                                                        >
                                                           {category}
                                                        </li>
                                                    ))}
                                                </ul>

                                                </div>


                                                <hr className="my-3"/>

                                                <div className="mt-5">
                                                    <h4 className="mb-3">
                                                       Ratings
                                                    </h4>
                                                <ul className="pl-0">
                                                    {[5, 4, 3, 2, 1].map(star =>(
                                                        <li style={{cursor: "pointer", listStyleType: "none" }}
                                                        
                                                        key= {star}
                                                        onClick={() => setRating(star)}
                                                        
                                                        >
                                                           <div className="rating-outer">
                                                               <div className="rating-inner" 
                                                                    style={{ width: `${star * 20}%` }}>
                                                                </div>
                                                           </div>
                                                        </li>
                                                    ))}
                                                </ul>

                                                </div>


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
                    

                    {resultPerPage <= count && (
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
