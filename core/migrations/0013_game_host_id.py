# Generated by Django 3.1.7 on 2021-06-07 23:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_auto_20210603_2139'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='host_id',
            field=models.IntegerField(null=True),
        ),
    ]
