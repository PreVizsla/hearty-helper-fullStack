import React, {useState} from 'react';
import { TextField, Button,  Paper, Container } from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined' 
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useStyles from './styles';
import  {create} from '../actions/session'

const initialState = { id: ''};

const Signed =() => {
    const classes = useStyles();
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    // history is deprecated, we use navigate now
    const navigate = useNavigate();

 
    const handleSubmit = (e)=>{
        console.log(JSON.stringify(formData));
        e.preventDefault();
        dispatch(create(formData, navigate));
 
    };

    const handleChange =(e)=>{
        setFormData({ ... formData, [e.target.name]: e.target.value });
    };

    return (
        <>

        <Container component = "main" maxWidth="xs">
            <Paper className = {classes.paper} elevation={3}>
                <form  onSubmit ={handleSubmit}>
                    <TextField 
                    name="id"
                    onChange={handleChange}
                    variant="outlined"
                    required
                    fullWidth
                    label="enter session ID"
                    autoFocus
                />
                    <Button type="submit" fullWidth varian="contained" color="primary" className={classes.submit}>
                       Submit
                    </Button>
                </form>
            </Paper>
        </Container>
        </>


    );
}

export default Signed 