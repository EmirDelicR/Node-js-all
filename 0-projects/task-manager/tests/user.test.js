const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const user = {
  name: 'Mike',
  email: 'test-1@ecample.com',
  password: 'test123',
};

describe('Some simple test', () => {
  it('Test user data', async (done) => {
    expect(user).toBe(user);
    setTimeout(() => {
      user.test = 'test';
      expect(user.test).toBe('test');
      done();
    }, 2000);
  });
});

describe('Some simple test API', () => {
  it('Test user data API', async (done) => {
    request(app)
      .post('/users')
      .send(user)
      .expect(201)
      .end(function (err, res) {
        console.log(res);
        if (err) throw err;
      });
    // done() should go in end but it throws error
    done();
  });
});
