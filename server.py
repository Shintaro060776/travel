from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId

app = Flask(__name__)

CORS(app)

app.config["MONGO_URI"] = "mongodb+srv://shintaro060776:Shin20090317!@cluster0.7jg6tei.mongodb.net/?retryWrites=true&w=majority"

mongo = PyMongo(app)

@app.route('/plans', methods=['GET'])
def get_plans():
    plans = mongo.db.plans.find()
    result = []
    for plan in plans:
        plan['_id'] = str(plan['_id'])  # ObjectIDを文字列に変換
        result.append(plan)
    return jsonify(result)

@app.route('/plans', methods=['POST'])
def add_plan():
    plan_data = request.get_json()
    mongo.db.plans.insert_one(plan_data)
    return jsonify({'message': 'Plan added successfully'}), 201

@app.route('/plans/<id>', methods=['PUT'])
def update_plan(id):
    plan_data = request.get_json()
    mongo.db.plans.update_one({'_id': ObjectId(id)}, {'$set': plan_data})
    return jsonify({'message': 'Plan updated successfully'}), 200

@app.route('/plans/<id>', methods=['DELETE'])
def delete_plan(id):
    mongo.db.plans.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Plan deleted successfully'}), 200

if __name__ == "__main__":
    app.run(debug=True)