// User.find({ qty: { $lte: 20}})
// /api/v1/product?search=coder&page=1&category=shortsleeves&rating[gte]=4
// &price[lte]=999&price[gte]=199

// rating: { $gte: '4'}
//______________________________________________________________________

//URL - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace

// const p = 'gte gte lte mygte'

// const regex = /\b(gte|lte)\b/g;
// console.log(p.replace(regex, m => `$${m}`))

//output: "$gte $gte $lte mygte"