"use strict";
/* -------------------------------------------------------
    EXPRESSJS - BLOG Project with Mongoose
------------------------------------------------------- */

// Call Models:
const { BlogCategory, BlogPost } = require('../models/blogModel')

/* ------------------------------------------------------- */
// BlogCategory Controller:

module.exports.blogCategory = {

    //! Listeleme komutumuz find
    list: async (req, res) => {
        //? burada bütün kayıtları istiyorum
        const data = await BlogCategory.find()
        //* buradan BlogCategory route'a gidiyorum ve orada methodu belirtiyorum

        res.status(200).send({
            error: false,
            result: data
        })
    },

    // CRUD -->
    // create işlemi yaptım
    //! create read update delete CRUD işleminden dolayı 

    create: async (req, res) => {

        // res.send('create method')

        const data = await BlogCategory.create(req.body)
        // console.log(data)

        res.status(201).send({
            error: false,
            result: data
        })

    },

    read: async (req, res) => {
        //url'den gelen categoryId parametresi ile gelen isteği categoryId isilmli değişkene atadım ve bu değşikeni findOne'da yazdım 
        // const categoryId= req.params.categoryId
        // const data = await this.blogCategory.findOne({_id: categoryId})//! Tek kayıt okuma burada önemli olan hangi tek kayıtı getirecek buradan router'a gidip orada belirtiyorum  

        const data = await BlogCategory.findOne({ _id: req.params.categoryId }) // şeklinde de yazabilirim
        //! burada findById şeklide de yazabilirdim ancak arka planda da findOne çalışıyorişin kolaylığı bakımından bu yazım şeklini de kullanabiliriz

        res.status(200).send({
            error: false,
            result: data
        })

    },
    //! Burada 1 tane kaydı alacağım id'si ile ve güncellemek isteyeceğim 
    update: async (req, res) => {

        // const data= await blogCategory.updateOne({filter hangi kayıt},{data güncelleme yapacağım data})

        const data = await BlogCategory.updateOne({ _id: req.params.categoryId }, req.body) // categoryId url'si ile gelen parametreyi _id'ye aktar ve onu req.body ile güncelle

        //const data = await blogCategory.findOneAndUpdate({_id:req.params.categoryId},req.body)

        res.status(202).send({
            error: false,
            result: data,//güncelleme işleminin sayısal değerleri //! return olarak sayısal değerler alıyorum
            new: await BlogCategory.findOne({ _id: req.params.categoryId })// new kısmı güncellenmiş data'yı gösterir

        }) //! bunu yazdıktan sonra router'a bağlamayı unutma
    },

    delete: async (req, res) => {

        const data = await BlogCategory.deleteOne({ _id: req.params.categoryId }) // FILTER ilk parametresi Tek bir kaydı silmek istiyoruz Burada kaydı zaten sileceğim için req.body'e ihtiyacım yok

        console.log(data);

        // res.status(204).send({
        //     error:false,
        //     result:data}
        // ) //! router'a bağlamayı unutma

if(data.deletedCount >=1){

    res.sendStatus(204)
    // error false
}
else{
    res.errorStatusCode = 404
    throw new Error('not Found')
    // error true
}

    }

}

/* ------------------------------------------------------- */
// BlogPost Controller:

module.exports.blogPost = {

    //! Listeleme komutumuz find
    list: async (req, res) => {
        //? burada bütün kayıtları istiyorum

        //! const data = await BlogPost.find({..filter},{ ...select}) SELECT İSTEDİKELRİMİ GÖSTER ..LİSTELEME YAPARKEN SELECT KULLANIRIZ ANCAK TEK BİR KAYIT İSTERKEN SELECT'E GEREK YOK
       // const data = await BlogPost.find({},{categoryId:true, title:true,content:true}) //? True false şeklinde de yazabilirim..sadece 3 field listelemesini istedim..burada _id otomatik olarak listeleniyor.

    //    const data = await BlogPost.find({},{_id:1,categoryId:1,title:1,content:1})

    const data = await BlogPost.find({},{_id:1,categoryId:1,title:1,content:1}).populate('categoryId') //! ÖNEMLİ categoryId blogPost'ta foreingKey'dir ancak bunun collection kısmında dataları var ve bu dataları görmek istiyorsam populate yapıyorum.tek bir sorgu ile blogPost'u alıyorum ve aynı zamanda onun içindeki dataları da görebiliyorum 

        //* buradan BlogCategory route'a gidiyorum ve orada methodu belirtiyorum

        res.status(200).send({
            error: false,
            result: data
        })
    },

    // CRUD -->
    // create işlemi yaptım
    //! create read update delete CRUD işleminden dolayı 

    create: async (req, res) => {

        // res.send('create method')

        const data = await BlogPost.create(req.body)
        // console.log(data)

        res.status(201).send({
            error: false,
            result: data
        })

    },

    read: async (req, res) => {
        //url'den gelen categoryId parametresi ile gelen isteği categoryId isilmli değişkene atadım ve bu değşikeni findOne'da yazdım 
        // const categoryId= req.params.categoryId
        // const data = await this.blogCategory.findOne({_id: categoryId})//! Tek kayıt okuma burada önemli olan hangi tek kayıtı getirecek buradan router'a gidip orada belirtiyorum  

        const data = await BlogPost.findOne({ _id: req.params.postId }) // şeklinde de yazabilirim 
        //? listelemede find yaparken 2.parametre olarak verdiğim select'i findOne'da da yapabilirim
        //! burada findById şeklide de yazabilirdim ancak arka planda da findOne çalışıyorişin kolaylığı bakımından bu yazım şeklini de kullanabiliriz

        res.status(200).send({
            error: false,
            result: data
        })

    },
    //! Burada 1 tane kaydı alacağım id'si ile ve güncellemek isteyeceğim 
    update: async (req, res) => {

        // const data= await blogCategory.updateOne({filter hangi kayıt},{data güncelleme yapacağım data})

        const data = await BlogPost.updateOne({ _id: req.params.postId }, req.body) // categoryId url'si ile gelen parametreyi _id'ye aktar ve onu req.body ile güncelle

        //const data = await blogCategory.findOneAndUpdate({_id:req.params.categoryId},req.body)

        res.status(202).send({
            error: false,
            result: data,//güncelleme işleminin sayısal değerleri //! return olarak sayısal değerler alıyorum
            new: await BlogPost.findOne({ _id: req.params.postId })// new kısmı güncellenmiş data'yı gösterir

        }) //! bunu yazdıktan sonra router'a bağlamayı unutma
    },

    delete: async (req, res) => {

        const data = await BlogPost.deleteOne({ _id: req.params.postId }) // FILTER ilk parametresi Tek bir kaydı silmek istiyoruz Burada kaydı zaten sileceğim için req.body'e ihtiyacım yok

        console.log(data);

        // res.status(204).send({
        //     error:false,
        //     result:data}
        // ) //! router'a bağlamayı unutma

if(data.deletedCount >=1){

    res.sendStatus(204)
    // error false
}
else{
    res.errorStatusCode = 404
    throw new Error('not Found')
    // error true
}

    }

}

/* ------------------------------------------------------- */