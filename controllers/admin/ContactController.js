const ContactModel = require('../../Model/contact')
const contactmodel = require('../../Model/contact')

class ContactController {

    static contactview = async(req,res)=>{
        const contactdata = await ContactModel.find()
        //console.log(contactdata)
        res.render("admin/contact/contactdisplay",{cd:contactdata})
    }
    static contactadd = async(req,res)=>{
        try {
            const result = new ContactModel({
              name: req.body.name,
              email: req.body.email,
              phone: req.body.phone,
              message:req.body.message
              
            });
            await result.save();
            //route url(app.js) in redirect
            res.redirect("/blog");
          } catch (err) {
            console.log(err);
          }
    }

}
module.exports = ContactController