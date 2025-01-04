import React from 'react';

export default function Footer() {
  return (
    <>
      <footer className="bg-[gray] p-4 flex justify-center bottom-0 fixed w-full hover:bg-[gray] text-white">
        <p>{ new Date().getDate() }/{ new Date().getMonth() + 1 }/{new Date().getFullYear()} My Website. All rights reserved.</p>
      </footer>
    </>
  );
}
