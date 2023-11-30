const {nanoid} = require('nanoid');
const book = require('./book');

const addNewBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  if (pageCount === readPage) {
    const finished = true;
    return finished;
  }
  const finished = false;

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };
  book.push(newBooks);


  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
      'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const isSuccess = book.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        booksId: id,
      },
    });
    response.code(201);
    return response;
  }
};

const getAllBooks = (request, h) => {
  const books = [];
  if (book.length !== 0) {
    book.forEach(({id, name, publisher}) => {
      books.push({
        id, name, publisher,
      });
    });
    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

const getBookById = (request, h)=>{
  const {bookId} = request.params;
  const filteredBook = book.filter((bookItem)=> bookItem.id === bookId)[0];

  if (filteredBook !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        filteredBook,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookById = (request, h) =>{
  const {bookId} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = book.findIndex((bookItem)=> bookItem.id === bookId);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. '+
         'readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  book[index] ={
    ...book[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookById = (request, h) => {
  const {bookId} = request.params;
  const index = book.findIndex((bookItem)=> bookItem.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  book.splice(index, 1);
  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil dihapus',
  });
  response.code(200);
  return response;
};


module.exports = {
  addNewBook, getAllBooks, getBookById, editBookById, deleteBookById,
};
