import React from 'react';
import { Row, Col } from 'antd';

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
    <Row gutter={20} className="upload-files-wrapper">
      {imageSrc &&
        imageSrc.map((item, index) => {
          if (getType(item) == 'video') {
            return (
              <Col key={index} span={6}>
                <video height="200" width="200" controls>
                  <source src={item} />
                </video>
              </Col>
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
    </Row>
  );
};

export default ImagePosts;
