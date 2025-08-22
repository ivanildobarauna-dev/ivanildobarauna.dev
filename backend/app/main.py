import subprocess

from flask import Flask
from flask_cors import CORS
from flask_restx import Api

from src.infrastructure.routes.education.view import education_ns
from src.infrastructure.routes.experiences.view import experiences_ns

## Application Dependencies
from src.infrastructure.routes.health_check.view import health_check_ns
from src.infrastructure.routes.projects.view import projects_ns
from src.infrastructure.routes.social_media.view import social_media_ns

from src.infrastructure.dependencie_injection import ApplicationDependencies

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

    def setup(self):
        print("Running ApplicationDependencies setup...")
        ApplicationDependencies.builder().build()
        self.setup_cors()
        self.register_namespaces()
        return self.app


app = ApplicationSetup().setup()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8090, debug=True)
