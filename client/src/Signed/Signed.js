import React, {useState} from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined' 
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useStyles from './styles';
import Input from './input';
import  {signin, signup} from '../actions/auth'

const initialState = { firstName: '', lastname: '', email: '', password: '', confirmPassword:'' };

const Login =() => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    // history is deprecated, we use navigate now
    const navigate = useNavigate();

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(isSignup){
            dispatch(signup(formData, navigate))
        } else {
            dispatch(signin(formData, navigate))
        }
    };

    const handleChange =(e)=>{
        setFormData({ ... formData, [e.target.name]: e.target.value });
    };

    const switchMode =()=>{
        setIsSignup((prevIsSignup) => !prevIsSignup );
        setShowPassword(false);
    };

    return (
        <>

        <Container component = "main" maxWidth="xs">
            <Paper className = {classes.paper} elevation={3}>
                <Avatar className = {classes.Avatar}>
                    <LockOutlinedIcon />

                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                <form className = {classes.form} onSubmit ={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half/>

                                    <Input name="lastName" label="Last Name" handleChange={handleChange} half/>

                                </>
                            )
                        }
                        <Input name="email" label="Email Address" handleChange = {handleChange} type ="email"/>
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword}/>
                        {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password"/>}

                    </Grid>
                    <Button type="submit" fullWidth varian="contained" color="primary" className={classes.submit}>
                       {isSignup ? 'Sign Up' : 'Sign In'} 
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"} 
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
        </>
    );
}

export default Signed 