"""Setup Application"""

import subprocess
from flask import Flask, jsonify
from flask_restx import Api

from flask_cors import CORS
from flask_migrate import Migrate, upgrade
from sqlalchemy import inspect

from app.admin.setup import setup_admin
from src.infrastructure.application_dependencies import db, setup_database
from src.infrastructure.routes.education.view import education_ns
from src.infrastructure.routes.experiences.view import experiences_ns

## Application Dependencies
from src.infrastructure.routes.health_check.view import health_check_ns
from src.infrastructure.routes.projects.view import projects_ns
from src.infrastructure.routes.social_media.view import social_media_ns
from src.infrastructure.utils.logger import logger


class ApplicationSetup:
    def __init__(self):
        self.app = Flask(__name__)
        self.app.url_map.strict_slashes = False
        self.api = Api(
            self.app,
            version=self.get_application_version(),
            title="api.ivanildobarauna.dev",
            description="This is the API documentation for api.ivanildobarauna.dev",
            terms_url="https://github.com/ivanildobarauna-dev/api.ivanildobarauna.dev/blob/main/README.md",
            contact="ivanildo.jnr@outlook.com",
            license="MIT",
            license_url="https://github.com/ivanildobarauna-dev/api.ivanildobarauna.dev/blob/main/LICENSE",
            ordered=True,
            validate=True,
        )
        setup_database(self.app)

    def get_application_version(self) -> str:
        result = subprocess.run(
            ["poetry", "version", "-s"], capture_output=True, text=True, check=True
        )
        return result.stdout.strip()

    def setup_cors(self):
        CORS(
            self.app,
            resources={
                r"/*": {
                    "origins": "*",
                }
            },
        )

    def register_namespaces(self):
        # API Namespaces
        namespaces = [
            experiences_ns,
            education_ns,
            health_check_ns,
            projects_ns,
            social_media_ns,
        ]

        for namespace in namespaces:
            self.api.add_namespace(namespace, path="/api/v1")

    def database_initializer(self):
        with self.app.app_context():
            Migrate(self.app, db)

            inspector = inspect(db.engine)
            if not inspector.has_table("alembic_version"):
                try:
                    db.create_all()
                except Exception as e:
                    logger.error(f"Error creating tables: {e}")
                    raise e
            else:
                upgrade()

    def setup(self):
        self.setup_cors()
        self.database_initializer()
        self.register_namespaces()
        setup_admin(self.app)
        return self.app


app = ApplicationSetup().setup()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8090, debug=True)
