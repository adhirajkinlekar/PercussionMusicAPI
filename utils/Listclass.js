class List{
    constructor(query,queryString){
       this.query = query;
       this.queryString = queryString;
    }

    filter(){
    //genre=Software Development&likes[lte]=2
    const queryObj = {...this.queryString};
    const excludeFields = ['page','sort','limit','fields']
    excludeFields.forEach(el=> delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    //This returns a query which is stored in query variable
    // let query = ListModel.find({name:"Angular Features"});
    this.query.find(JSON.parse(queryStr));

    return this;
    }
    sort(){
        if(this.queryString.sort){
            //sort=name
           // setting it to minus will give descending results ie - sort= -name
           //the we can sort by another criteria by adding a comma and mentioning the sort value ie - sort=name,topic
            //query = query.sort(req.query.sort)
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)
        }
        else{
            this.query = this.query.sort('_id')
        }
        return this;
    }

    select(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields)
        }
        else{
            this.query = this.query.select('-__v')
        }
        return this;
     
    }

    paginate(){
        let page = this.queryString.page * 1 ||1;
        let limit = this.queryString.limit * 1 || 10;
        let skip = (page-1) * limit;
    
        if(this.queryString.page && this.queryString.limit){
           
            this.query = this.query.skip(skip).limit(limit)
        }
        return this;
    }
}

module.exports = List;