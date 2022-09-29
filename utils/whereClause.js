// base - Product.find()

class WhereClause{
    cosntructor(base, bigQuery){
        this.base = base;
        this.bigQ = bigQuery
    }

    search(){
        const searchword = this.bigQ.search ? {
            name: {
                $regex: this.bigQ.search,
                $options: 'i'
            }
        } : {}

        this.base = this.base.find({...searchword})
        return this;
    }

    pager(resultPerPage){

        let currentPage = 1;
        if(this.bigQ.page) {
            currentPage = this.bigQ.page
        }

        const skipVal = resultPerPage * (currentPage - 1)

        this.base = this.base.limit(resultPerPage).skip(skipVal)
        return this;
    }

    filter(){
        const copyQ = {...this.bigQuery}

        delete copyQ["search"];
        delete copyQ["limit"];
        delete copyQ["page"]

        // convert bigQ into a string => copyQ
        let stringOfCopyQ = JSON.stringify(copyq)

        stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte|gt|lt)\b/g, m => `$${m}`)
    
        let jsonOfCopyQ = JSON.parse(stringOfCopyQ)

        this.base = this.base.find(jsonOfCopyQ)
    
    }
}