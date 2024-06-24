const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = 3000;

// Middleware
app.use(cors()); 
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost/todo-app', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Todo model
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes

// GET /todos: Retrieve all to-do items
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /todos: Create a new to-do item
app.post('/todos', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /todos/:id: Retrieve a specific to-do item by ID
app.get('/todos/:id', getTodo, (req, res) => {
  res.json(res.todo);
});

// PUT /todos/:id: Update a specific to-do item by ID
app.put('/todos/:id', getTodo, async (req, res) => {
  if (req.body.title != null) {
    res.todo.title = req.body.title;
  }
  if (req.body.description != null) {
    res.todo.description = req.body.description;
  }
  if (req.body.completed != null) {
    res.todo.completed = req.body.completed;
  }

  try {
    const updatedTodo = await res.todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /todos/:id: Delete a specific to-do item by ID
app.delete('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json({ message: 'Deleted Todo' });
    } catch (err) {
      console.error('Delete error:', err); // Log the error to console for debugging
      res.status(500).json({ message: err.message }); // Send 500 status with error message
    }
  });
  

// Middleware function to get todo by ID
async function getTodo(req, res, next) {
  let todo;
  try {
    console.log('Fetching todo with ID:', req.params.id);
    todo = await Todo.findById(req.params.id);
    if (todo == null) {
      console.log('Todo not found');
      return res.status(404).json({ message: 'Cannot find todo' });
    }
  } catch (err) {
    console.error('Error fetching todo:', err);
    return res.status(500).json({ message: err.message });
  }

  res.todo = todo;
  next();
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
