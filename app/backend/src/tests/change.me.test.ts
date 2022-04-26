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

describe('TESTING LOGIN ROUTE "/login"', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(UserModel, 'findOne')
      .resolves(userFullData as UserModel);
  });

  after(()=>{
    (UserModel.findOne as sinon.SinonStub).restore();
  });

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

    (bcryptjs.compare as sinon.SinonStub).restore();
  });

  it('Verify if it returns status 400 when only email is sent', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin@admin.com' });

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
  });

  it('Verify if it returns status 400 when only password is sent', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin@admin.com' });

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
  });

  it('Verify if it returns status 401 when email has incorrect format', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin.com', password: 'secret_admin' });

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password');
  });

  it('Verify if it returns status 401 when email or password isn\'t an string', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 12345, password: 123456 });

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body.message).to.be.equal('Invalid email or password');
  });

  it('Verify if it returns status 400 when password length does not have at least 6 characters', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'secre' });

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body.message).to.be.equal('Password must have at least 6 characters');
  });

  it('Verify if it returns status 401 when password is incorrect', async () => {
    sinon
    .stub(bcryptjs, 'compare')
    .resolves(false);

    chaiHttpResponse = await chai
    .request(app)
    .post('/login')
    .send({ email: 'admin123@admin123.com', password: 'secret_adm' });

  expect(chaiHttpResponse).to.have.status(401);
  expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password');

  (bcryptjs.compare as sinon.SinonStub).restore();
  });

  it('Verify if it returns status 401 when user doesn\'t exist', async () => {
    (UserModel.findOne as sinon.SinonStub).restore();

    sinon
    .stub(UserModel, 'findOne')
    .resolves(undefined);

    chaiHttpResponse = await chai
    .request(app)
    .post('/login')
    .send({ email: 'admin123@admin123.com', password: 'secret_adm' });

  expect(chaiHttpResponse).to.have.status(401);
  expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password');
  });
  
  it('Verify if it returns status 500 when occurs an internal error', async () => {
    (UserModel.findOne as sinon.SinonStub).restore();

    sinon
      .stub(UserModel, 'findOne')
      .throws('errorObj');

    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin123@admin123.com', password: 'secret_adm' });

    expect(chaiHttpResponse).to.have.status(500);
    expect(chaiHttpResponse.body.error).to.be.equal('Internal server error');
  });
});

describe('TESTING LOGIN VALIDATE ROUTE "/login/validate"', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(UserModel, 'findOne')
      .resolves(userFullData as UserModel);
  });

  after(() => {
    (UserModel.findOne as sinon.SinonStub).restore();
  });

  it('When validate occurs successfully', async () => {
    chaiHttpResponse = await chai
    .request(app)
    .get('/login/validate')
    .set({ authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjUxMDA3OTc2LCJleHAiOjE2NTE2MTI3NzZ9.e03flklFuSWr96-87vAZwivEFgtQdO7s_yXFzUYF4m4' });

  expect(chaiHttpResponse).to.have.status(200);
  expect(chaiHttpResponse.body).to.be.an('string');
  });

  it('Verify if returns status 401 if token not found', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set({});

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
  });

  it('Verify if returns status 400 if malformed token', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set({ authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ'});

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body.error).to.be.equal('jwt malformed');
  });

  it('Verify if returns 404 if user not found', async () => {
    (UserModel.findOne as sinon.SinonStub).restore();

    sinon
      .stub(UserModel, 'findOne')
      .resolves(undefined);

      chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set({ authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjUxMDA3OTc2LCJleHAiOjE2NTE2MTI3NzZ9.e03flklFuSWr96-87vAZwivEFgtQdO7s_yXFzUYF4m4'});

    expect(chaiHttpResponse).to.have.status(404);
    expect(chaiHttpResponse.body.message).to.be.equal('Invalid token or user not found.');
  });
});
