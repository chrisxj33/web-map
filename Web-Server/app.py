import psycopg2
from psycopg2 import sql
from flask import Flask, jsonify

app = Flask(__name__)

# Database connection parameters
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'WebMapData'
DB_USER = 'postgres'
DB_PASSWORD = input("Enter db password: ")

def connect_to_db():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()
        print("Connection to the database established successfully.")
        return conn, cursor
    except psycopg2.DatabaseError as e:
        print(f"Error {e}")
        return None, None

def close_connection(conn, cursor):
    if cursor is not None:
        cursor.close()
    if conn is not None:
        conn.close()
    print("Database connection closed.")

def execute_query(cursor, query, params=None):
    try:
        cursor.execute(query, params)
        results = cursor.fetchall()
        print("Query executed successfully.")
        return results
    except psycopg2.Error as e:
        print(f"Error executing query: {e}")
        return None

def main():
    conn, cursor = connect_to_db()
    
    if conn is not None and cursor is not None:
        column_name = 'lga'
        value = 'GOLDEN PLAINS'
        
        query = sql.SQL("SELECT lu_desc FROM landuse_2017 WHERE {column} = %s").format(
            column=sql.Identifier(column_name)
        )
        params = (value,)
        
        results = execute_query(cursor, query, params)
        
        close_connection(conn, cursor)
        
        return results

@app.route('/coordinates')
def index():
    results = main()
    if results is not None:
        return jsonify(results)
    else:
        return jsonify({"error": "No results found"}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
