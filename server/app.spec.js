const request = require("supertest");
jest.mock("pg");
const {Pool} = require("pg");
//because in app, we new the Pool directly(not in function), so we need to mock this
//before we import 'app'
const query = jest.fn().mockReturnValue(true);
Pool.prototype.query = query;
const test = new Pool();
const r = test.query();
expect(r).toBe(true);

const app = require("./app");

describe("App", () => {

  beforeAll(() => {
  })

  it("", () => {
  });



});
