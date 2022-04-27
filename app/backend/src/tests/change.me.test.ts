import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcryptjs from 'bcryptjs';
import chaiHttp = require('chai-http');
import UserModel from '../database/models/UserModel';
import TeamModel from '../database/models/TeamModel';
import MatchModel from '../database/models/MatchModel';
import { Response } from 'superagent';
import { app } from '../app';
import { IMatches, IMatchWithInProgress } from '../interfaces/match';

import { userFullData } from './_mocks_/userMocks';
import { allTeams, team } from './_mocks_/teamMocks';
import { allMatches, matchesInProgress, finishedMatches, match } from './_mocks_/matchMocks';

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

  after(async () => {
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

describe('TESTING TEAM ROUTE "/teams"', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(TeamModel, 'findAll')
      .resolves(allTeams as TeamModel[]);
  });

  after(() => {
    (TeamModel.findAll as sinon.SinonStub).restore();
  });

  it('When get all teams, returns status 200', async () => {
    chaiHttpResponse = await chai
    .request(app)
    .get('/teams');

  expect(chaiHttpResponse).to.have.status(200);
  expect(chaiHttpResponse.body).to.be.deep.equal(allTeams);
  });

  it('When any team is registered, returns status 404', async () => {
    (TeamModel.findAll as sinon.SinonStub).restore();

    sinon
    .stub(TeamModel, 'findAll')
    .resolves([] as TeamModel[]);

    chaiHttpResponse = await chai
    .request(app)
    .get('/teams');

  expect(chaiHttpResponse).to.have.status(404);
  expect(chaiHttpResponse.body.message).to.be.equal('Any team registered yet');
  });

  it('Verify if it returns status 500 when occurs an internal error', async () => {
    (TeamModel.findAll as sinon.SinonStub).restore();

    sinon
      .stub(TeamModel, 'findAll')
      .throws('errorObj');

    chaiHttpResponse = await chai
      .request(app)
      .get('/teams');

    expect(chaiHttpResponse).to.have.status(500);
    expect(chaiHttpResponse.body.error).to.be.equal('Internal server error');
  });
});

describe('TESTING GET TEAM BY ID ROUTE "/teams/:id"', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(TeamModel, 'findOne')
      .resolves(team as TeamModel);
  });

  after(() => {
    (TeamModel.findOne as sinon.SinonStub).restore();
  });

  it('When found team, it returns status 200', async () => {
    chaiHttpResponse = await chai
    .request(app)
    .get('/teams/:id')
    .send({ id: 1 });

  expect(chaiHttpResponse).to.have.status(200);
  expect(chaiHttpResponse.body).to.be.deep.equal(team);
  });

  it('When team is not found, it returns status 404', async () => {
    (TeamModel.findOne as sinon.SinonStub).restore();

    sinon
    .stub(TeamModel, 'findOne')
    .resolves(null);

    chaiHttpResponse = await chai
    .request(app)
    .get('/teams/:id')
    .send({ id: 999 });

  expect(chaiHttpResponse).to.have.status(404);
  expect(chaiHttpResponse.body.message).to.be.equal('Team not found');
  });

  it('Verify if it returns status 500 when occurs an internal error', async () => {
    (TeamModel.findOne as sinon.SinonStub).restore();

    sinon
      .stub(TeamModel, 'findOne')
      .throws('errorObj');

    chaiHttpResponse = await chai
      .request(app)
      .get('/teams/:id')
      .send({ id: 1 });

    expect(chaiHttpResponse).to.have.status(500);
    expect(chaiHttpResponse.body.error).to.be.equal('Internal server error');
  });
});

describe('TESTING ROUTE GET "/matches"', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(MatchModel, 'findAll')
      .resolves(allMatches as IMatches[]);
  });

  after(() => {
    (MatchModel.findAll as sinon.SinonStub).restore();
  });

  it('Verify if it returns status 200 with all matches informations', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/matches');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(allMatches);
  });

  it('Verify if it returns status 200 with only matches in progress', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/matches')
      .query({ inProgress: 'true' });

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(matchesInProgress);
  });

  it('Verify if it returns status 200 with only finished matches', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/matches')
      .query({ inProgress: 'false' });

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(finishedMatches);
  });

  it('Verify if it returns status 500 when occurs an internal error', async () => {
    (MatchModel.findAll as sinon.SinonStub).restore();

    sinon
      .stub(MatchModel, 'findAll')
      .throws('errorObj');

    chaiHttpResponse = await chai
      .request(app)
      .get('/matches');

    expect(chaiHttpResponse).to.have.status(500);
    expect(chaiHttpResponse.body.error).to.be.equal('Internal server error');
  });
});

describe('TESTING ROUTE POST "/matches"', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(MatchModel, 'create')
      .resolves(match as MatchModel);

    sinon
      .stub(TeamModel, 'findOne')
      .resolves(team as TeamModel);
  });

  after(() => {
    (MatchModel.create as sinon.SinonStub).restore();
    (TeamModel.findOne as sinon.SinonStub).restore();
  });

  it('Verify if return status 201 and successfully created new match', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .send({
        homeTeam: 1,
        homeTeamGoals: 3,
        awayTeam: 8,
        awayTeamGoals: 2,
    });

    expect(chaiHttpResponse).to.have.status(201);
    expect(chaiHttpResponse.body).to.be.deep.equal(match);
  });

  it('Verify if it returns status 401 when home team and away team have same id', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .send({
        homeTeam: 1,
        homeTeamGoals: 3,
        awayTeam: 1,
        awayTeamGoals: 2,
    });

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body.message)
      .to.be.equal('It is not possible to create a match with two equal teams');
  });

  it('Verify if it returns status 500 when occurs an internal error', async () => {
    (MatchModel.create as sinon.SinonStub).restore();

    sinon
      .stub(MatchModel, 'create')
      .throws('errorObj');

    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .send({
        homeTeam: 3,
        homeTeamGoals: 3,
        awayTeam: 8,
        awayTeamGoals: 2,
    });

    expect(chaiHttpResponse).to.have.status(500);
    expect(chaiHttpResponse.body.error).to.be.equal('Internal server error');
  });
});
