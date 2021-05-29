class APIFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        }: {}

        console.log(keyword);
        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){

        const queryCopy = { ...this.queryStr };
        //console.log(queryCopy);

        //Removing field from the query string
        const removeFields = ['keyword','limit','page']
        removeFields.forEach(element => delete queryCopy[element]);

        console.log(queryCopy);

        //filter for price and rating

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)


        console.log(queryStr);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;

    }
}

module.exports = APIFeatures;