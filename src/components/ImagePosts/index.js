import React from 'react';
import { Col } from 'antd';

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
    <div gutter={20} className="upload-files-wrapper test">
      {imageSrc &&
        imageSrc.map((item, index) => {
          if (getType(item) === 'video') {
            return (
              <div key={index}>
                <video height="200" width="200" controls>
                  <source src={item} />
                </video>
              </div >
            );
          } else {

            let styles = {
              backgroundImage:`url(${item})`
            }
            return (
              <Col span={6} className="image-render position-relative" key={index} style={styles}>
                {removeImage && <button type="button" className="position-absolute delete-abs clear-btn" onClick={() => {removeImage(index)}}>X</button>}
              </Col>
            );
          }
        })}
    </div>
  );
};

export default ImagePosts;
