let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let pool = require('../config/db')
let {JWT_SECRET} = require('../config/env')


exports.profile = async (req, res) => {
  try {
    const userId = req.user.userID 

    if (!userId) {
      return res.status(401).json({ message: "Токен жарамсыз немесе userID жоқ!" })
    }

    const result = await pool.query('SELECT  username, surname, birth_date, gender, phonenumber,  email  FROM users WHERE id = $1', [userId])
    const userData = result.rows[0]

    if (!userData) {
      return res.status(404).json({ message: "Пайдаланушы табылмады!" })
    }

    res.status(200).json({ userData })
  } catch (err) {
    console.error("DB қателік:", err.message)
    res.status(500).json({ message: "Сервер қатесі!" })
  }
}


exports.register = async(req,res)=>{
    let {username, surname, birth_date, gender, phonenumber,email, password} = req.body
            
    if(!username || !email || !password || !surname|| !birth_date || !gender || !phonenumber){
        res.status(400).json({message: 'Jiberilgen aqparat tolyq emes'})
    }else{
        try{
            let hashedPassword = await bcrypt.hash(password, 10)

            if(hashedPassword){
                let result = await pool.query('insert into users(username, surname, birth_date, gender, phonenumber ,email, password) values ($1, $2, $3, $4, $5, $6, $7) returning * ', [username, surname, birth_date, gender, phonenumber ,email, hashedPassword])
                result.rows.length > 0 ? res.status(201).json(result.rows) : res.status(400).json({message: "qate"})
            }else{
                res.status(400).json({message: "Qupia sozdi hashtaw kezinde qate tuyndady"})
            }

        }catch(err){
            console.log("DB men bailanysu mumkin bolmady",err);
            
        }       
    }
}

exports.login = async(req,res)=>{
    let {email, password} = req.body

    if(!email || !password){
        res.status(400).json({message:"Jiberilgen aqparat tolyq emes"})
    }else{
        try{
            let result = await pool.query('select * from users where email= $1',[email])
            if(result.rows.length ==0){
                return res.status(404).json({message: "User not found"})
            }

            let isMatch = await bcrypt.compare(password, result.rows[0].password)

            if(isMatch){
                let token = jwt.sign({userID: result.rows[0].id},JWT_SECRET, {expiresIn: '1h'})
                res.status(200).json({message: "Login successfully!",  userName: result.rows[0].username,token})
            }else{
                res.status(400).json({message: "Qupia soz saikes kelmedi"})
            }
        }catch(err){
            console.log('DB-men bailanysu mumkin bolmady!',err);
        }
    }
}


exports.clinic = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clinic');
    res.status(200).json(result.rows); 
  } catch (err) {
    console.error('DB-мен байланыс мүмкін болмады!', err);
    res.status(500).json({ message: 'Сервер қатесі. Кейінірек қайталап көріңіз.' });
  }
};



exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userID
    const { username, surname, birth_date, gender, phonenumber, email } = req.body

    await pool.query(
      `UPDATE users SET username=$1, surname=$2, birth_date=$3, gender=$4, phonenumber=$5, email=$6 WHERE id=$7`,
      [username, surname, birth_date, gender, phonenumber, email, userId]
    )

    res.status(200).json({ message: 'Профиль жаңартылды' })
  } catch (err) {
    console.error('Профиль жаңарту қатесі:', err.message)
    res.status(500).json({ message: 'Сервер қатесі!' })
  }
}

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.userID
    await pool.query('DELETE FROM users WHERE id=$1', [userId])
    res.status(200).json({ message: 'Аккаунт өшірілді' })
    
  } catch (err) {
    console.error('Өшіру қатесі:', err.message)
    res.status(500).json({ message: 'Сервер қатесі!' })
  }
}