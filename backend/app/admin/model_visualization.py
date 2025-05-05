from flask_admin import AdminIndexView
from flask_admin.contrib.sqla import ModelView


class CustomIndexView(AdminIndexView):
    def __init__(self):
        super().__init__(template='admin/model/index.html')


class CustomModelView(ModelView):
    form_excluded_columns = ['created_at', 'updated_at']
    can_view_details = True
    list_template = 'admin/model/list.html'
    create_template = 'admin/model/create.html'
    edit_template = 'admin/model/edit.html'
    details_template = 'admin/model/details.html'