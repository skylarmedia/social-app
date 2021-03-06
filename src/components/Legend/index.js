import React from 'react';
import { Link } from 'react-router-dom';

const Legend = props => {
  let unassignCategoryChild = (name, index) => {
    props.removeCategory(name, index);
  };

  return (
    <div>
      <p className="container row p-details mx-auto p-0">Details</p>
      <div className="border mb-15"></div>
      <section className="d-flex justify-content-between container mx-auto">
        <div className="row d-flex flex-column">
          <h4>CATEGORIES</h4>
          {props.clientCategories && (
            <div>
              {props.clientCategories.map((item, index) => {
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
          )}
          {localStorage.getItem('skylarAdmin') && (
            <Link
              to={{
                pathname: `/assign-categories/${props.year}/${props.month}/${props.client}`,
                state: {
                  getClient: props.client
                }
              }}
              className="assign-link"
            >
              Assign Categories
            </Link>
          )}
          <div>
            {props.selectedCategories &&
              props.selectedCategories.map((item, index) => {
                let categoryStyle = {
                  background: item.color
                };
                return (
                  <div key={index}>
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
