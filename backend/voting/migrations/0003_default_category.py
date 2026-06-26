from django.db import migrations


def create_default_category(apps, schema_editor):
    Category = apps.get_model("voting", "Category")
    Category.objects.create(name="General")


class Migration(migrations.Migration):

    dependencies = [
        ("voting", "0002_category"),
    ]

    operations = [
        migrations.RunPython(create_default_category, migrations.RunPython.noop),
    ]
