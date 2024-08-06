/*--------------
"use strict";
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- *
const router = require("express").Router();
/* ------------------------------------------------------- *

const department = require("../controllers/department.controller");

const permissions = require('../middlewares/permissions')

/* ------------------------------------------------------- *
router.route("/")
.get(permissions.isLogin,department.list) //! burada department listelemesini login olanlar görecek
.post(permissions.isAdmin,department.create);//?create işlemini sadece admin yapabilir

router
  .route("/:id")
  .get(department.read)
  .put(department.update)
  .patch(department.update)
  .delete(department.delete);

router.get("/:id/personnels", department.personnels);

module.exports = router;

/*-------------------------------*/

"use strict";
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const department = require("../controllers/department.controller");

// const { isAdmin, isAdminOrLead, isLogin } = require('../middlewares/permissions') //! permissions'taki bütün datalar kullanılacağı için destructing yapmadım doğrudan hepsini değişkene atadım ve aşağıda .notasyonu ile kullanıyorum

const permissions = require('../middlewares/permissions')

/* ------------------------------------------------------- */

router.route("/")
  .get(permissions.isLogin, department.list)//! Görüntülemeyi herhangi bir kullanıcı yapabilir.
  .post(permissions.isAdmin, department.create); //? admin dışındakiler deparment create edemez

router.route("/:id")
  .get(permissions.isLogin, department.read)// departman detay okuma login
  .put(permissions.isAdmin, department.update)
  .patch(permissions.isAdmin, department.update)
  .delete(permissions.isAdmin, department.delete);

router.get("/:id/personnels", permissions.isAdminOrLead, department.personnels); //! departman içindeki personel listelemeyi admin ya da lead yapabilir

module.exports = router;

