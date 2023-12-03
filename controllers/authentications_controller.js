const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
let memberModel = require('../models/member_model.js')
let authModel = require('../models/auth_model.js')
let organizerModel = require('../models/organizer_model.js')
exports.login = async (req, res) => {
    try {
        let { username, password } = req.body
        let auth_obj = await authModel.findAll({
            where: {
                username: username
            }
        })
        if (auth_obj.length != 0) {
            let new_auth_obj = {}
            new_auth_obj = auth_obj[0].dataValues
            let matchPassword = await bcrypt.compare(password, new_auth_obj.password)
            if (!matchPassword) {
                res.json({
                    status: false,
                    status_code: 400,
                    message: 'Password mismatch !',
                    result: null
                })
            }
            else {
                let payload = {
                    _id: new_auth_obj.auth_id,
                    username: new_auth_obj.username,
                    name: new_auth_obj.name,
                    lastname: new_auth_obj.lastname,
                    avatar: new_auth_obj.avatar,
                    role: new_auth_obj.role
                }
                jwt.sign(payload, 'jwtsecret', { expiresIn: 6000000000000000 }, (err, token) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        res.json({
                            status: true,
                            status_code: 200,
                            message: 'Login successfully',
                            result: {
                                token: token,
                                payload: payload,
                                time_out_token: 6000000000000000
                            },
                        })
                    }
                })
            }
        }
        else {
            res.json({
                status: false,
                status_code: 401,
                message: 'User not found.',
                result: null
            })
        }
    }
    catch (e) {
        console.log(e)
    }

}

exports.registerMember = async (req, res) => {
    try {
        if (req.body) {
            let member_id_auto_complies = "MEMBER"
            let math = Math.random() * 10000000
            let newmath = Math.ceil(math)
            let new_member_id_auto_complies = member_id_auto_complies + String(newmath)
            const salt = await bcrypt.genSalt(10)
            //encrypt password
            let encryptedPassword = await bcrypt.hash(req.body.member_password, salt)
            let new_member = {
                member_id: new_member_id_auto_complies,
                member_username: req.body.member_username,
                member_password: encryptedPassword,
                member_name: req.body.member_name,
                member_lastname: req.body.member_lastname,
                member_tel: req.body.member_tel,
                member_address: req.body.member_address,
                member_email: req.body.member_email,
                member_avatar: req.body.member_avatar,
                role: "member"
            }
            let new_auth_obj = {
                auth_id: new_member.member_id,
                username: new_member.member_username,
                password: new_member.member_password,
                name: new_member.member_name,
                lastname: new_member.member_lastname,
                avatar: new_member.member_avatar,
                role: new_member.role,
            }
            let response_auth = await authModel.create(new_auth_obj)
            let response_member = await memberModel.create(new_member)
            if (response_member && response_auth) {
                res.json({
                    status: true,
                    status_code: 200,
                    message: 'Created successfully !',
                    result: new_member.member_id
                })
            }
            else {
                res.status(500)
            }
        }
        else {
            throw res.status(500)
        }
    }
    catch (e) {
        console.log(e)
    }
}

exports.registerOrganizer = async (req, res) => {
    try {
        if (req.body) {
            let organizer_id_auto_complies = "ORGANIZER"
            let math = Math.random() * 10000000
            let newmath = Math.ceil(math)
            let new_organizer_id_auto_complies = organizer_id_auto_complies + String(newmath)
            const salt = await bcrypt.genSalt(10)
            let encryptedPassword = await bcrypt.hash(req.body.organ_password, salt)
            let new_organizer = {
                organ_id: new_organizer_id_auto_complies,
                organ_username: req.body.organ_username,
                organ_password: encryptedPassword,
                organ_name: req.body.organ_name,
                organ_lastname: req.body.organ_lastname,
                organ_tel: req.body.organ_tel,
                organ_address: req.body.organ_address,
                organ_email: req.body.organ_email,
                organ_avatar: req.body.organ_avatar,
                role: "organizer",
            }
            let new_auth_obj = {
                auth_id: new_organizer.organ_id,
                username: new_organizer.organ_username,
                password: new_organizer.organ_password,
                name: new_organizer.organ_name,
                lastname: new_organizer.organ_lastname,
                avatar: new_organizer.organ_avatar,
                role: new_organizer.role,
            }
            let response_organizer = await organizerModel.create(new_organizer)
            let response_auth = await authModel.create(new_auth_obj)
            if (response_organizer && response_auth) {
                res.json({
                    status: true,
                    status_code: 200,
                    message: "Created successfully !",
                    result: new_organizer.organ_id
                })
            }
            else {
                res.status(400)
            }
        }
        else {
            res.status(500)
        }
    }
    catch (e) {
        console.log(e)
    }
}