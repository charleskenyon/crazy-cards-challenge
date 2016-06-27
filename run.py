from flask import Flask, render_template, jsonify, request, g, Response
import json

app = Flask(__name__)


@app.route('/')
def main_page():
    return render_template('index.html')


@app.route('/get_credit_cards')
def load_credit_cards():
    with open('cards.json') as cards:
        data = json.load(cards)

    if request.args['status'] != 'Student':
        data = [d for d in data if d['name'] != 'Student Life Card']

    if int(request.args['income']) < 16000:
        data = [d for d in data if d['name'] != 'Liquid Card']

    return jsonify({'data': data})


@app.route('/get_customers')
def load_customers():
    with open('customers.json') as customers:
        data = json.load(customers)

    return jsonify({'data': data})

if __name__ == '__main__':
    app.run(debug=True)