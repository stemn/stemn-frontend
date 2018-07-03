// Component Core
import React from 'react'
import classes from './Smooch.css'
import classNames from 'classnames'
import Smooch from 'smooch'
import { init as initSmooch } from './Smooch.utils.js'
import comments      from 'stemn-shared/assets/images/pure-vectors/comments.svg'

// /////////////////////////////// COMPONENT /////////////////////////////////

export default class extends React.Component {
  componentWillMount() {
    initSmooch()
  }

  render() {
    const { text, style } = this.props
    return (
      <a className={ classNames(classes.icon, 'layout-column', 'layout-align-center-center') } onClick={ Smooch.open }>
        <img src={ comments } />
      </a>
    )
  }
}


//            $timeout(setupSmooch, 2000);
//
//            $rootScope.$on('authentication.logIn', function(){
//                setupSmooch();
//            });
//            $rootScope.$on('authentication.logOut', function(){
//                if(window.Smooch){
//                   window.Smooch.logout();
//                }
//            });
//
//            /////////////////////////////////////////////
//
//            function setupSmooch(){
//                if(window.Smooch){
//                    if(Authentication.currentUser.isLoggedIn()){
//                        window.Smooch.updateUser({
//                            givenName : Authentication.currentUser.firstname,
//                            surname   : Authentication.currentUser.lastname,
//                            email     : Authentication.currentUser.email
//                        })
//                        window.Smooch.login(Authentication.currentUser._id)
//                    }
//                }
//            }
//
