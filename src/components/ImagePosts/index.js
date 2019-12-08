import React from 'react';

const ImagePosts = props => {
  const { imageSrc, removeImage } = props;
  function getType(url) {
    if (url !== 'No Files') {
      var checkUrl = new URL(url);

      var query_string = checkUrl.search;

      var search_params = new URLSearchParams(query_string);

      var type = search_params.get('type');

      return type;
    }
  }

  return (
    <div className="upload-files-wrapper d-flex flex-wrap">
      {imageSrc &&
        imageSrc.map((item, index) => {
          if (getType(item) == 'video') {
            return (
              <div key={index}>
                <video height="200" width="200" controls>
                  <source src={item} />
                </video>
              </div>
            );
          } else {
            return (
              <div className="image-render position-relative" key={index}>
                {removeImage && <button type="button" className="position-absolute" onClick={() => {removeImage(index)}}>X</button>}
                <img src={item} />
              </div>
            );
          }
        })}
    </div>
  );
};

export default ImagePosts;
