import React from 'react';
import { Link } from 'react-router-dom';

const Legend = props => {
  console.log('SELECTED CATEGORES', props.selectedCategories)
  let unassignCategoryChild = (name, index) => {
    props.removeCategory(name, index)
  }

  return (
    <div>
      <p className="container p-details">Details</p>
      <div className="border mb-15"></div>
      <section className="d-flex justify-content-between container mx-auto">
        <div className="row d-flex flex-column">
          <h4>CATEGORIES</h4>
          <Link
            to={{
              pathname: `/assign-categories/${props.year}/${props.month}/${props.client}`,
              state:{
                getClient:props.client
              }
            }}
            class="assign-link"
          >
            Assign Categories
          </Link>
          <div>
            {props.selectedCategories &&
              props.selectedCategories.map((item, index) => {
            
                let categoryStyle = {
                  background: item.color
                };
                return (
                  <div>
                    <div className="category-color" style={categoryStyle}>
                      {item.name}
                      <button index={index} onClick={() => unassignCategoryChild(item.name, index)}>
                        x
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div>
          <h4>CALENDAR LEGEND</h4>
          <ul className="row flex-wrap">
            <li className="col-sm-6 d-flex align-items-center">
              <div className="red circle" />
              <p className="mb-0">Notification</p>
            </li>
            <li className="col-sm-6  d-flex align-items-center">
              <div className="orange circle" />
              <p className="mb-0">Client unread</p>
            </li>
            <li className="col-sm-6  d-flex align-items-center">
              <div className="green circle" />
              <p className="mb-0">Approved</p>
            </li>
            <li className="col-sm-6  d-flex align-items-center">
              <div className="hollow-orange circle" />
              <p className="mb-0">Approved</p>
            </li>
            <li className="col-sm-6  d-flex align-items-center">
              <span className="ad-dollar color-blue">$</span>
              <p className="mb-0">Ad</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Legend;
