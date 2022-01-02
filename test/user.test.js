let app = require('../src/app');
const supertest = require('supertest');
const { request } = require('../src/app');
request = supertest(app);

let mainUser = {name: "Main User", email: "teste@gmail.com", password: "123456"};

beforeAll(async () => {
    return request.post('/user')
        .send(mainUser)
        .then(response =>  {})
        .catch(err => console.log(err));

});

afterAll(async () => {
    return request.delete(`/user/${mainUser.email}`)
        .then(response =>  {})
        .catch(err => console.log(err));

});

describe('Cadastro de usuario', () => {
    it('Deve cadastrar um usuario com sucesso', () => {
        let email = `${Date.now()}@gmail.com`;

        let user = {
            name: 'Teste',
            email: email,
            password: '123456'
        }

        return request.post('/user').send(user).then(response => {
            let status = response.status;
            expect(status).toEqual(200);
            expect(response.body.email).toEqual(email);
        }).catch(error => {
            fail(error);
        });
    })

    it('Deve impedir que o usuario se cadastre com email vazio', () => {

        let user = {
            name: '',
            email: '',
            password: ''
        }

        return request.post('/user').send(user).then(response => {
            let status = response.status;
            expect(status).toEqual(400);
        }).catch(error => {
            fail(error);
        });
    })

    it('Deve impedir que o usuario se cadastre com email repetido', () => {
        let email = `${Date.now()}@gmail.com`;

        let user = {
            name: 'Teste',
            email: email,
            password: '123456'
        }

        return request.post('/user').send(user).then(response => {
            let status = response.status;
            expect(status).toEqual(200);
            expect(response.body.email).toEqual(email);

            return request.post('/user').send(user).then(response => {
                let status = response.status;
                expect(status).toEqual(400);
                expect(res.body.error).toEqual('Email já cadastrado');
            }).catch(error => {
                fail(error);
            });
        }).catch(error => {
            fail(error);
        });
    })
})

describe('Autenticação', () => {
    it('Deve retornar um token quando logar', () => {
        return request.post('/auth')
            .send({email: mainUser.email, password: mainUser.password})
            .then(response => {
                let status = response.status;
                expect(status).toEqual(200);
                expect(response.body.token).toBeDefined();
            })
            .catch(error => {
                fail(error);
            });
    })

    it('Deve retornar um erro quando o usuario não existir', () => {
        return request.post('/auth')
            .send({email: 'inexistente@wert.com', password: '123456'})
            .then(response => {
                let status = response.status;
                expect(status).toEqual(400);
                expect(response.body.error).toEqual('Email não cadastrado');
            })
            .catch(error => {
                fail(error);
            });
    })

    it('Deve retornar um erro quando a senha estiver incorreta', () => {
        return request.post('/auth')
            .send({email: mainUser.email, password: 'wwww'})
            .then(response => {
                let status = response.status;
                expect(status).toEqual(400);
                expect(response.body.error).toEqual('Senha incorreta');
            })
            .catch(error => {
                fail(error);
            });
    })

    it('Deve retornar um erro quando o email estiver vazio', () => {
        return request.post('/auth')
            .send({email: '', password: '123456'})
            .then(response => {
                let status = response.status;
                expect(status).toEqual(400);
                expect(response.body.error).toEqual('Email não informado');
            })
            .catch(error => {
                fail(error);
            });
    })


})