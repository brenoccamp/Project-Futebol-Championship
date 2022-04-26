import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcryptjs from 'bcryptjs';
import chaiHttp = require('chai-http');
import UserModel from '../database/models/UserModel';
import { Response } from 'superagent';
import { app } from '../app';

import { userFullData } from './_mocks_/userMocks';

chai.use(chaiHttp);

const { expect } = chai;

describe('TESTING LOGIN ROUTE', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(UserModel, "findOne")
      .resolves(userFullData as UserModel);
  });

  after(()=>{
    (UserModel.findOne as sinon.SinonStub).restore();
    (bcryptjs.compare as sinon.SinonStub).restore();
  })

  it('When login occurs successfully', async () => {
    sinon
      .stub(bcryptjs, 'compare')
      .resolves(true);

    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'secret_admin' });

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body.user).to.be.deep.equal(userFullData);
    expect(chaiHttpResponse.body.token).to.be.an('string');
  });

  it('Verify if it throws an error when only email is sent', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin@admin.com' });

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
  });

  it ('Verify if it throws an error when only password is sent', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin@admin.com' });

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
  });

  it ('Verify if it throws an error when email has incorrect format', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin.com', password: 'secret_admin' });

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password');
  });

  it ('Verify if it throws an error when email or password isn\'t an string', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 12345, password: 123456 });

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body.message).to.be.equal('Invalid email or password');
  });

  it ('Verify if it throws an error when password length does not have at least 6 characters', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'secre' });

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body.message).to.be.equal('Password must have at least 6 characters');
  });
});
