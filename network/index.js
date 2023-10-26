import axios from 'axios';


export default axios.create({
    timeout: 20000,
});