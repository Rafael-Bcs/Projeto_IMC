const request = require('supertest');
const app     = require('../src/app');

describe('Teste para ver se API está funcionando', () => {

    test('Deve retornar 200 e status ok', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');

    });

});