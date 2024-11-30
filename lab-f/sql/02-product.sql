CREATE TABLE products (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          name TEXT NOT NULL,
                          price REAL NOT NULL,
                          manufacturer TEXT NOT NULL,
                          production_date DATE NOT NULL
);