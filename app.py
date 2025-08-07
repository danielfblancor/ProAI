from flask import Flask, render_template, request, redirect, url_for
import sqlite3
from pathlib import Path

app = Flask(__name__)
DB_PATH = Path("inventory.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            quantity INTEGER NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()

@app.route('/')
def index():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute('SELECT * FROM items ORDER BY name')
    items = cur.fetchall()
    conn.close()
    return render_template('index.html', items=items)

@app.route('/add', methods=['POST'])
def add_item():
    name = request.form['name']
    quantity = int(request.form['quantity'])
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    try:
        cur.execute('INSERT INTO items (name, quantity) VALUES (?, ?)', (name, quantity))
        conn.commit()
    except sqlite3.IntegrityError:
        cur.execute('UPDATE items SET quantity = quantity + ? WHERE name = ?', (quantity, name))
        conn.commit()
    finally:
        conn.close()
    return redirect(url_for('index'))

@app.route('/update/<int:item_id>', methods=['POST'])
def update_item(item_id):
    quantity = int(request.form['quantity'])
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('UPDATE items SET quantity = ? WHERE id = ?', (quantity, item_id))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

@app.route('/delete/<int:item_id>', methods=['POST'])
def delete_item(item_id):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('DELETE FROM items WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000)
