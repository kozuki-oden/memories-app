import React, { useState, useEffect } from "react";
import { AppBar, Typography, Toolbar, Avatar, Button } from "@material-ui/core";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";

import memoriesLogo from '../../images/memoriesLogo.png';
import memoriesText from '../../images/Like_My_Story.png';

import * as actionType from "../../constants/actionTypes";

import useStyles from "./styles";

const Navbar = () => {
  //to retrieve user from local storage
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  
  
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  //to use styles from styles.js
  const classes = useStyles();

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });
    
    //this redirects user to authentication page after logout 
    history.push("/");
    //once logged out, user is set to null
    setUser(null);
  };
  
  // check for token expiry
  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);



  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <Link to="/" className={classes.brandContainer}>
        <img component={Link} to="/" src={memoriesText} alt="icon" height="80px" />
        <img className={classes.image} src={memoriesLogo} alt="icon" height="40px" />
      </Link>
      {/* <div className={classes.brandContainer}>
        <Typography
        //pointing to home
          component={Link}
          to="/"
          className={classes.heading}
          color="primary"
          variant="h2"
          align="center"
        >
          Memories
        </Typography>
        <img className={classes.image} src={memories} alt="icon" height="60" />
      </div> */}
      {/* Toolbar */}
      <Toolbar className={classes.toolbar}>
        {user?.result ? (
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
            <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>
            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
          </div>
        ) : (
          <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
