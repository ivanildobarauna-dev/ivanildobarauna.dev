from flask import Flask
from flask_admin import Admin

from app.admin.model_visualization import CustomIndexView, CustomModelView
from src.infrastructure.adapters.database.models import (
    CertificationsAdmin,
    ExperiencesAdmin,
    FormationsAdmin,
    ProjectsAdmin,
    SocialsMediaAdmin,
)
from src.infrastructure.application_dependencies import db


def setup_admin(app: Flask):
    """
    Setup Flask-Admin for the application.
    """
    admin = Admin(
        app,
        name="ivanildobarauna.dev",
        template_mode="bootstrap4",
        index_view=CustomIndexView(),
    )

    models = (
        ProjectsAdmin,
        SocialsMediaAdmin,
        ExperiencesAdmin,
        FormationsAdmin,
        CertificationsAdmin,
    )
    for model in models:
        admin.add_view(CustomModelView(model, db.session))
