const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'},
];

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

//get all courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

//get a single course by ID
app.get('/api/courses/:id', (req, res) => {
    // res.send(req.params.id);

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID was not found.');
    res.send(course);
});

//create new course
app.post('/api/courses', (req, res) => {
    
    // validations
    const result = validateCourse(req.body);
    const { error } = validateCourse(req.body);    //result.error
    if(error) return res.status(400).send(error.details[0].message);
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

//update courses
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found.');
    
    // validations
    const result = validateCourse(req.body);
    const { error } = validateCourse(req.body);    //result.error
    if(error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

//get a single course by ID with multiple parameters
app.get('/api/posts/:year/:month', (req, res) => {
    //get full object
    //res.send(req.params);

    //get query query parameter (?sortBy=name)
    res.send(req.query);
});

//delete courses
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found.');
    
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));