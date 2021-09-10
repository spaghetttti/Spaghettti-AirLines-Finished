import React from "react";

import HeaderComponent from "./components/header/header.component";
import HomePage from "./pages/homepage/homepage.component";
import SignInOutPage from "./pages/sign-in-out/sign-in-out.component";
import BookingPage from "./pages/booking/booking.component";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Switch, Route, Redirect } from "react-router-dom";

import { auth, createUserProfileDocument} from "./firebase/firebase.utlls";
import { setCurrentUser } from "./redux/user/user.actions";
import { selectCurrentUser } from "./redux/user/user.selector";

import "./App.css";
import FooterComponent from "./components/footer/footer.component";

class App extends React.Component {
  unsubscribeFromAuth = null;
  
  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      //after user state has been changed we check wether there is a user (userAuth) or not
      if (userAuth) {
        //if there is a user, function is called that passes a snapShot
        const userRef = await createUserProfileDocument(userAuth);
        //if the use is new, which means that there is no snapShot,
        // the function will create a user in firebase DB, and the snapShot
        userRef.onSnapshot((snapShot) => {
          this.props.setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      }  
      this.props.setCurrentUser(userAuth);
      
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <HeaderComponent />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route
            exact
            path="/signin"
            render={() => 
              this.props.currentUser ? (
                <Redirect to='/'/>
              ) : (
                <SignInOutPage/>
              )
            }
          />
          <Route path='/booking' component={BookingPage}/>
        </Switch>
        <FooterComponent/>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
