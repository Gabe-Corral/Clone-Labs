# Generated by Django 3.1.7 on 2021-05-30 19:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='hand',
            field=models.JSONField(null=True),
        ),
    ]
