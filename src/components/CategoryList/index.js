import React from 'react';
import './index.css';

const CategoryList = props => {
  return (
    <div>
      {props.colors.map((item, index) => {
        let categoryStyle = {
          background: item.color
        };

        return (
          <div key={index}>
            <div>
              <div className="category-color" style={categoryStyle}>
                {item.name}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryList;
