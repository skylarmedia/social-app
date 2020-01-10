import { AuthUserContext } from './context';

class AuthProvider extends Component {
  state = {
    cars: {
      car001: { name: 'Honda', price: 100 },
      car002: { name: 'BMW', price: 150 },
      car003: { name: 'Mercedes', price: 200 }
    }
  };

  render() {
    console.log('AuthUserContext')
    return (
      <MyContext.Provider
        value={{
          cars: this.state.cars,
          incrementPrice: selectedID => {
            const cars = Object.assign({}, this.state.cars);
            cars[selectedID].price = cars[selectedID].price + 1;
            this.setState({
              cars
            });
          },
          decrementPrice: selectedID => {
            const cars = Object.assign({}, this.state.cars);
            cars[selectedID].price = cars[selectedID].price - 1;
            this.setState({
              cars
            });
          }
        }}
      >
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default AuthProvider;
