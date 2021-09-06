import React from "react";

import HeaderComponent from "./components/header/header.component";
import HomePage from "./pages/homepage/homepage.component";
import SignInOutPage from "./pages/sign-in-out/sign-in-out.component";

import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { auth, createUserProfileDocument } from "./firebase/firebase.utlls";
import { setCurrentUser } from "./redux/user/user.actions";

import "./App.css";

class App extends React.Component {
  unsubscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      //after user state has been changed we check wether there is a user (userAuth) or not
      if (userAuth) {
        //if there is a user, function is called that passes a snapShot
        const userRef = await createUserProfileDocument(userAuth);
        //if the use is new, which means that there is no snapShot,
        // the function will create a user in firebase DB, and the snapShot
        console.log(userRef);
        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
          });
        });
      } else {
        setCurrentUser(userAuth);
      }
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
          <Route exact path="/" component={HomePage} />
          <Route path="/signin" component={SignInOutPage} />
        </Switch>
      </div>
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user))
});

export default connect(null, mapDispatchToProps)(App);
