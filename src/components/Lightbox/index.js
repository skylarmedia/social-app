import React, { useState } from 'react';
import FsLightbox from 'fslightbox-react';

const Lightbox = ({ productsImages }) => {
  const [toggler, setToggler] = useState(false);
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
