process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

let b1;
let b2;

beforeEach(async () => {
  await db.query('DELETE FROM books');
  b1 = {
    "isbn": "0691161518",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "english",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    "year": 2017
  }
  b2 = {
    "isbn": "0123456789",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Chuck Fan",
    "language": "taiwanese",
    "pages": 777,
    "publisher": "Copper Canyon Press",
    "title": "Entries of Ecstasy",
    "year": 2010
  }
  await Book.create(b1);
  await Book.create(b2);
})

describe('GET /books', () => {
  test('Get list of books', async () => {
    const resp = await Book.findAll();
    expect(resp.length).toEqual(2);
    expect(resp).toContainEqual(b1);
    expect(resp).toContainEqual(b2);
  })
})

describe('GET /books/:isbn', () => {
  test('Get a single book', async () => {
    const resp = await Book.findOne(b1.isbn);
    expect(resp).toEqual(b1);
  })
})

describe('POST /books', () => {
  test('Create a book', async () => {
    let b3 = {
      "isbn": "0000000001",
      "amazon_url": "http://a.co/eobPtX2",
      "author": "God",
      "language": "latin",
      "pages": 7000,
      "publisher": "Heaven",
      "title": "Bible",
      "year": 0
    }
    const resp = await Book.create(b3);
    expect(resp).toEqual(b3);
  })
})

describe('PUT /books/:isbn', () => {
  test('Update a book', async () => {
    const resp = await Book.update('0123456789', {
      "amazon_url": "http://a.co/eobPtX2",
      "author": "God",
      "language": "latin",
      "pages": 7000,
      "publisher": "Heaven",
      "title": "Bible",
      "year": 0
    })
    const updatedBook = await Book.findOne('0123456789');
    expect(resp).toEqual(updatedBook);
  })
})

describe('DELETE /books/:isbn', () => {
  test('Delete a book', async () => {
    await Book.remove('0123456789');
    const resp = await Book.findAll();
    expect(resp.length).toEqual(1);
    expect(resp).toContainEqual(b1);
    expect(resp).not.toContainEqual(b2);
  })
})

afterAll(async function () {
  await db.end();
});
