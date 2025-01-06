# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import create_engine, text
from sqlalchemy.schema import CreateSchema
from sqlalchemy.exc import ProgrammingError
from datetime import datetime
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@db_botrip:5432/db_botrip'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class Hotel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    views = db.Column(db.Integer, default=0)
    purchases = db.Column(db.Integer, default=0)

class Package(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Float, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    views = db.Column(db.Integer, default=0)
    purchases = db.Column(db.Integer, default=0)

def initialize_database():
    with app.app_context():
        engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
        
        # Create schema if it doesn't exist
        with engine.connect() as connection:
            try:
                connection.execute(text('CREATE SCHEMA IF NOT EXISTS public'))
                connection.commit()
            except ProgrammingError:
                connection.rollback()
        
        # Drop all tables and create them again
        try:
            db.drop_all()  # Drop all existing tables
            db.create_all()  # Create new tables
            print("Database initialized successfully")
        except SQLAlchemyError as e:
            print(f"Error during database initialization: {str(e)}")

def initialize_data():
    try:
        initialize_database()
        
        # Rest of your initialization code remains the same
        hotels_data = [
            Hotel(name='Grand Hotel Marina', location='Barcelona', price=200, rating=4.5, views=100, purchases=20),
            Hotel(name='Mountain View Resort', location='Swiss Alps', price=350, rating=4.8, views=80, purchases=15),
            Hotel(name='Sunset Beach Hotel', location='Maldives', price=450, rating=4.7, views=120, purchases=25),
            Hotel(name='City Center Inn', location='Tokyo', price=150, rating=4.2, views=60, purchases=10),
            Hotel(name='Lake Paradise Hotel', location='Lake Como', price=300, rating=4.6, views=90, purchases=18)
        ]
        
        packages_data = [
            Package(name='European Adventure', duration='7 days', price=1500, rating=4.6, views=150, purchases=30),
            Package(name='Tropical Paradise', duration='10 days', price=2000, rating=4.7, views=180, purchases=35),
            Package(name='Asian Discovery', duration='14 days', price=2500, rating=4.8, views=200, purchases=40),
            Package(name='African Safari', duration='8 days', price=3000, rating=4.9, views=220, purchases=45),
            Package(name='American Road Trip', duration='12 days', price=1800, rating=4.5, views=160, purchases=32)
        ]
        
        db.session.add_all(hotels_data)
        db.session.add_all(packages_data)
        db.session.commit()
        
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database initialization failed: {str(e)}")
        db.session.rollback()
        
with app.app_context():
    initialize_data()
    
@app.route('/api/health', methods=['GET'])
def health_check():
    with app.app_context():
        try:
            # Execute a simple query to check the connection
            db.session.execute(text('SELECT 1'))
            return jsonify({
                "status": "healthy",
                "message": "Connection successful"
            })
        except SQLAlchemyError as e:
            # Return the error message if connection fails
            return jsonify({
                "status": "unhealthy",
                "message": f"Connection failed! ERROR: {str(e)}"
            }), 500


@app.route('/api/hotels', methods=['GET'])
def get_hotels():
    hotels = Hotel.query.all()
    return jsonify([{
        'id': h.id,
        'name': h.name,
        'location': h.location,
        'price': h.price,
        'rating': h.rating,
        'views': h.views,
        'purchases': h.purchases
    } for h in hotels])

@app.route('/api/packages', methods=['GET'])
def get_packages():
    packages = Package.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'duration': p.duration,
        'price': p.price,
        'rating': p.rating,
        'views': p.views,
        'purchases': p.purchases
    } for p in packages])

@app.route('/api/update-views', methods=['POST'])
def update_views():
    data = request.get_json()
    product_id = data.get('product_id')
    product_type = data.get('product_type')
    
    if not all([product_id, product_type]):
        return jsonify({"error": "Missing required fields"}), 400
    
    Model = Hotel if product_type == "hotel" else Package
    product = Model.query.get(product_id)
    
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    product.views += 1
    db.session.commit()
    
    return jsonify({
        "success": True,
        "new_views": product.views
    })

@app.route('/api/purchase', methods=['POST'])
def register_purchase():
    data = request.get_json()
    product_id = data.get('product_id')
    product_type = data.get('product_type')
    
    if not all([product_id, product_type]):
        return jsonify({"error": "Missing required fields"}), 400
    
    Model = Hotel if product_type == "hotel" else Package
    product = Model.query.get(product_id)
    
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    product.purchases += 1
    db.session.commit()
    
    return jsonify({
        "success": True,
        "new_purchases": product.purchases
    })
# I BELIEVE THE ISSUE LIES ON THE LACK OF THE COLUMN PROCUTS TYPE OR SOME
@app.route('/api/recommendations/<product_type>', methods=['GET'])
def get_recommendations(product_type):
    if product_type not in ["hotel", "package"]:
        return jsonify({"error": "Invalid product type"}), 400
    
    Model = Hotel if product_type == "hotel" else Package
    products = Model.query.all()
    
    # Convert to DataFrame for scoring
    df = pd.DataFrame([{
        'id': p.id,
        'name': p.name,
        'price': p.price,
        'rating': p.rating,
        'views': p.views,
        'purchases': p.purchases,
        'location' if product_type == "hotel" else 'duration': 
            p.location if product_type == "hotel" else p.duration
    } for p in products])
    
    # Calculate score
    df['score'] = df['views'] * 0.3 + df['purchases'] * 0.7
    recommended = df.nlargest(5, 'score')
    
    return jsonify(recommended.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)