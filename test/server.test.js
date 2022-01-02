let app = require('../src/app');
const supertest = require('supertest');
request = supertest(app);

it("Deve responder na porta 3131", () => {
    return request.get('/').then(response => {
        let status = response.status
        expect(status).toEqual(200);
    }).catch(error => {
        console.log(error);
        fail(error);
    });
})