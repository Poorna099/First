require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const multer = require('multer'); 
const fs = require('fs');
const path =require("path")

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true 
}));
app.use(express.json());






const db = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "root123", 
  database: "ecommerce_db", 
});


// User signup endpoint
app.post("/api/signup", async (req, res) => {
  const { name, email, password, userId } = req.body;

  if (!name || !email || !password || !userId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the database
    const sql = "INSERT INTO users (userId, name, email, password, role) VALUES (?, ?, ?, ?, 'user')";
    db.query(sql, [userId, name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Failed to register user." });
      }
      res.status(201).json({ message: "User registered successfully." });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});


app.use(cookieParser());
app.use(session({ 
  secret: 'secret',
  resave: false,  
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true, 
    maxAge: 1000 * 60 * 60 * 24, 
    sameSite: 'lax'
  }
}));







app.post("/api/login", (req, res) => {
  const { LoginId, password } = req.body;

  if (!LoginId || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = "SELECT * FROM users WHERE userId = ?";
  db.query(sql, [LoginId], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid LoginId or password." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid LoginId or password." });
    }   
    req.session.userId = LoginId;
    res.status(200).json({ message: "Login successful.", userId: LoginId });
  });
});



   
app.get("/api/role", (req, res) => {
  const userId = req.session.userId; 
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  const sql = "SELECT role FROM users WHERE userId = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    console.log(results[0].role);
    res.json({ role: results[0].role });
  });
});




app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users where role="user" ', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

app.get('/api/Staff', (req, res) => {
  db.query('SELECT * FROM users where role="Staff" ', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

app.get('/api/Vendors', (req, res) => {
  db.query('SELECT * FROM users where role="Vendor" ', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});


app.post('/api/add-staff', async (req, res) => {
  try {
    const { userId, name, email, password, role } = req.body;

    // Validate input fields
    if (!userId || !name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert data into the database
    const sql = 'INSERT INTO users (userId, name, email, password, role) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [userId, name, email, hashedPassword, role], (err, result) => {
      if (err) {
        console.error('Error inserting staff:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Staff added successfully', staff: { userId, name, email, role } });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
},
filename: (req, file, cb) => {
  cb(null, Date.now() + path.extname(file.originalname)); 
},
});


const upload = multer({ storage: storage });


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/api/add-product", upload.single("image_url"), (req, res) => {
  console.log("Request received:", req.body);
  console.log("Uploaded file:", req.file);

  const { product_name, description, category, scheduled_start_date, free_delivery, delivery_amount, price, discount, product_url } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Image file is missing." });
  }

  const image_url = `/uploads/${req.file.filename}`;
  const numericPrice = parseFloat(price);
  const numericDiscount = parseFloat(discount) || 0; 

  if (isNaN(numericPrice)) {
    return res.status(400).json({ error: "Price is not a valid number." });
  }

  const final_price = numericPrice - (numericPrice * numericDiscount) / 100;
  const freeDeliveryValue = free_delivery === "true" || free_delivery === true ? 1 : 0;

  const query = `INSERT INTO products (product_name, description, category, scheduled_start_date, free_delivery, delivery_amount, price, discount, final_price, image_url, product_url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [product_name, description, category, scheduled_start_date, freeDeliveryValue, delivery_amount, numericPrice, numericDiscount, final_price, image_url, product_url],
    (err, result) => {
      if (err) {
        console.error("Error inserting product:", err);
        return res.status(500).json({ error: "Database error." });
      }
      res.status(201).json({ message: "Product added successfully!", image: image_url });
    }
  );
});


app.use('/uploads', express.static('uploads'));

app.get("/api/products", (req, res) => {
  const sql = "SELECT * FROM products";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json(results);
  });
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});