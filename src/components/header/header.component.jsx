import React from "react";

import { connect} from 'react-redux';
import { Link } from 'react-router-dom';
import { auth } from "../../firebase/firebase.utlls";
import { createStructuredSelector } from "reselect";

import "./header.styles.scss";
import "./menu.scss";

import { ReactComponent as Logo } from "../../assets/main-logo1.svg";
import {selectCurrentUser} from '../../redux/user/user.selector';

class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {addClass: false}
    }
    
    toggle() {
        this.setState({addClass: !this.state.addClass})
    }
    
    render() {
        let boxClass = ["hamburger-menu"];
        let overLayBoxClass = [""];
        let menuListClass = ["header-list container has-fade"];
        if (this.state.addClass) {
            boxClass.push('animate');
            overLayBoxClass.push('overlay');
            overLayBoxClass.push('fade-in');
            menuListClass.push('fade-in');
          }
          else {
            overLayBoxClass.push('fade-out');
        }

        return (
            <div className="header">
              <div className={overLayBoxClass.join(' ')}></div>
              <nav className="flex flex-jc-sb flex-ai-c change-on-mob">
                <div className="header-logo flex flex-jc-sb">
                  <Link to="/">
                    <Logo className='header-logo-icon'/>
                    <span className="ghost-icon">Spaghetti AirLines</span>
                  </Link>
                </div>
          
                <div className="header-links hide-for-mobile">
                  <Link to="/">Home</Link>
                  <Link to="/">Flights</Link>
                  <Link to="/">Car</Link>
                  <Link to="/">Hotel</Link>
                  <Link to="/">Contact Us</Link>
                </div>
          
                <Link to={this.props.currentUser ? '/' : '/signin'} className="button button-sign-in">
                  {
                    this.props.currentUser ?
                    <span onClick={()=>auth.signOut()}>Sign out</span> :
                    <span>Sign in</span>
                  }{
                  console.log('currentUser',this.props.currentUser)}
                </Link>
                
                <div className="header-menu hide-for-desktop menu-wrapper">
                    <div
                      onClick={this.toggle.bind(this)}
                      className={boxClass.join(' ')} 
                    ></div>
                </div>
              </nav>
              <div className={menuListClass.join(' ')}> 
                  <Link to="/">Home</Link>
                  <Link to="/">Flights</Link>
                  <Link to="/">Car</Link>
                  <Link to="/">Hotel</Link>
                  <Link to="/">Contact Us</Link>
              </div>
                 
            </div>
        )

    }
};
// The long way
// const mapStateToProps = (state) => ({
//   currentUser: selectCurrentUser(state)
// })


const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
})

export default connect(mapStateToProps)(HeaderComponent);
