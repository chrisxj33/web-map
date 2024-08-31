from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2 import sql
import logging

app = Flask(__name__)
CORS(app)

# Database connection parameters
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'WebMapData'
DB_USER = 'postgres'
DB_PASSWORD = input("Enter db password: ")

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# \\ Helper functions //

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
        logging.info("Connection to the database established successfully.")
        return conn, cursor
    except psycopg2.DatabaseError as e:
        logging.error(f"Error {e}")
        return None, None

def close_connection(conn, cursor):
    if cursor is not None:
        cursor.close()
    if conn is not None:
        conn.close()
    logging.info("Database connection closed.")

def execute_query(cursor, query, params=None):
    try:
        cursor.execute(query, params)
        results = cursor.fetchall()
        logging.info("Query executed successfully.")
        return results
    except psycopg2.Error as e:
        logging.error(f"Error executing query: {e}")
        return None

def process_coordinates(data):
    conn, cursor = connect_to_db()
    
    if conn is not None and cursor is not None:
        north_east = data.get('NE')
        south_west = data.get('SW')

        xmin = south_west['lng']
        ymin = south_west['lat']
        xmax = north_east['lng']
        ymax = north_east['lat']

        query = sql.SQL("SELECT ST_AsText(geom) AS wkt_geom, * FROM landuse_2017 WHERE ST_Within(geom, ST_MakeEnvelope(%s, %s, %s, %s, 4326))")

        results = execute_query(cursor, query, (xmin, ymin, xmax, ymax))

        close_connection(conn, cursor)

        return results
    else:
        return None

# \\ Flask endpoint //

@app.route('/coordinates', methods=['POST'])
def receive_coordinates():
    data = request.json
    logging.debug(f"## Received data ##")
    logging.debug(data)
    results = process_coordinates(data)

    if results is not None:
        return jsonify(results)
    else:
        return jsonify({"error": "No results found"}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
