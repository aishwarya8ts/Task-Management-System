from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Make sure this is installed

app = Flask(__name__)
CORS(app)  # Allow frontend access

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/task_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Task Model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default='Pending')

# Create Database Tables
with app.app_context():
    db.create_all()

# Routes
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([{'id': task.id, 'title': task.title, 'description': task.description, 'due_date': task.due_date, 'status': task.status} for task in tasks])

@app.route('/task', methods=['POST'])
def add_task():
    data = request.json
    if not data or not data.get('title') or not data.get('due_date'):
        return jsonify({'error': 'Title and Due Date are required'}), 400
    
    new_task = Task(
        title=data['title'], 
        description=data.get('description', ''), 
        due_date=data['due_date'], 
        status=data.get('status', 'Pending')
    )
    
    db.session.add(new_task)
    db.session.commit()
    
    return jsonify({'message': 'Task added successfully', 'task_id': new_task.id})


@app.route('/task/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({'message': 'Task deleted successfully'})




if __name__ == '__main__':
    app.run(debug=True)
