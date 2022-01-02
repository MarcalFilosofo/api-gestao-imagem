let express = require('express');
let app = express();
let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

const JWTSecret = 'mysecret';

let user = require('../models/User');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/pics', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {})
    .catch(err => console.log(err));

let User = mongoose.model('User', user)

app.get('/', (req, res) => {
    res.json({})
});

app.post('/user', async (req, res) => {
    try{
        //if any field is equals to '', return 400
        if(req.body.name == '' || req.body.email == '' || req.body.password == ''){
            res.status(400);
            return;
        }
        
        try{
            let user = await User.findOne({'email': req.body.email});

            if(user != undefined){
                res.status(400);
                res.json({error: 'Email já cadastrado'});
            }
        } catch(err){
            res.status(500);
            return;
        }

        let password = await bcrypt.hash(req.body.password, 10);

        newUser = new User({name: req.body.name, email: req.body.email, password: password});
        await newUser.save()
    
        res.json({email: req.body.email})
    } catch (err) {
        res.sendStatus(500)
    }
})

app.post('/auth', async (req, res) => {
    //Procura o usuario no banco de dados pelo email, depois tenta autenticar usando a senha
    try{
        let user = await User.findOne({'email': req.body.email});

        if(user == undefined){
            res.status(400);
            res.json({error: 'Email não cadastrado'});
            return;
        }

        let password = await bcrypt.compare(req.body.password, user.password);

        if(!password){
            res.status(403);
            res.json({error: 'Senha incorreta'});
            return;
        }

        let token = jwt.sign({email: user.email}, JWTSecret, {expiresIn: '48h'}, (err, token) => {
            if(err){
                res.status(500);
                return;
            } else{
                res.json({token: token});
            }
        });

    } catch (err) {
        res.sendStatus(500)
    }
})

app.delete('/user/:email', async (req, res) => {
    await User.deleteOne({'email': req.params.email});
    res.sendStatus(200);
})

module.exports = app;