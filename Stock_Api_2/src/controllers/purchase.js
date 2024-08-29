"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// Purchase Controllers:

const Purchase = require('../models/purchase')

const Product = require('../models/product') //! satıcı olarak ürün satın aldığımda product'taki ürün sayısını arttırsın yapacağım mesela 100 varsa 105 olsun

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "List Purchases"
            #swagger.description = `
                You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                    <li>URL/?<b>limit=10&page=1</b></li>
                </ul>
            `
        */

        const data = await res.getModelList(Purchase, {}, ['userId', 'firmId', 'brandId', 'productId'])

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Purchase),
            data
        })

    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Create Purchase"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: "#/definitions/Purchase"
                }
            }
        */

        // Set userId from logined user
        //! login olan user'dan tekrar userId istememek için:

        //* satış yapacaksam kullanıcı girişi yapmam gerekiyor bunu permission'da ayarlayacağım

        //post işleminde yani create'te 
        // "firmId": "65343222b67e9681f937f304",
        //   "brandId": "65343222b67e9681f937f123",
        //   "productId": "65343222b67e9681f937f422",gönderiyorum ancak beni burada userId göndermek zorunda bırakma diyoruz çünkü ben userId'mi bilemem

        req.body.userId = req.user._id 
        //! yukarıdaki kaydı eklemezsem bir başkası benim adıma işlem yapabilir.sanki ben satın almışım gibi





        const data = await Purchase.create(req.body)
 //? 68.satırda satın alma işlemi gerçekleşti

 //* Satın alma sonrası ürün adedini arttır:

 const updateProduct = await Product.updateOne({ _id:data.productId},{$inc:{quantity: + data.quantity} })
 //! data'dan gelen productId _id'ye eşit olanı bul ve 2.obje'de quantity'i arttır ne kadar arttırılması ise data.quantity'den veri ile arttır yani kaç tane satın aldıysam.
 //* quantity = orjinal miktar  data.productId ilgili product



        res.status(201).send({
            error: false,
            data
        })
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Get Single Purchase"
        */

        const data = await Purchase.findOne({ _id: req.params.id }).populate(['userId', 'firmId', 'brandId', 'productId'])

        res.status(200).send({
            error: false,
            data
        })

    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Update Purchase"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: "#/definitions/Purchase"
                }
            }
        */
//! update yaparken adet göndermeyebilir.body'de adet
            if(req.body?.quantity){}

        const data = await Purchase.updateOne({ _id: req.params.id }, req.body, { runValidators: true })

        res.status(202).send({
            error: false,
            data,
            new: await Purchase.findOne({ _id: req.params.id })
        })

    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Delete Purchase"
        */

        const data = await Purchase.deleteOne({ _id: req.params.id })

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })

    },

}