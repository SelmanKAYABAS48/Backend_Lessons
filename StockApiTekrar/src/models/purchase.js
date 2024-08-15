"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */
// Purchase Model:

const PurchaseSchema = new mongoose.Schema({

    userId: { //! kim satın aldı
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    firmId: {//! Hangi firmadan satın alındı
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm',
        required: true
    },

    brandId: {  //! hangi markadan satın alındı
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },

    productId: { //! Satın alınan ürün
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    quantity: { //!  Satın alınan adet
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    //* price kaç liradan quantity kaç adet aldım çarpıp yazacağım.Bunu controllerda create yada update yaparken yapabilirim.Ancak bunu fikir vermesi açısından model'de yapacağım.set metodu datayı gönderir burada function oluşturdum ve this ile yapıyı kurdum.Set metodunda DATA gönderilmediğinde çalışmaz.
    //? Password'den hatırla password gönderdiğimde set metodu onu şifreler.password göndermediğimde set metodu çalışmaz

    //! amount'u veri tabanına yazdırmazsam her kaydı çağırdığımda hesaplatma yapmam gerekecek.Ayrıca amount veri tabanında ne kadar yer kaplayacak ki.Küçük yer kaplamasından kaçınmak için her yerde hesaplama yapmak çok mantıklı değil..Amount'u hesaplatıp veri tabanına yazdırmak daha işlevsel.veri tabanına yazarken hesaplatmam performans açısından daha iyi olur

    // Model data işine bakar view görünteleme controller geri kalan  herşeye bakar

    amount: {
        type: Number,
        set: function() { return this.price * this.quantity }, // Data gönderilmediğinde çalışmaz.
        default: function() { return this.price * this.quantity }, // Sadece Create'de çalışır.
        transform: function() { return this.price * this.quantity }, // Update yaparken de hesaplasın.
    },

}, {
    collection: 'purchases',
    timestamps: true
})

/* ------------------------------------------------------- */
module.exports = mongoose.model('Purchase', PurchaseSchema)