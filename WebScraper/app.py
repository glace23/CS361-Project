from flask_restful import Api
from flask import Flask, make_response
import json
from flask_cors import CORS
import tax
import city
import cityintro
import taxtable

app = Flask(__name__)
CORS(app)
api = Api(app)


@api.representation('application/json')
def output_json(data, code, headers=None):
    resp = make_response(json.dumps(data), code)
    resp.headers.extend(headers or {})
    return resp


@api.representation('application/xml')
def output_xml(data, code, headers=None):
    resp = make_response(json.dumps(data), code)
    resp.headers.extend(headers or {})
    return resp


api.add_resource(city.City, '/citydata')
api.add_resource(tax.Tax, '/taxdata')
api.add_resource(cityintro.CityText, '/citytextdata')
api.add_resource(taxtable.SalesTaxTable, '/salestaxtabledata')

if __name__ == "__main__":
    app.run(port=5000)
