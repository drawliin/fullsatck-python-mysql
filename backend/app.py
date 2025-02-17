import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL

port = os.getenv('PORT', 5000)
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)

# MySQL Configuration
app.config['MYSQL_HOST'] = os.getenv('DB_HOST', 'localhost')
app.config['MYSQL_USER'] = os.getenv('DB_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.getenv('DB_PASSWORD', 'password')
app.config['MYSQL_DB'] = os.getenv('DB_NAME', 'test')

mysql = MySQL(app)

# Route to get all users
@app.route('/users', methods=['GET'])
def get_users():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    users_list = [{"id": user[0], "name": user[1]} for user in users]
    return jsonify(users_list)

# Route to add a new user
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    name = data['name']
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO users (name) VALUES (%s)", (name,))
    mysql.connection.commit()
    cursor.close()
    return jsonify({'message': 'User created successfully'}), 201

# Route to update user
@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    name = data['name']
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE users SET name=%s WHERE id=%s", (name, id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({'message': 'User updated successfully'})

# Route to delete a user
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM users WHERE id=%s", (id,))
    mysql.connection.commit()
    cursor.close()
    return jsonify({'message': 'User deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True, port=port)