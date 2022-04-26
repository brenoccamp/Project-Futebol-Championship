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
});
