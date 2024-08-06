"use strict"

// yetki kontrolü yapmak istiyoruz


// bu programım persone yönetim programı herkesin erişebildiği bir program değil./programdak modellere üye olmayan kimse erişemez login olması gerekir/
module.exports = {

    // permission check yapmak istediğim durum login olup olmadığı..login olunca token veriyor sistem..kullanıcı bana token göndermeyebilir.bunu kontrol edeceğim permission middleware yazıyorum
    isLogin: (req, res, next) => {
        //! User giriş yapıp yapmadığını kontrol edeceğim middleware 

        // eğer kullanıcı giriş yaptıysa req.teki user dolu olacak
        if (req.user && req.user.isActive) {

            next()  // eğer kullanıcı active ise devam eder
        }
        else {
            res.errorStatusCode = 403
            throw new Error('No Permission: You must login')
        }
    },

    isAdmin: (req, res, next) => {

        if (req.user && req.user.isActive && req.user.isAdmin)
            {next()

            }
            else{

                res.errorStatusCode = 403
                throw new Error('No Permission: You must login and to be Admin')
            }

            
        },

        //! burada kişi adminse genel yetkili**genel yetkili lead yetkilerine sahip admin olan heryere erişebilir.admin olmayıp lead olanlar var
        isAdminOrLead:(req,res,next)=>{

            const departmentId = req.params?.id
            // if(req.user && req.user.isActive && (req.user.isAdmin || req.user.isLead)){

            if(req.user && req.user.isActive &&(req.user.isAdmin || req.user.isLead && req.user.departmentId == departmentId)){ //! buradaki departmentId yukarıda parametrei ile alıyoruz ve burada user'ın erişmek istediği departmentId ile kendi departmanId aynı diye check ediyoruz...eğer aynı ise izin ver

                next()
            }
            else{
                res.errorStatusCode = 403
                throw new Error('No Permission: You must login and to be Admin or Department Lead(own)')
            }
        }

}