
import React from 'react';
import BookDetails from '../_component/Book-Details';

const page = async ({params}:{params:{id:string}}) => {
  const {id}= await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/books/${id}`, {
      cache: "no-store",
    });

      const booksData=await res.json();
      console.log(booksData);
  return (
    <div>
      <BookDetails book={booksData} />
    </div>
  );
};

export default page;