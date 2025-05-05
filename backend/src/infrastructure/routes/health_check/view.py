"""Health Check Routes"""

from flask import Blueprint, jsonify
from flask_restx import Resource, Namespace

health_check_blueprint = Blueprint("health_check", __name__)
health_check_ns = Namespace("Health Check", description="Application Health Check")


@health_check_ns.route("/ping")
class HealthCheck(Resource):
    def get(self):
        """Ping the server."""
        return jsonify({"message": "pong"})
