import subprocess

import logging
from flask import Flask
from flask_cors import CORS
from flask_restx import Api

# Configuração básica de logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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
        logger.info("🛠️  Iniciando configuração da aplicação...")
        self.setup_cors()
        logger.info("✅ CORS configurado")
        
        logger.info("🔄 Inicializando ApplicationDependencies...")
        self.app.dps = ApplicationDependencies()
        logger.info("✅ ApplicationDependencies inicializado")
        
        self.register_namespaces()
        logger.info("✅ Namespaces registrados")
        
        logger.info("🚀 Aplicação configurada com sucesso!")
        return self.app


app = ApplicationSetup().setup()

if __name__ == "__main__":
    logger.info("🚀 Iniciando servidor de desenvolvimento...")
    app.run(host="0.0.0.0", port=8090, debug=True)
