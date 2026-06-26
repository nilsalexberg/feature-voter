import django.db.models.deletion
from django.db import migrations, models


def assign_default_category(apps, schema_editor):
    FeatureRequest = apps.get_model("voting", "FeatureRequest")
    Category = apps.get_model("voting", "Category")
    default_category = Category.objects.get(name="General")
    FeatureRequest.objects.filter(category__isnull=True).update(category=default_category)


class Migration(migrations.Migration):

    dependencies = [
        ("voting", "0003_default_category"),
    ]

    operations = [
        migrations.AddField(
            model_name="featurerequest",
            name="category",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="feature_requests",
                to="voting.category",
            ),
        ),
        migrations.RunPython(assign_default_category, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="featurerequest",
            name="category",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="feature_requests",
                to="voting.category",
            ),
        ),
    ]
