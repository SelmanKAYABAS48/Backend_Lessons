"use strict"

const { mongoose } = require('../configs/dbConnection')

//! Her user için özel token oluşturacağım..Burası modeli oluyor data alanı..

// Token Model:

const TokenSchema = new mongoose.Schema({

    //token modelinde 2 tane dataya ihtiyacım var

    // bu token hangi userId'ye ait
    userId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: ' Personnel ',//! bu obje Id hangi modelin obje Id'si 
        //? ref' modelin ismini hangi isim olarak verdiysek öyle yazacağız
        required: true,
        index:true
    },

    token:{
        type:String,
        trim:true,
        required:true,
        unique:true, //! aynı token'dan 1 tane daha olmaması lazım karışıklık olmaması için
        index:true //!

        // Bir alan için index: true ayarlandığında, Mongoose ve MongoDB o alan için bir indeks oluşturur. İndeksler, veritabanındaki belirli alanlarda arama yaparken performansı artırır. Örneğin, userId ve token alanına sık sık sorgu yapılacaksa (örneğin, belirli bir kullanıcıya ait belgeleri bulmak için), bu alanın indekslenmesi sorguların daha hızlı çalışmasını sağlar.Mesela token ile ilgili filtreleme yapacağım.user her ziyarette o tekn'ı token modeline soracağım.bu sorguyu çok yapacağım için lazım

    }

}
,

{
    collection: 'tokens',
    timestamps:true

})

module.exports =mongoose.model('Token', TokenSchema)