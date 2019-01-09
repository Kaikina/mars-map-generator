'use strict';

const {expect} = require('chai');
const request = require('supertest');
const createServer = require('../../app');
const database = require('../../src/database');
const fixtures = require('../fixtures/users')

const server = request(createServer());

describe.only('Maps api', function() {
    describe('Obtenir une map', function() {
        it("La requête fournit tous les paramètres, et on reçoit la map créée", async () => {
            const {body: map} = await server.post('/api/v1/maps')
                .set('Accept', 'application/json')
                .send({
                    height: 500,
                    width: 500,
                    maxDepth: 10
                })
                .expect(200);
            //expect(map).to.be.an('array');
        });
    });
});