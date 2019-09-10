import React from 'react';
import './index.css';

// removeCategory = (e)

const CategoryList = (props) => {
    return (
        <div>
            {
                props.colors.map((item, index) => {
                    
                    let categoryStyle = {
                        background: item.categories.color
                    }

                    return (
                        <div key={index}>
                            <div>
                                <div className="category-color" style={categoryStyle}>
                                    {item.categories.name}
                                    <button index={index} onClick={() => props.removeCategory(index, item.categories.name)}>x</button>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
    
}

export default CategoryList;