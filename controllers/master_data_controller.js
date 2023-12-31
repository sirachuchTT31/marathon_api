let masterlocationModel = require('../models/master_location_model.js')
let error_message = require('../shared/status_message_func.js')
//location crud
exports.createLocation = async (req, res) => {
    try {
        if (req.body) {
            let location_id_auto_complies = "LOCATION"
            let math = Math.random() * 10000000
            let newmath = Math.ceil(math)
            let new_location_id_auto_complies = location_id_auto_complies + String(newmath)
            let newObject = {
                location_id: new_location_id_auto_complies,
                location_province: req.body.location_province,
                location_district: req.body.location_district,
                location_zipcode: req.body.location_zipcode,
                location_address: req.body.location_address
            }
            let newmasterModel = await masterlocationModel.create(newObject)
            if (newmasterModel) {
                res.json({
                    status: true,
                    status_code: 200,
                    message: "Created successfully !",
                    result: newObject.location_id
                })
            }
        }
        else {
            res.json(error_message.message_error_400)
        }
    }
    catch (e) {
        console.log(e)
    }
}

exports.getallLocation = async (req, res) => {
    try {
        let res_location = await masterlocationModel.findAll({
            order: [["location_province", "ASC"]],
        })
        if (res_location) {
            res.json({
                status: true,
                status_code: 200,
                message: 'Select all master location succesfully',
                result: res_location
            })
        }
        else {
            res.json(error_message.message_error_500)
        }
    }
    catch (e) {
        res.status(500)
    }
}