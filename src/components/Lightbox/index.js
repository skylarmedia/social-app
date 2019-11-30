import React, { useState } from 'react';
import FsLightbox from 'fslightbox-react';

const Lightbox = ({ productsImages }) => {
  // if toggler is updated when lightbox is closed it will open it
  // if toggler is updated when lightbox is opened it will close it
  const [toggler, setToggler] = useState(false);
  const [productIndex, setProductIndex] = useState(0);
    console.log("LIGHTBOX PROPS", productsImages)
  return (
    <div>
      <button onClick={() => setToggler(!toggler)}>Toggle Lightbox</button>
      <button onClick={() => setProductIndex(1)}>Load second product</button>
      <FsLightbox toggler={toggler} sources={productsImages[productIndex]} key={productIndex} />
    </div>
  );
};

export default Lightbox;
