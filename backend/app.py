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
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@db_botrip:5432/db_botrip'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Hotel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    views = db.Column(db.Integer, default=0)
    purchases = db.Column(db.Integer, default=0)
    image = db.Column(db.String, default="")

class Package(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Float, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    views = db.Column(db.Integer, default=0)
    purchases = db.Column(db.Integer, default=0)
    image = db.Column(db.String, default="")

def initialize_database():
    with app.app_context():
        engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
        
        with engine.connect() as connection:
            try:
                connection.execute(text('CREATE SCHEMA IF NOT EXISTS public'))
                connection.commit()
            except ProgrammingError:
                connection.rollback()
        
        try:
            db.drop_all()  
            db.create_all() 
            print("Database initialized successfully")
        except SQLAlchemyError as e:
            print(f"Error during database initialization: {str(e)}")

def initialize_data():
    try:
        initialize_database()
        
        if Hotel.query.first() or Package.query.first():
            print("Datos ya inicializados. Saltando la inicialización.")
            return
        
        hotels_data = [
            Hotel(name='Grand Hotel Marina', location='Barcelona', price=200, rating=4.5, views=100, purchases=20, image='https://i.pinimg.com/736x/6d/86/58/6d86581d8d0a8497156a058f909acb53.jpg'),
            Hotel(name='Mountain View Resort', location='Swiss Alps', price=350, rating=4.8, views=80, purchases=15, image='https://i.pinimg.com/736x/ff/91/5a/ff915aa0509250831cd3f65de4a0a801.jpg'),
            Hotel(name='Sunset Beach Hotel', location='Maldives', price=450, rating=4.7, views=120, purchases=25, image='https://i.pinimg.com/736x/bc/95/92/bc95924cc3a4a6ed43c36ae50a513a2e.jpg'),
            Hotel(name='City Center Inn', location='Tokyo', price=150, rating=4.2, views=60, purchases=10, image='https://i.pinimg.com/736x/0e/3b/7c/0e3b7c85380dcecd002bc7edf0c9bb7b.jpg'),
            Hotel(name='Lake Paradise Hotel', location='Lake Como', price=300, rating=4.6, views=90, purchases=18, image='https://i.pinimg.com/736x/c2/85/f2/c285f2820a193b8d1fd3f3024dcceda8.jpg')
        ]
        
        packages_data = [
            Package(name='European Adventure', duration='7 days', price=1500, rating=4.6, views=150, purchases=30, image='https://i.pinimg.com/736x/9a/45/ed/9a45edf377d0753786dea69020d9b112.jpg'),
            Package(name='Tropical Paradise', duration='10 days', price=2000, rating=4.7, views=180, purchases=35, image='https://i.pinimg.com/736x/06/46/80/064680fc1af8adc2d6028e02e26ca303.jpg'),
            Package(name='Asian Discovery', duration='14 days', price=2500, rating=4.8, views=200, purchases=40, image='https://i.pinimg.com/736x/87/55/83/87558355ed8ec5a0ee91ca45a25a5688.jpg'),
            Package(name='African Safari', duration='8 days', price=3000, rating=4.9, views=220, purchases=45, image='https://i.pinimg.com/736x/f9/49/32/f94932e5a4a434fbf75132541f2e012a.jpg'),
            Package(name='American Road Trip', duration='12 days', price=1800, rating=4.5, views=160, purchases=32, image='https://i.pinimg.com/736x/f4/04/d3/f404d3e6b96fe02851b14a0d5b2ef4c2.jpg')
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
            db.session.execute(text('SELECT 1'))
            return jsonify({
                "status": "healthy",
                "message": "Connection successful"
            })
        except SQLAlchemyError as e:
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
        'purchases': h.purchases,
        'image': h.image
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
        'purchases': p.purchases,
        'image': p.image
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

@app.route('/api/recommendations/<product_type>', methods=['GET'])
def get_recommendations(product_type):
    if product_type not in ["hotel", "package"]:
        return jsonify({"error": "Invalid product type"}), 400
    
    Model = Hotel if product_type == "hotel" else Package
    products = Model.query.all()
    
    df = pd.DataFrame([{
        'id': p.id,
        'name': p.name,
        'price': p.price,
        'rating': p.rating,
        'views': p.views,
        'purchases': p.purchases,
        'image': p.image,
        'location' if product_type == "hotel" else 'duration': 
            p.location if product_type == "hotel" else p.duration
    } for p in products])
    
    features = ['price', 'rating', 'views', 'purchases']
    X = df[features].copy()
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=3,
        random_state=42,
        n_jobs=-1
    )
    
    y = df['views'] * 0.3 + df['purchases'] * 0.7
    
    model.fit(X_scaled, y)
    
    feature_importance = dict(zip(features, model.feature_importances_))
    
    df['ml_score'] = model.predict(X_scaled)
    
    df['final_score'] = (
        df['ml_score'] * 0.7 +  # ML prediction weight
        (df['views'] * 0.3 + df['purchases'] * 0.7) * 0.3  # Original score weight
    )
    
    recommended = df.nlargest(5, 'final_score')
    
    recommendations = []
    for _, row in recommended.iterrows():
        explanation = []
        if row['rating'] >= 4.5:
            explanation.append("High customer rating")
        if row['purchases'] > df['purchases'].mean():
            explanation.append("Popular choice")
        if row['views'] > df['views'].mean():
            explanation.append("Frequently viewed")
        if row['price'] < df['price'].mean():
            explanation.append("Good value")
            
        recommendations.append({
            'id': int(row['id']),
            'name': row['name'],
            'price': float(row['price']),
            'rating': float(row['rating']),
            'views': int(row['views']),
            'purchases': int(row['purchases']),
            'image': row['image'],
            'location' if product_type == "hotel" else 'duration': 
                row['location' if product_type == "hotel" else 'duration'],
            'recommendation_reasons': explanation,
            'feature_importance': feature_importance
        })
    
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)