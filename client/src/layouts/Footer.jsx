import React from 'react';

export default function Footer() {
  return (
    <div className='fiexd bottom-0 mt-20'>
      <footer className="bg-[#686464] p-4 flex justify-center text-white hover:bg-[gray]">
        <p>{new Date().getDate()}/{new Date().getMonth() + 1}/{new Date().getFullYear()} My Website. All rights reserved.</p>
      </footer>
    </div>
  );
}
