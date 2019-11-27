import React from 'react';
import './index.css';

const CategoryList = props => {
    console.log("CATEGORY PROPS")
  return (
    <div>
      {props.colors.map((item, index) => {
        console.log('catlist color', item);
        let categoryStyle = {
          background: item.color
        };

        return (
          <div key={index}>
            <div>
              <div className="category-color" style={categoryStyle}>
                {item.name}
                <button index={index} onClick={() => props.removeCategory(index, item.name)}>
                  x
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryList;
