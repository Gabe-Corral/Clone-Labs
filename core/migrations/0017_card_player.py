# Generated by Django 3.1.7 on 2021-06-16 22:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_remove_card_player'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='player',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.player'),
        ),
    ]