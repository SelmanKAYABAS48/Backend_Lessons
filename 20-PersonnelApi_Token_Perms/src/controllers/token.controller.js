"use strict";
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */
const Token = require("../models/token.model");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(Token);

    res.status(200).send({
      error: false,
      data,
      detail: await res.getModelListDetails(Token),
    });
  },

  create: async (req, res) => {
    const data = await Token.create(req.body);
    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    const data = await Token.findOne({ _id: req.params.id });

    res.status(200).send({
      error: false,
      data,
    });
  },


  update: async (req, res) => {
    const data = await Token.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data,
      new: await Token.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    const data = await Token.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 204 : 404 ).send({
//! : 404 zaten silinmişse bulamıyor hata veriyor

      error: !data.deletedCount, //? burası ya 0 ya 1 verecek ünlem ile tersini aldı

    //   deletedCount, Mongoose'un silme işlemlerinde döndürdüğü sonuç nesnesinin bir özelliğidir. Bu özellik, kaç belgenin silindiğini gösterir. deleteOne, deleteMany gibi silme işlemleri yapıldığında, Mongoose tarafından döndürülen sonuç nesnesi belirli alanlar içerir ve bunlardan biri de deletedCount'tur.
      
      data,
    });
  },

 
};

