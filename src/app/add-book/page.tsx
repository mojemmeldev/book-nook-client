
import React from "react";
import Add_Book_Form from "./_component/Add_Book_Form";


const AddBooksPage = () => {
  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Add New Book
          </h1>

          <p className="mt-2 text-muted-foreground">
            Fill in the details below to add a new book
            to our library.
          </p>
        </div>

        <Add_Book_Form />

      </div>
    </div>
  );
};

export default AddBooksPage;
