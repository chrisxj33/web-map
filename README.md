# **Web-Based GIS Application for Land Use Visualisation**

## **Overview**

This project is a web-based Geographic Information System (GIS) application that enables users to visualise land use data within a specific area on a map. The application allows users to interactively select regions and retrieve corresponding land use information from a spatial database. The system is built using modern web technologies alongside a PostgreSQL database with PostGIS extensions for handling spatial queries.

![Screenshot 2024-08-31 214507](https://github.com/user-attachments/assets/5302511a-6c9e-410e-9f83-51a5bfe291a3)

## **Technologies Used**

- **Frontend:**
  - **HTML/CSS:** For structuring and styling the web interface.
  - **JavaScript:** Used for client-side logic and interactions.
  - **Leaflet.js:** A JavaScript library for rendering interactive maps.
  - **Leaflet.draw:** An extension for drawing and editing shapes on the map.
  - **Wicket.js:** For converting Well-Known Text (WKT) to GeoJSON for map rendering.

- **Backend:**
  - **Flask:** A Python web framework for handling API requests and interactions with the database.
  - **psycopg2:** A PostgreSQL adapter for Python to facilitate database operations.
  - **PostGIS:** A spatial database extender for PostgreSQL to support geographic objects.

- **Database:**
  - **PostgreSQL:** A relational database system.
  - **PostGIS:** An extension to manage spatial data and perform geographic queries.

## **Project Structure**

- **Frontend (HTML/CSS/JavaScript):**
  - `index.html`: The main HTML file that sets up the map and interface.
  - `styles.css`: Custom styles for the application’s UI.
  - `script.js`: Contains JavaScript code for initializing the map, handling user interactions, and making AJAX requests to the backend.

- **Backend (Python/Flask):**
  - `app.py`: The Flask application file responsible for handling incoming requests, processing data, and communicating with the PostgreSQL/PostGIS database.

- **Database:**
  - The PostgreSQL database contains spatial data on land use, with queries executed through PostGIS functions.

## **Features**

1. **Interactive Map Interface:**
   - Users can interact with the map by panning, zooming, and drawing a rectangle to select areas of interest.

2. **Data Retrieval:**
   - The "Get Data" button becomes active after an area is selected. When clicked, the coordinates of the selected area are sent to the backend, which queries the spatial database for relevant land use data.

3. **Spatial Querying:**
   - The backend processes the coordinates, queries the database using PostGIS, and returns the relevant land use polygons.

4. **Visualisation:**
   - The retrieved data is displayed on the map with different colors representing various land use types, providing a clear visual distinction.

## **How It Works**

1. **User Interaction:**
   - Users draw a rectangle on the map to define the area of interest.

2. **Backend Processing:**
   - The frontend sends the bounding coordinates to the Flask backend, which queries the PostGIS-enabled PostgreSQL database to retrieve land use data within the selected area.

3. **Data Visualisation:**
   - The backend returns the data in GeoJSON format, and the frontend renders it on the map with color coding based on land use types.
